/* Apprendre l'arabe classique — logique front-end (Phase 1) */

const TATWEEL = 'ـ';
const VOWEL_SOUND = ['a', 'u', 'i']; // fatha, damma, kasra
const TANWIN_SOUND = ['an', 'un', 'in']; // fathatan, dammatan, kasratan
const CONSONANT_SOUND = {
  'ب': 'b', 'ت': 't', 'م': 'm', 'ن': 'n', 'ل': 'l',
  'ر': 'r', 'س': 's', 'د': 'd', 'ف': 'f', 'ك': 'k',
};

const STORAGE_KEY = 'arabicAppProgress_v1';

const DATA = { letters: [], harakat: [], longVowels: [], tanwin: [], simpleLetters: [], readingWords: [], curriculum: [] };

let currentRoute = 'accueil';

/* ---------- Progress (localStorage) ---------- */

function defaultProgress() {
  return {
    lettersSeen: [],
    lettersQuizBest: 0,
    harakatQuizDone: false,
    harakatQuizBest: 0,
    tanwinQuizDone: false,
    tanwinQuizBest: 0,
    readingLevel1Done: false,
    readingLevel2Done: false,
    finalQuizBest: 0,
    phase1Complete: false,
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return Object.assign(defaultProgress(), JSON.parse(raw));
  } catch (e) {
    return defaultProgress();
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) { /* stockage indisponible : on continue sans persister */ }
}

let PROGRESS = loadProgress();

function updateProgress(patch) {
  PROGRESS = Object.assign(PROGRESS, patch);
  saveProgress(PROGRESS);
}

/* ---------- Utils ---------- */

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch (e) { /* API non disponible : on ignore silencieusement */ }
}

function letterForms(letter, connects) {
  const isolated = letter;
  if (!connects) {
    return { isolated, initial: isolated, medial: TATWEEL + letter, final: TATWEEL + letter };
  }
  return {
    isolated,
    initial: letter + TATWEEL,
    medial: TATWEEL + letter + TATWEEL,
    final: TATWEEL + letter,
  };
}

/* ---------- Data loading ---------- */

async function loadData() {
  const [curriculum, letters, harakatRes, tanwin, reading] = await Promise.all([
    fetch('/api/curriculum').then(r => r.json()),
    fetch('/api/letters').then(r => r.json()),
    fetch('/api/harakat').then(r => r.json()),
    fetch('/api/tanwin').then(r => r.json()),
    fetch('/api/reading').then(r => r.json()),
  ]);
  DATA.curriculum = curriculum;
  DATA.letters = letters;
  DATA.harakat = harakatRes.harakat;
  DATA.longVowels = harakatRes.long_vowels;
  DATA.tanwin = tanwin;
  DATA.simpleLetters = reading.simple_letters;
  DATA.readingWords = reading.words;
}

/* ---------- Router ---------- */

const ROUTES = {
  accueil: renderAccueil,
  alphabet: renderAlphabet,
  harakat: renderHarakat,
  tanwin: renderTanwin,
  lecture: renderLecture,
  'quiz-final': renderQuizFinal,
  programme: renderProgramme,
};

function navigate(route) {
  currentRoute = route;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
  const root = document.getElementById('view-root');
  root.innerHTML = '';
  (ROUTES[route] || renderAccueil)(root);
}

/* ---------- Vue : Accueil ---------- */

function phase1SubTasks() {
  return [
    { label: 'Explorer les 28 lettres', done: PROGRESS.lettersSeen.length >= DATA.letters.length },
    { label: 'Quiz des lettres (≥ 70 %)', done: PROGRESS.lettersQuizBest >= 70 },
    { label: 'Harakat maîtrisées', done: PROGRESS.harakatQuizDone },
    { label: 'Tanwin maîtrisé', done: PROGRESS.tanwinQuizDone },
    { label: 'Lecture syllabique — niveau 1', done: PROGRESS.readingLevel1Done },
    { label: 'Lecture syllabique — niveau 2 (mots)', done: PROGRESS.readingLevel2Done },
    { label: 'Quiz final Phase 1 (≥ 80 %)', done: PROGRESS.phase1Complete },
  ];
}

function renderAccueil(root) {
  const tasks = phase1SubTasks();
  const doneCount = tasks.filter(t => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  root.appendChild(el('h1', null, "Bienvenue dans ton parcours d'arabe classique"));
  root.appendChild(el('p', { class: 'lead' },
    "Programme basé sur le cursus marocain, en 4 phases. Commence par la Phase 1 : l'alphabet et les bases."));

  root.appendChild(el('h2', null, 'Ta progression — Phase 1'));
  root.appendChild(el('div', { class: 'progress-bar-track' },
    el('div', { class: 'progress-bar-fill', style: `width:${pct}%` })));
  const list = el('ul', { class: 'phase-points' });
  tasks.forEach(t => {
    list.appendChild(el('li', null, t.label, t.done ? el('span', { class: 'check-mark' }, '✓') : null));
  });
  root.appendChild(el('div', { class: 'card' }, list));

  root.appendChild(el('h2', null, 'Les 4 phases du programme'));
  DATA.curriculum.forEach(phase => {
    const status = phase.id === 1 && PROGRESS.phase1Complete ? 'done' : phase.status;
    const statusLabel = status === 'active' ? 'En cours' : (status === 'done' ? 'Terminée' : 'À venir');
    const badge = status === 'done' ? '✓' : phase.id;
    const card = el('div', { class: `card phase-card status-${status} clickable` },
      el('div', { class: 'phase-badge' }, String(badge)),
      el('div', null,
        el('div', null,
          el('strong', null, phase.title),
          el('span', { class: `phase-tag ${status}` }, statusLabel)),
        phase.duration ? el('div', { class: 'lead' }, phase.duration) : null,
        el('ul', { class: 'phase-points' }, phase.points.map(p => el('li', null, p))),
        phase.resource ? el('div', { class: 'phase-resource' }, `Ressource : ${phase.resource}`) : null,
      ));
    if (phase.id === 1) card.addEventListener('click', () => navigate('alphabet'));
    root.appendChild(card);
  });
}

/* ---------- Vue : Programme (référentiel complet) ---------- */

function renderProgramme(root) {
  root.appendChild(el('h1', null, "Programme d'apprentissage — Arabe classique"));
  root.appendChild(el('p', { class: 'lead' }, "Le référentiel complet des 4 phases, pour situer où tu en es."));
  DATA.curriculum.forEach(phase => {
    const card = el('div', { class: 'card' },
      el('h2', { style: 'margin-top:0' }, `Phase ${phase.id} — ${phase.title}`),
      phase.duration ? el('p', { class: 'lead' }, phase.duration) : null,
      el('ul', { class: 'phase-points' }, phase.points.map(p => el('li', null, p))));
    if (phase.resource) card.appendChild(el('p', { class: 'phase-resource' }, `Ressource recommandée : ${phase.resource}`));
    if (phase.status === 'coming_soon') card.appendChild(el('p', { class: 'locked-note' }, 'Contenu interactif à venir dans une prochaine version de l’application.'));
    root.appendChild(card);
  });
}

/* ---------- Vue : Alphabet ---------- */

let alphabetMode = 'browse';

function renderAlphabet(root) {
  root.appendChild(el('h1', null, 'Les 28 lettres de l’alphabet'));
  root.appendChild(el('p', { class: 'lead' },
    "Clique sur une lettre pour découvrir ses 4 formes (isolée, début, milieu, fin), son nom et un mot d'exemple."));

  const tabs = el('div', { class: 'level-select' },
    el('button', { class: `btn ${alphabetMode === 'browse' ? '' : 'secondary'}`, onclick: () => { alphabetMode = 'browse'; navigate('alphabet'); } }, 'Explorer'),
    el('button', { class: `btn ${alphabetMode === 'quiz' ? '' : 'secondary'}`, onclick: () => { alphabetMode = 'quiz'; navigate('alphabet'); } }, 'Quiz de reconnaissance'));
  root.appendChild(tabs);

  if (alphabetMode === 'quiz') {
    renderLetterQuiz(root);
    return;
  }

  const grid = el('div', { class: 'letters-grid' });
  DATA.letters.forEach(letter => {
    const seen = PROGRESS.lettersSeen.includes(letter.order);
    const tile = el('div', { class: `letter-tile ${seen ? 'done' : ''}`, onclick: () => openLetterModal(letter) },
      el('span', { class: 'glyph' }, letter.letter),
      el('span', { class: 'translit' }, letter.name_fr));
    grid.appendChild(tile);
  });
  root.appendChild(grid);
}

function letterDetailContent(letter) {
  const forms = letterForms(letter.letter, letter.connects);
  const wrap = el('div', null);
  wrap.appendChild(el('div', { class: 'letter-detail-header' },
    el('span', { class: 'big-glyph' }, letter.letter),
    el('div', { class: 'letter-detail-names' },
      el('span', { class: 'ar' }, letter.name_ar),
      el('span', { class: 'fr' }, `${letter.name_fr} — lettre n°${letter.order}`))));

  wrap.appendChild(el('div', { class: 'forms-row' },
    el('div', { class: 'form-box' }, el('span', { class: 'glyph' }, forms.isolated), el('span', { class: 'label' }, 'Isolée')),
    el('div', { class: 'form-box' }, el('span', { class: 'glyph' }, forms.initial), el('span', { class: 'label' }, 'Début')),
    el('div', { class: 'form-box' }, el('span', { class: 'glyph' }, forms.medial), el('span', { class: 'label' }, 'Milieu')),
    el('div', { class: 'form-box' }, el('span', { class: 'glyph' }, forms.final), el('span', { class: 'label' }, 'Fin'))));

  if (!letter.connects) {
    wrap.appendChild(el('p', { class: 'locked-note' }, "Cette lettre ne se lie jamais à la lettre suivante : pas de forme début/milieu distincte."));
  }

  wrap.appendChild(el('p', null, el('strong', null, 'Son : '), letter.sound_fr));

  wrap.appendChild(el('div', { class: 'example-line' },
    el('span', { class: 'example-word' }, letter.example_word), ' ',
    el('span', { class: 'lead' }, `(${letter.example_translit} — ${letter.example_fr})`)));

  wrap.appendChild(el('button', { class: 'btn secondary listen-btn', onclick: () => speak(letter.example_word) }, '🔊 Écouter'));
  return wrap;
}

function openLetterModal(letter) {
  if (!PROGRESS.lettersSeen.includes(letter.order)) {
    updateProgress({ lettersSeen: [...PROGRESS.lettersSeen, letter.order] });
  }
  const modal = document.getElementById('letter-modal');
  const body = document.getElementById('letter-modal-body');
  body.innerHTML = '';
  body.appendChild(letterDetailContent(letter));
  modal.classList.remove('hidden');
}

function closeLetterModal() {
  document.getElementById('letter-modal').classList.add('hidden');
  if (currentRoute === 'alphabet') navigate('alphabet'); // refresh checkmarks
}

/* ---------- Quiz générique ---------- */

function runQuiz(root, questions, opts) {
  const state = { index: 0, score: 0 };
  const panel = el('div', { class: 'card' });
  root.appendChild(panel);

  function renderQuestion() {
    panel.innerHTML = '';
    if (state.index >= questions.length) {
      renderResult();
      return;
    }
    const q = questions[state.index];
    panel.appendChild(el('div', { class: 'quiz-progress' }, `Question ${state.index + 1} / ${questions.length}`));
    panel.appendChild(el('div', { class: `quiz-prompt ${q.promptClass || ''}` }, q.prompt));
    if (q.onShow) q.onShow();

    const feedback = el('div', { class: 'feedback-line' });
    const optionsBox = el('div', { class: 'quiz-options' });
    q.options.forEach((opt, i) => {
      const optBtn = el('button', { class: 'quiz-option' }, opt);
      optBtn.addEventListener('click', () => {
        Array.from(optionsBox.children).forEach(b => b.disabled = true);
        if (i === q.correctIndex) {
          optBtn.classList.add('correct');
          feedback.textContent = 'Bonne réponse !';
          feedback.className = 'feedback-line correct';
          state.score += 1;
        } else {
          optBtn.classList.add('wrong');
          optionsBox.children[q.correctIndex].classList.add('correct');
          feedback.textContent = `Raté — la bonne réponse était "${q.options[q.correctIndex]}".`;
          feedback.className = 'feedback-line wrong';
        }
        const nextBtn = el('button', { class: 'btn', style: 'margin-top:16px;display:block;margin-left:auto;margin-right:auto;' },
          state.index + 1 < questions.length ? 'Suivant' : 'Voir le résultat');
        nextBtn.addEventListener('click', () => { state.index += 1; renderQuestion(); });
        panel.appendChild(nextBtn);
      });
      optionsBox.appendChild(optBtn);
    });
    panel.appendChild(optionsBox);
    panel.appendChild(feedback);
  }

  function renderResult() {
    const pct = Math.round((state.score / questions.length) * 100);
    const pass = pct >= (opts.passThreshold || 70);
    panel.innerHTML = '';
    panel.appendChild(el('div', { class: 'quiz-result' },
      el('div', null, 'Résultat'),
      el('div', { class: `score ${pass ? 'pass' : 'fail'}` }, `${pct}%`),
      el('div', { class: 'lead' }, `${state.score} / ${questions.length} bonnes réponses`),
      pass
        ? el('p', null, opts.passMessage || 'Bravo, objectif atteint !')
        : el('p', null, opts.failMessage || 'Continue à t’entraîner, tu vas y arriver.'),
      el('button', { class: 'btn', onclick: () => { panel.remove(); root.dispatchEvent(new Event('noop')); navigate(currentRoute); } }, 'Retour'),
    ));
    if (opts.onFinish) opts.onFinish(pct, pass);
  }

  renderQuestion();
}

/* ---------- Quiz : reconnaissance des lettres ---------- */

function renderLetterQuiz(root) {
  const pool = DATA.letters;
  const chosen = sample(pool, Math.min(10, pool.length));
  const questions = chosen.map(letter => {
    const forms = letterForms(letter.letter, letter.connects);
    const formKeys = letter.connects ? ['isolated', 'initial', 'medial', 'final'] : ['isolated', 'final'];
    const formKey = formKeys[Math.floor(Math.random() * formKeys.length)];
    const distractors = sample(pool.filter(l => l.order !== letter.order), 3).map(l => l.name_fr);
    const options = shuffle([letter.name_fr, ...distractors]);
    return {
      prompt: forms[formKey],
      options,
      correctIndex: options.indexOf(letter.name_fr),
    };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Tu reconnais bien les lettres, continue avec les harakat !',
    failMessage: 'Retourne explorer les lettres qui te posent encore problème.',
    onFinish: (pct) => updateProgress({ lettersQuizBest: Math.max(PROGRESS.lettersQuizBest, pct) }),
  });
}

/* ---------- Vue : Harakat ---------- */

function renderHarakat(root) {
  root.appendChild(el('h1', null, 'Les harakat — voyelles courtes'));
  root.appendChild(el('p', { class: 'lead' }, "Trois signes se placent au-dessus ou en dessous des lettres pour indiquer une voyelle brève."));

  const table = el('div', { class: 'card' });
  DATA.harakat.forEach(h => {
    table.appendChild(el('div', { class: 'haraka-row' },
      el('div', { class: 'mark-display' }, TATWEEL + h.mark),
      el('div', { class: 'haraka-info' },
        el('span', { class: 'name-ar' }, h.name_ar),
        el('span', { class: 'name-fr' }, `${h.name_fr} — ${h.sound_fr}`)),
      el('div', { class: 'haraka-example' },
        h.example_syllable,
        el('span', { class: 'translit' }, h.example_translit)),
      el('button', { class: 'btn secondary small', onclick: () => speak(h.example_syllable) }, '🔊')));
  });
  root.appendChild(table);

  root.appendChild(el('h2', null, 'Les voyelles longues'));
  root.appendChild(el('p', { class: 'lead' }, "Une haraka suivie de la lettre correspondante donne une voyelle longue."));
  const lv = el('div', { class: 'card' });
  DATA.longVowels.forEach(v => {
    lv.appendChild(el('div', { class: 'haraka-row' },
      el('div', { class: 'mark-display' }, v.letter),
      el('div', { class: 'haraka-info' }, el('span', { class: 'name-fr' }, `Après une ${v.after} → son "${v.result}" long`)),
      el('div', { class: 'haraka-example' }, v.example_syllable, el('span', { class: 'translit' }, v.example_translit)),
      el('button', { class: 'btn secondary small', onclick: () => speak(v.example_syllable) }, '🔊')));
  });
  root.appendChild(lv);

  root.appendChild(el('h2', null, 'Quiz : reconnaître les syllabes'));
  root.appendChild(el('button', { class: 'btn', onclick: () => renderHarakatQuiz(root) }, 'Commencer le quiz'));
}

function renderHarakatQuiz(root) {
  root.innerHTML = '';
  root.appendChild(el('h1', null, 'Quiz — harakat'));
  const combos = [];
  DATA.simpleLetters.forEach(letter => {
    DATA.harakat.forEach((h, vi) => combos.push({ letter, mark: h.mark, sound: CONSONANT_SOUND[letter] + VOWEL_SOUND[vi] }));
  });
  const chosen = sample(combos, 8);
  const questions = chosen.map(c => {
    const distractors = sample(combos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return {
      prompt: c.letter + c.mark,
      options,
      correctIndex: options.indexOf(c.sound),
    };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Les harakat n’ont plus de secret pour toi.',
    failMessage: 'Reviens revoir le tableau des harakat puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ harakatQuizBest: Math.max(PROGRESS.harakatQuizBest, pct), harakatQuizDone: PROGRESS.harakatQuizDone || pass }),
  });
}

/* ---------- Vue : Tanwin ---------- */

function renderTanwin(root) {
  root.appendChild(el('h1', null, 'Le tanwin (nunation)'));
  root.appendChild(el('p', { class: 'lead' }, "Le tanwin double une haraka en fin de mot pour ajouter un son « n » — souvent sur les noms indéfinis."));

  const table = el('div', { class: 'card' });
  DATA.tanwin.forEach(t => {
    table.appendChild(el('div', { class: 'tanwin-row' },
      el('div', { class: 'mark-display' }, TATWEEL + t.mark),
      el('div', { class: 'haraka-info' },
        el('span', { class: 'name-ar' }, t.name_ar),
        el('span', { class: 'name-fr' }, `${t.name_fr} — ${t.sound_fr}`)),
      el('div', { class: 'haraka-example' }, t.example_word, el('span', { class: 'translit' }, t.example_translit)),
      el('button', { class: 'btn secondary small', onclick: () => speak(t.example_word) }, '🔊')));
  });
  root.appendChild(table);

  root.appendChild(el('h2', null, 'Quiz : reconnaître le tanwin'));
  root.appendChild(el('button', { class: 'btn', onclick: () => renderTanwinQuiz(root) }, 'Commencer le quiz'));
}

function renderTanwinQuiz(root) {
  root.innerHTML = '';
  root.appendChild(el('h1', null, 'Quiz — tanwin'));
  const combos = [];
  DATA.simpleLetters.forEach(letter => {
    DATA.tanwin.forEach((t, vi) => combos.push({ letter, mark: t.mark, sound: CONSONANT_SOUND[letter] + TANWIN_SOUND[vi] }));
  });
  const chosen = sample(combos, 8);
  const questions = chosen.map(c => {
    const distractors = sample(combos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return {
      prompt: c.letter + c.mark,
      options,
      correctIndex: options.indexOf(c.sound),
    };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Le tanwin est acquis !',
    failMessage: 'Revois les trois marques de tanwin puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ tanwinQuizBest: Math.max(PROGRESS.tanwinQuizBest, pct), tanwinQuizDone: PROGRESS.tanwinQuizDone || pass }),
  });
}

/* ---------- Vue : Lecture syllabique ---------- */

let lectureLevel = 1;

function renderLecture(root) {
  root.appendChild(el('h1', null, 'Lecture syllabique'));
  root.appendChild(el('p', { class: 'lead' }, "Entraîne-toi à lire à voix haute, puis vérifie-toi."));

  root.appendChild(el('div', { class: 'level-select' },
    el('button', { class: `btn ${lectureLevel === 1 ? '' : 'secondary'}`, onclick: () => { lectureLevel = 1; navigate('lecture'); } },
      `Niveau 1 : syllabes ${PROGRESS.readingLevel1Done ? '✓' : ''}`),
    el('button', { class: `btn ${lectureLevel === 2 ? '' : 'secondary'}`, onclick: () => { lectureLevel = 2; navigate('lecture'); } },
      `Niveau 2 : mots courts ${PROGRESS.readingLevel2Done ? '✓' : ''}`)));

  if (lectureLevel === 1) renderReadingLevel1(root);
  else renderReadingLevel2(root);
}

function renderReadingLevel1(root) {
  const combos = [];
  DATA.simpleLetters.forEach(letter => {
    DATA.harakat.forEach((h, vi) => combos.push({ letter, mark: h.mark, sound: CONSONANT_SOUND[letter] + VOWEL_SOUND[vi] }));
  });
  const items = shuffle(combos);
  const state = { i: 0, ok: 0 };
  const box = el('div', { class: 'card word-card' });
  root.appendChild(box);

  function show() {
    box.innerHTML = '';
    if (state.i >= items.length) {
      box.appendChild(el('div', null, `Série terminée : ${state.ok} / ${items.length} syllabes bien lues.`));
      box.appendChild(el('button', { class: 'btn', onclick: () => { lectureLevel = 1; navigate('lecture'); } }, 'Recommencer'));
      updateProgress({ readingLevel1Done: true });
      return;
    }
    const item = items[state.i];
    box.appendChild(el('div', { class: 'quiz-progress' }, `Syllabe ${state.i + 1} / ${items.length}`));
    box.appendChild(el('span', { class: 'word' }, item.letter + item.mark));
    const reveal = el('div');
    const showBtn = el('button', { class: 'btn secondary', onclick: () => {
      reveal.innerHTML = '';
      reveal.appendChild(el('p', { class: 'translit' }, `Lecture : ${item.sound}`));
      const goodBtn = el('button', { class: 'btn small', onclick: () => { state.ok += 1; state.i += 1; show(); } }, 'J’ai bien lu');
      const badBtn = el('button', { class: 'btn small secondary', onclick: () => { state.i += 1; show(); } }, 'À revoir');
      reveal.appendChild(el('div', { style: 'display:flex;gap:8px;justify-content:center;margin-top:10px;' }, goodBtn, badBtn));
    } }, 'Afficher la lecture');
    box.appendChild(el('button', { class: 'btn secondary', style: 'margin-right:8px;', onclick: () => speak(item.letter + item.mark) }, '🔊 Écouter'));
    box.appendChild(showBtn);
    box.appendChild(reveal);
  }
  show();
}

function renderReadingLevel2(root) {
  const items = shuffle(DATA.readingWords);
  const state = { i: 0, ok: 0 };
  const box = el('div', { class: 'card word-card' });
  root.appendChild(box);

  function show() {
    box.innerHTML = '';
    if (state.i >= items.length) {
      box.appendChild(el('div', null, `Série terminée : ${state.ok} / ${items.length} mots bien lus.`));
      box.appendChild(el('button', { class: 'btn', onclick: () => { lectureLevel = 2; navigate('lecture'); } }, 'Recommencer'));
      updateProgress({ readingLevel2Done: true });
      return;
    }
    const item = items[state.i];
    box.appendChild(el('div', { class: 'quiz-progress' }, `Mot ${state.i + 1} / ${items.length}`));
    box.appendChild(el('span', { class: 'word' }, item.word));
    const reveal = el('div');
    const showBtn = el('button', { class: 'btn secondary', onclick: () => {
      reveal.innerHTML = '';
      reveal.appendChild(el('p', { class: 'translit' }, item.translit));
      reveal.appendChild(el('p', { class: 'word-meaning' }, item.fr));
      const goodBtn = el('button', { class: 'btn small', onclick: () => { state.ok += 1; state.i += 1; show(); } }, 'J’ai bien lu');
      const badBtn = el('button', { class: 'btn small secondary', onclick: () => { state.i += 1; show(); } }, 'À revoir');
      reveal.appendChild(el('div', { style: 'display:flex;gap:8px;justify-content:center;margin-top:10px;' }, goodBtn, badBtn));
    } }, 'Afficher la lecture');
    box.appendChild(el('button', { class: 'btn secondary', style: 'margin-right:8px;', onclick: () => speak(item.word) }, '🔊 Écouter'));
    box.appendChild(showBtn);
    box.appendChild(reveal);
  }
  show();
}

/* ---------- Vue : Quiz final ---------- */

function renderQuizFinal(root) {
  root.appendChild(el('h1', null, 'Quiz final — Phase 1'));
  root.appendChild(el('p', { class: 'lead' },
    "20 questions mêlant lettres, harakat, tanwin et lecture de mots. Score de 80% requis pour valider la Phase 1."));
  if (PROGRESS.phase1Complete) {
    root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score : ${PROGRESS.finalQuizBest}% — Phase 1 déjà validée !`));
  }
  root.appendChild(el('button', { class: 'btn', onclick: () => startFinalQuiz(root) }, 'Démarrer le quiz final'));
}

function startFinalQuiz(root) {
  root.innerHTML = '';
  root.appendChild(el('h1', null, 'Quiz final — Phase 1'));

  const letterQs = sample(DATA.letters, 6).map(letter => {
    const forms = letterForms(letter.letter, letter.connects);
    const formKeys = letter.connects ? ['isolated', 'initial', 'medial', 'final'] : ['isolated', 'final'];
    const formKey = formKeys[Math.floor(Math.random() * formKeys.length)];
    const distractors = sample(DATA.letters.filter(l => l.order !== letter.order), 3).map(l => l.name_fr);
    const options = shuffle([letter.name_fr, ...distractors]);
    return { prompt: forms[formKey], options, correctIndex: options.indexOf(letter.name_fr) };
  });

  const harakatCombos = [];
  DATA.simpleLetters.forEach(letter => DATA.harakat.forEach((h, vi) => harakatCombos.push({ letter, mark: h.mark, sound: CONSONANT_SOUND[letter] + VOWEL_SOUND[vi] })));
  const harakatQs = sample(harakatCombos, 5).map(c => {
    const distractors = sample(harakatCombos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return { prompt: c.letter + c.mark, options, correctIndex: options.indexOf(c.sound) };
  });

  const tanwinCombos = [];
  DATA.simpleLetters.forEach(letter => DATA.tanwin.forEach((t, vi) => tanwinCombos.push({ letter, mark: t.mark, sound: CONSONANT_SOUND[letter] + TANWIN_SOUND[vi] })));
  const tanwinQs = sample(tanwinCombos, 4).map(c => {
    const distractors = sample(tanwinCombos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return { prompt: c.letter + c.mark, options, correctIndex: options.indexOf(c.sound) };
  });

  const readingQs = sample(DATA.readingWords, 5).map(word => {
    const distractors = sample(DATA.readingWords.filter(w => w.word !== word.word), 3).map(w => w.fr);
    const options = shuffle([word.fr, ...distractors]);
    return { prompt: word.word, promptClass: 'small-prompt', options, correctIndex: options.indexOf(word.fr) };
  });

  const questions = shuffle([...letterQs, ...harakatQs, ...tanwinQs, ...readingQs]);

  runQuiz(root, questions, {
    passThreshold: 80,
    passMessage: 'Félicitations, tu valides la Phase 1 ! Direction la Phase 2 : la grammaire (Al-Kitaab vol. 1 ou Médine Book 1).',
    failMessage: 'Pas encore ! Revois les sections où tu hésites puis retente le quiz final.',
    onFinish: (pct, pass) => updateProgress({ finalQuizBest: Math.max(PROGRESS.finalQuizBest, pct), phase1Complete: PROGRESS.phase1Complete || pass }),
  });
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('letter-modal-close').addEventListener('click', closeLetterModal);
  document.getElementById('letter-modal').addEventListener('click', (e) => {
    if (e.target.id === 'letter-modal') closeLetterModal();
  });
  document.getElementById('main-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn) navigate(btn.dataset.route);
  });

  await loadData();
  navigate('accueil');
});
