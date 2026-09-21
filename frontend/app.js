/* Apprendre l'arabe classique — logique front-end (Phases 1 à 4) */

const TATWEEL = 'ـ';
const VOWEL_SOUND = ['a', 'u', 'i']; // fatha, damma, kasra
const TANWIN_SOUND = ['an', 'un', 'in']; // fathatan, dammatan, kasratan
const CONSONANT_SOUND = {
  'ب': 'b', 'ت': 't', 'م': 'm', 'ن': 'n', 'ل': 'l',
  'ر': 'r', 'س': 's', 'د': 'd', 'ف': 'f', 'ك': 'k',
};

const CASE_QUIZ_WORDS = [
  { word: 'الْبَيْتُ', case: 'marfu' }, { word: 'الْبَيْتَ', case: 'mansub' }, { word: 'الْبَيْتِ', case: 'majrur' },
  { word: 'الْوَلَدُ', case: 'marfu' }, { word: 'الْوَلَدَ', case: 'mansub' }, { word: 'الْوَلَدِ', case: 'majrur' },
  { word: 'الْقَلَمُ', case: 'marfu' }, { word: 'الْقَلَمَ', case: 'mansub' }, { word: 'الْقَلَمِ', case: 'majrur' },
  { word: 'الشَّمْسُ', case: 'marfu' }, { word: 'الشَّمْسَ', case: 'mansub' }, { word: 'الشَّمْسِ', case: 'majrur' },
];

const QURAN_QUIZ = [
  { q: 'Combien de versets contient Al-Fâtiha ?', options: ['4', '5', '7', '9'], correct: 2 },
  { q: 'Combien de versets contient Al-Ikhlâs ?', options: ['3', '4', '5', '6'], correct: 1 },
  { q: "Que signifie « الرَّحْمَٰنِ » ?", options: ['Le Tout Miséricordieux', 'Le Roi', 'Le Créateur', 'Le Juge'], correct: 0 },
  { q: "Que signifie « أَحَدٌ » dans Al-Ikhlâs ?", options: ['Unique', 'Grand', 'Éternel', 'Puissant'], correct: 0 },
];

const STORAGE_KEY = 'arabicAppProgress_v2';

const DATA = {
  letters: [], harakat: [], longVowels: [], tanwin: [], simpleLetters: [], readingWords: [], curriculum: [],
  phase2: { pronouns: [], gender_number: [], nominal_sentences: [], verbal_sentences: [], cases: [] },
  phase3: { vocab_categories: [], reading_texts: [], roots: [] },
  phase4: { proverbs: [], poetry: [], morphology_forms: [], rhetoric_figures: [], quran_texts: [] },
};

let currentRoute = 'accueil';

/* ---------- Progress (localStorage) ---------- */

function defaultProgress() {
  return {
    lettersSeen: [], lettersQuizBest: 0,
    harakatQuizDone: false, harakatQuizBest: 0,
    tanwinQuizDone: false, tanwinQuizBest: 0,
    readingLevel1Done: false, readingLevel2Done: false,
    finalQuizBest: 0, phase1Complete: false,

    pronounsQuizDone: false, pronounsQuizBest: 0,
    genderNumberQuizDone: false, genderNumberQuizBest: 0,
    nominalQuizDone: false, nominalQuizBest: 0,
    verbalQuizDone: false, verbalQuizBest: 0,
    casesQuizDone: false, casesQuizBest: 0,
    phase2FinalBest: 0, phase2Complete: false,

    vocabCategoriesDone: [], vocabQuizBest: {},
    readingTextsDone: [],
    rootsQuizDone: false, rootsQuizBest: 0,
    phase3FinalBest: 0, phase3Complete: false,

    proverbsSeen: false, poetrySeen: false,
    morphologySeen: false, rhetoricSeen: false,
    quranSeen: [],
    phase4FinalBest: 0, phase4Complete: false,
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
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) { /* stockage indisponible */ }
}

let PROGRESS = loadProgress();

function updateProgress(patch) {
  PROGRESS = Object.assign(PROGRESS, patch);
  saveProgress(PROGRESS);
}

function addUnique(arrKey, value) {
  if (!PROGRESS[arrKey].includes(value)) {
    updateProgress({ [arrKey]: [...PROGRESS[arrKey], value] });
  }
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

function sample(arr, n) { return shuffle(arr).slice(0, n); }

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch (e) { /* API non disponible */ }
}

function letterForms(letter, connects) {
  const isolated = letter;
  if (!connects) return { isolated, initial: isolated, medial: TATWEEL + letter, final: TATWEEL + letter };
  return { isolated, initial: letter + TATWEEL, medial: TATWEEL + letter + TATWEEL, final: TATWEEL + letter };
}

function listenBtn(text) {
  return el('button', { class: 'btn secondary small', onclick: () => speak(text) }, '🔊');
}

/* ---------- Data loading ---------- */

async function loadData() {
  const [curriculum, letters, harakatRes, tanwin, reading, phase2, phase3, phase4] = await Promise.all([
    fetch('/api/curriculum').then(r => r.json()),
    fetch('/api/letters').then(r => r.json()),
    fetch('/api/harakat').then(r => r.json()),
    fetch('/api/tanwin').then(r => r.json()),
    fetch('/api/reading').then(r => r.json()),
    fetch('/api/phase2').then(r => r.json()),
    fetch('/api/phase3').then(r => r.json()),
    fetch('/api/phase4').then(r => r.json()),
  ]);
  DATA.curriculum = curriculum;
  DATA.letters = letters;
  DATA.harakat = harakatRes.harakat;
  DATA.longVowels = harakatRes.long_vowels;
  DATA.tanwin = tanwin;
  DATA.simpleLetters = reading.simple_letters;
  DATA.readingWords = reading.words;
  DATA.phase2 = phase2;
  DATA.phase3 = phase3;
  DATA.phase4 = phase4;
}

/* ---------- Router ---------- */

const ROUTES = {
  accueil: renderAccueil,
  phase1: renderPhase1,
  phase2: renderPhase2,
  phase3: renderPhase3,
  phase4: renderPhase4,
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
  window.scrollTo(0, 0);
}

function renderSubTabs(root, tabs, active, onSelect) {
  const nav = el('div', { class: 'subnav' });
  tabs.forEach(t => {
    const btn = el('button', { class: t.key === active ? 'active' : '', onclick: () => onSelect(t.key) },
      t.label, t.done ? el('span', { class: 'done-mark' }, ' ✓') : null);
    nav.appendChild(btn);
  });
  root.appendChild(nav);
}

function renderPhaseShell(root, opts) {
  root.appendChild(el('h1', null, opts.title));
  if (opts.lead) root.appendChild(el('p', { class: 'lead' }, opts.lead));
  renderSubTabs(root, opts.tabs, opts.active, opts.onSelect);
  const content = el('div', { class: 'phase-content' });
  root.appendChild(content);
  opts.render(content);
}

/* ---------- Quiz générique ---------- */

function runQuiz(root, questions, opts) {
  const state = { index: 0, score: 0 };
  const panel = el('div', { class: 'card' });
  root.appendChild(panel);

  function renderQuestion() {
    panel.innerHTML = '';
    if (state.index >= questions.length) { renderResult(); return; }
    const q = questions[state.index];
    panel.appendChild(el('div', { class: 'quiz-progress' }, `Question ${state.index + 1} / ${questions.length}`));
    panel.appendChild(el('div', { class: `quiz-prompt ${q.promptClass || ''}` }, q.prompt));
    if (q.note) panel.appendChild(el('p', { class: 'quiz-note' }, q.note));

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
      pass ? el('p', null, opts.passMessage || 'Bravo, objectif atteint !')
        : el('p', null, opts.failMessage || 'Continue à t’entraîner, tu vas y arriver.'),
      el('button', { class: 'btn', onclick: () => navigate(currentRoute) }, 'Retour'),
    ));
    if (opts.onFinish) opts.onFinish(pct, pass);
  }

  renderQuestion();
}

function mcqFromList(items, opts) {
  // opts: {getPrompt, getOptionText, getCorrectValue, distractorPool, promptClass, note}
  return items.map(item => {
    const correct = opts.getCorrectValue(item);
    const poolValues = opts.distractorPool.filter(v => v !== correct);
    const distractors = sample(poolValues, 3);
    const options = shuffle([...new Set([correct, ...distractors])]);
    while (options.length < Math.min(4, opts.distractorPool.length + 1)) options.push(correct + ' ');
    return {
      prompt: opts.getPrompt(item),
      promptClass: opts.promptClass,
      note: opts.note,
      options,
      correctIndex: options.indexOf(correct),
    };
  });
}

/* ---------- Vue : Accueil ---------- */

function phaseSubTasks(id) {
  if (id === 1) return [
    { label: 'Explorer les 28 lettres', done: PROGRESS.lettersSeen.length >= DATA.letters.length },
    { label: 'Quiz des lettres (≥ 70 %)', done: PROGRESS.lettersQuizBest >= 70 },
    { label: 'Harakat maîtrisées', done: PROGRESS.harakatQuizDone },
    { label: 'Tanwin maîtrisé', done: PROGRESS.tanwinQuizDone },
    { label: 'Lecture syllabique — niveau 1', done: PROGRESS.readingLevel1Done },
    { label: 'Lecture syllabique — niveau 2 (mots)', done: PROGRESS.readingLevel2Done },
    { label: 'Quiz final Phase 1 (≥ 80 %)', done: PROGRESS.phase1Complete },
  ];
  if (id === 2) return [
    { label: 'Pronoms personnels (quiz ≥ 70 %)', done: PROGRESS.pronounsQuizDone },
    { label: 'Genre et nombre (quiz ≥ 70 %)', done: PROGRESS.genderNumberQuizDone },
    { label: 'Phrase nominale (exercice ≥ 70 %)', done: PROGRESS.nominalQuizDone },
    { label: 'Phrase verbale (exercice ≥ 70 %)', done: PROGRESS.verbalQuizDone },
    { label: 'Cas grammaticaux (quiz ≥ 70 %)', done: PROGRESS.casesQuizDone },
    { label: 'Quiz final Phase 2 (≥ 75 %)', done: PROGRESS.phase2Complete },
  ];
  if (id === 3) return [
    { label: 'Explorer 5 catégories de vocabulaire ou plus', done: PROGRESS.vocabCategoriesDone.length >= 5 },
    { label: 'Lire les 6 textes courts', done: PROGRESS.readingTextsDone.length >= 6 },
    { label: 'Quiz des racines trilitères (≥ 70 %)', done: PROGRESS.rootsQuizDone },
    { label: 'Quiz final Phase 3 (≥ 75 %)', done: PROGRESS.phase3Complete },
  ];
  return [
    { label: 'Découvrir proverbes et poésie classique', done: PROGRESS.proverbsSeen && PROGRESS.poetrySeen },
    { label: 'Étudier les formes verbales et la rhétorique', done: PROGRESS.morphologySeen && PROGRESS.rhetoricSeen },
    { label: 'Lire Al-Fâtiha et Al-Ikhlâs', done: PROGRESS.quranSeen.length >= 2 },
    { label: 'Quiz final Phase 4 (≥ 75 %)', done: PROGRESS.phase4Complete },
  ];
}

function phasePercent(id) {
  const tasks = phaseSubTasks(id);
  return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
}

function renderAccueil(root) {
  root.appendChild(el('h1', null, "Bienvenue dans ton parcours d'arabe classique"));
  root.appendChild(el('p', { class: 'lead' },
    "Programme basé sur le cursus marocain, en 4 phases : de l'alphabet jusqu'à la lecture avancée."));

  const completedPhases = [1, 2, 3, 4].filter(id => PROGRESS[`phase${id}Complete`]).length;
  root.appendChild(el('h2', null, 'Ta progression globale'));
  root.appendChild(el('div', { class: 'progress-bar-track' },
    el('div', { class: 'progress-bar-fill', style: `width:${completedPhases * 25}%` })));
  root.appendChild(el('p', { class: 'lead' }, `${completedPhases} / 4 phases validées`));

  const nextPhase = [1, 2, 3, 4].find(id => !PROGRESS[`phase${id}Complete`]) || 4;
  const nextTitle = DATA.curriculum.find(p => p.id === nextPhase)?.title || '';
  root.appendChild(el('h2', null, 'Prochaine étape'));
  const tasks = phaseSubTasks(nextPhase);
  const list = el('ul', { class: 'phase-points' });
  tasks.forEach(t => list.appendChild(el('li', null, t.label, t.done ? el('span', { class: 'check-mark' }, '✓') : null)));
  root.appendChild(el('div', { class: 'card next-step-card' },
    el('strong', null, `Phase ${nextPhase} — ${nextTitle}`),
    el('div', { class: 'progress-bar-track' }, el('div', { class: 'progress-bar-fill', style: `width:${phasePercent(nextPhase)}%` })),
    list,
    el('button', { class: 'btn', onclick: () => navigate(`phase${nextPhase}`) }, 'Continuer')));

  root.appendChild(el('h2', null, 'Les 4 phases du programme'));
  DATA.curriculum.forEach(phase => {
    const complete = PROGRESS[`phase${phase.id}Complete`];
    const status = complete ? 'done' : 'active';
    const pct = phasePercent(phase.id);
    const card = el('div', { class: `card phase-card status-${status} clickable` },
      el('div', { class: 'phase-badge' }, complete ? '✓' : String(phase.id)),
      el('div', { style: 'flex:1' },
        el('div', null,
          el('strong', null, phase.title),
          el('span', { class: 'phase-mini-badge' }, `${pct}%`)),
        phase.duration ? el('div', { class: 'lead' }, phase.duration) : null,
        el('ul', { class: 'phase-points' }, phase.points.map(p => el('li', null, p))),
        phase.resource ? el('div', { class: 'phase-resource' }, `Ressource : ${phase.resource}`) : null,
      ));
    card.addEventListener('click', () => navigate(`phase${phase.id}`));
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
    card.appendChild(el('button', { class: 'btn secondary', style: 'margin-top:10px', onclick: () => navigate(`phase${phase.id}`) }, 'Ouvrir cette phase'));
    root.appendChild(card);
  });
}

/* =====================================================================
   PHASE 1 — Alphabet et bases
   ===================================================================== */

let phase1Tab = 'alphabet';
let alphabetMode = 'browse';
let lectureLevel = 1;

function renderPhase1(root) {
  renderPhaseShell(root, {
    title: 'Phase 1 — L’alphabet et les bases',
    lead: '4 à 6 semaines : les 28 lettres, les harakat, le tanwin, la lecture syllabique.',
    tabs: [
      { key: 'alphabet', label: 'Alphabet' },
      { key: 'harakat', label: 'Harakat' },
      { key: 'tanwin', label: 'Tanwin' },
      { key: 'lecture', label: 'Lecture' },
      { key: 'quiz', label: 'Quiz final', done: PROGRESS.phase1Complete },
    ],
    active: phase1Tab,
    onSelect: (k) => { phase1Tab = k; navigate('phase1'); },
    render: (content) => {
      if (phase1Tab === 'alphabet') renderAlphabetSection(content);
      else if (phase1Tab === 'harakat') renderHarakatSection(content);
      else if (phase1Tab === 'tanwin') renderTanwinSection(content);
      else if (phase1Tab === 'lecture') renderLectureSection(content);
      else renderQuizFinalIntro(content);
    },
  });
}

function renderAlphabetSection(root) {
  root.appendChild(el('p', { class: 'lead' },
    "Clique sur une lettre pour découvrir ses 4 formes (isolée, début, milieu, fin), son nom et un mot d'exemple."));

  root.appendChild(el('div', { class: 'level-select' },
    el('button', { class: `btn ${alphabetMode === 'browse' ? '' : 'secondary'}`, onclick: () => { alphabetMode = 'browse'; navigate('phase1'); } }, 'Explorer'),
    el('button', { class: `btn ${alphabetMode === 'quiz' ? '' : 'secondary'}`, onclick: () => { alphabetMode = 'quiz'; navigate('phase1'); } }, 'Quiz de reconnaissance')));

  if (alphabetMode === 'quiz') { renderLetterQuiz(root); return; }

  const grid = el('div', { class: 'letters-grid' });
  DATA.letters.forEach(letter => {
    const seen = PROGRESS.lettersSeen.includes(letter.order);
    grid.appendChild(el('div', { class: `letter-tile ${seen ? 'done' : ''}`, onclick: () => openLetterModal(letter) },
      el('span', { class: 'glyph' }, letter.letter),
      el('span', { class: 'translit' }, letter.name_fr)));
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

  if (!letter.connects) wrap.appendChild(el('p', { class: 'locked-note' }, "Cette lettre ne se lie jamais à la lettre suivante : pas de forme début/milieu distincte."));

  wrap.appendChild(el('p', null, el('strong', null, 'Son : '), letter.sound_fr));
  wrap.appendChild(el('div', { class: 'example-line' },
    el('span', { class: 'example-word' }, letter.example_word), ' ',
    el('span', { class: 'lead' }, `(${letter.example_translit} — ${letter.example_fr})`)));
  wrap.appendChild(el('button', { class: 'btn secondary listen-btn', onclick: () => speak(letter.example_word) }, '🔊 Écouter'));
  return wrap;
}

function openLetterModal(letter) {
  if (!PROGRESS.lettersSeen.includes(letter.order)) updateProgress({ lettersSeen: [...PROGRESS.lettersSeen, letter.order] });
  const modal = document.getElementById('letter-modal');
  const body = document.getElementById('letter-modal-body');
  body.innerHTML = '';
  body.appendChild(letterDetailContent(letter));
  modal.classList.remove('hidden');
}

function closeLetterModal() {
  document.getElementById('letter-modal').classList.add('hidden');
  if (currentRoute === 'phase1') navigate('phase1');
}

function renderLetterQuiz(root) {
  const pool = DATA.letters;
  const chosen = sample(pool, Math.min(10, pool.length));
  const questions = chosen.map(letter => {
    const forms = letterForms(letter.letter, letter.connects);
    const formKeys = letter.connects ? ['isolated', 'initial', 'medial', 'final'] : ['isolated', 'final'];
    const formKey = formKeys[Math.floor(Math.random() * formKeys.length)];
    const distractors = sample(pool.filter(l => l.order !== letter.order), 3).map(l => l.name_fr);
    const options = shuffle([letter.name_fr, ...distractors]);
    return { prompt: forms[formKey], options, correctIndex: options.indexOf(letter.name_fr) };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Tu reconnais bien les lettres, continue avec les harakat !',
    failMessage: 'Retourne explorer les lettres qui te posent encore problème.',
    onFinish: (pct) => updateProgress({ lettersQuizBest: Math.max(PROGRESS.lettersQuizBest, pct) }),
  });
}

function renderHarakatSection(root) {
  root.appendChild(el('p', { class: 'lead' }, "Trois signes se placent au-dessus ou en dessous des lettres pour indiquer une voyelle brève."));
  const table = el('div', { class: 'card' });
  DATA.harakat.forEach(h => {
    table.appendChild(el('div', { class: 'haraka-row' },
      el('div', { class: 'mark-display' }, TATWEEL + h.mark),
      el('div', { class: 'haraka-info' }, el('span', { class: 'name-ar' }, h.name_ar), el('span', { class: 'name-fr' }, `${h.name_fr} — ${h.sound_fr}`)),
      el('div', { class: 'haraka-example' }, h.example_syllable, el('span', { class: 'translit' }, h.example_translit)),
      listenBtn(h.example_syllable)));
  });
  root.appendChild(table);

  root.appendChild(el('h2', null, 'Les voyelles longues'));
  const lv = el('div', { class: 'card' });
  DATA.longVowels.forEach(v => {
    lv.appendChild(el('div', { class: 'haraka-row' },
      el('div', { class: 'mark-display' }, v.letter),
      el('div', { class: 'haraka-info' }, el('span', { class: 'name-fr' }, `Après une ${v.after} → son "${v.result}" long`)),
      el('div', { class: 'haraka-example' }, v.example_syllable, el('span', { class: 'translit' }, v.example_translit)),
      listenBtn(v.example_syllable)));
  });
  root.appendChild(lv);

  root.appendChild(el('h2', null, 'Quiz : reconnaître les syllabes'));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderHarakatQuiz(root); } }, 'Commencer le quiz'));
}

function renderHarakatQuiz(root) {
  const combos = [];
  DATA.simpleLetters.forEach(letter => DATA.harakat.forEach((h, vi) => combos.push({ letter, mark: h.mark, sound: CONSONANT_SOUND[letter] + VOWEL_SOUND[vi] })));
  const chosen = sample(combos, 8);
  const questions = chosen.map(c => {
    const distractors = sample(combos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return { prompt: c.letter + c.mark, options, correctIndex: options.indexOf(c.sound) };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Les harakat n’ont plus de secret pour toi.',
    failMessage: 'Reviens revoir le tableau des harakat puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ harakatQuizBest: Math.max(PROGRESS.harakatQuizBest, pct), harakatQuizDone: PROGRESS.harakatQuizDone || pass }),
  });
}

function renderTanwinSection(root) {
  root.appendChild(el('p', { class: 'lead' }, "Le tanwin double une haraka en fin de mot pour ajouter un son « n » — souvent sur les noms indéfinis."));
  const table = el('div', { class: 'card' });
  DATA.tanwin.forEach(t => {
    table.appendChild(el('div', { class: 'tanwin-row' },
      el('div', { class: 'mark-display' }, TATWEEL + t.mark),
      el('div', { class: 'haraka-info' }, el('span', { class: 'name-ar' }, t.name_ar), el('span', { class: 'name-fr' }, `${t.name_fr} — ${t.sound_fr}`)),
      el('div', { class: 'haraka-example' }, t.example_word, el('span', { class: 'translit' }, t.example_translit)),
      listenBtn(t.example_word)));
  });
  root.appendChild(table);
  root.appendChild(el('h2', null, 'Quiz : reconnaître le tanwin'));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderTanwinQuiz(root); } }, 'Commencer le quiz'));
}

function renderTanwinQuiz(root) {
  const combos = [];
  DATA.simpleLetters.forEach(letter => DATA.tanwin.forEach((t, vi) => combos.push({ letter, mark: t.mark, sound: CONSONANT_SOUND[letter] + TANWIN_SOUND[vi] })));
  const chosen = sample(combos, 8);
  const questions = chosen.map(c => {
    const distractors = sample(combos.filter(x => x.sound !== c.sound), 3).map(x => x.sound);
    const options = shuffle([...new Set([c.sound, ...distractors])]);
    while (options.length < 4) options.push(c.sound + "'");
    return { prompt: c.letter + c.mark, options, correctIndex: options.indexOf(c.sound) };
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Le tanwin est acquis !',
    failMessage: 'Revois les trois marques de tanwin puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ tanwinQuizBest: Math.max(PROGRESS.tanwinQuizBest, pct), tanwinQuizDone: PROGRESS.tanwinQuizDone || pass }),
  });
}

function renderLectureSection(root) {
  root.appendChild(el('p', { class: 'lead' }, "Entraîne-toi à lire à voix haute, puis vérifie-toi."));
  root.appendChild(el('div', { class: 'level-select' },
    el('button', { class: `btn ${lectureLevel === 1 ? '' : 'secondary'}`, onclick: () => { lectureLevel = 1; navigate('phase1'); } }, `Niveau 1 : syllabes ${PROGRESS.readingLevel1Done ? '✓' : ''}`),
    el('button', { class: `btn ${lectureLevel === 2 ? '' : 'secondary'}`, onclick: () => { lectureLevel = 2; navigate('phase1'); } }, `Niveau 2 : mots courts ${PROGRESS.readingLevel2Done ? '✓' : ''}`)));
  if (lectureLevel === 1) renderReadingLevel1(root); else renderReadingLevel2(root);
}

function selfCheckFlow(root, items, opts) {
  const state = { i: 0, ok: 0 };
  const box = el('div', { class: 'card word-card' });
  root.appendChild(box);
  function show() {
    box.innerHTML = '';
    if (state.i >= items.length) {
      box.appendChild(el('div', null, `Série terminée : ${state.ok} / ${items.length} bien lus.`));
      box.appendChild(el('button', { class: 'btn', onclick: opts.onRestart }, 'Recommencer'));
      opts.onComplete();
      return;
    }
    const item = items[state.i];
    box.appendChild(el('div', { class: 'quiz-progress' }, `${opts.label} ${state.i + 1} / ${items.length}`));
    box.appendChild(el('span', { class: 'word' }, opts.getWord(item)));
    const reveal = el('div');
    box.appendChild(el('button', { class: 'btn secondary', style: 'margin-right:8px;', onclick: () => speak(opts.getWord(item)) }, '🔊 Écouter'));
    box.appendChild(el('button', {
      class: 'btn secondary', onclick: () => {
        reveal.innerHTML = '';
        opts.getReveal(item).forEach(node => reveal.appendChild(node));
        const goodBtn = el('button', { class: 'btn small', onclick: () => { state.ok += 1; state.i += 1; show(); } }, 'J’ai bien lu');
        const badBtn = el('button', { class: 'btn small secondary', onclick: () => { state.i += 1; show(); } }, 'À revoir');
        reveal.appendChild(el('div', { style: 'display:flex;gap:8px;justify-content:center;margin-top:10px;' }, goodBtn, badBtn));
      },
    }, 'Afficher la lecture'));
    box.appendChild(reveal);
  }
  show();
}

function renderReadingLevel1(root) {
  const combos = [];
  DATA.simpleLetters.forEach(letter => DATA.harakat.forEach((h, vi) => combos.push({ letter, mark: h.mark, sound: CONSONANT_SOUND[letter] + VOWEL_SOUND[vi] })));
  selfCheckFlow(root, shuffle(combos), {
    label: 'Syllabe',
    getWord: (item) => item.letter + item.mark,
    getReveal: (item) => [el('p', { class: 'translit' }, `Lecture : ${item.sound}`)],
    onRestart: () => { lectureLevel = 1; navigate('phase1'); },
    onComplete: () => updateProgress({ readingLevel1Done: true }),
  });
}

function renderReadingLevel2(root) {
  selfCheckFlow(root, shuffle(DATA.readingWords), {
    label: 'Mot',
    getWord: (item) => item.word,
    getReveal: (item) => [el('p', { class: 'translit' }, item.translit), el('p', { class: 'word-meaning' }, item.fr)],
    onRestart: () => { lectureLevel = 2; navigate('phase1'); },
    onComplete: () => updateProgress({ readingLevel2Done: true }),
  });
}

function renderQuizFinalIntro(root) {
  root.appendChild(el('p', { class: 'lead' }, "20 questions mêlant lettres, harakat, tanwin et lecture de mots. Score de 80% requis pour valider la Phase 1."));
  if (PROGRESS.phase1Complete) root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score : ${PROGRESS.finalQuizBest}% — Phase 1 déjà validée !`));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; startPhase1FinalQuiz(root); } }, 'Démarrer le quiz final'));
}

function startPhase1FinalQuiz(root) {
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
    passMessage: 'Félicitations, tu valides la Phase 1 ! Direction la Phase 2 : la grammaire.',
    failMessage: 'Pas encore ! Revois les sections où tu hésites puis retente le quiz final.',
    onFinish: (pct, pass) => updateProgress({ finalQuizBest: Math.max(PROGRESS.finalQuizBest, pct), phase1Complete: PROGRESS.phase1Complete || pass }),
  });
}

/* =====================================================================
   PHASE 2 — Grammaire fondamentale (النحو)
   ===================================================================== */

let phase2Tab = 'pronoms';

function renderPhase2(root) {
  renderPhaseShell(root, {
    title: 'Phase 2 — Grammaire fondamentale (النحو)',
    lead: '3 à 6 mois : pronoms, genre et nombre, phrase nominale/verbale, cas grammaticaux.',
    tabs: [
      { key: 'pronoms', label: 'Pronoms', done: PROGRESS.pronounsQuizDone },
      { key: 'genre-nombre', label: 'Genre & nombre', done: PROGRESS.genderNumberQuizDone },
      { key: 'phrase-nominale', label: 'Phrase nominale', done: PROGRESS.nominalQuizDone },
      { key: 'phrase-verbale', label: 'Phrase verbale', done: PROGRESS.verbalQuizDone },
      { key: 'cas', label: 'Cas grammaticaux', done: PROGRESS.casesQuizDone },
      { key: 'quiz', label: 'Quiz final', done: PROGRESS.phase2Complete },
    ],
    active: phase2Tab,
    onSelect: (k) => { phase2Tab = k; navigate('phase2'); },
    render: (content) => {
      if (phase2Tab === 'pronoms') renderPronounsSection(content);
      else if (phase2Tab === 'genre-nombre') renderGenderNumberSection(content);
      else if (phase2Tab === 'phrase-nominale') renderNominalSection(content);
      else if (phase2Tab === 'phrase-verbale') renderVerbalSection(content);
      else if (phase2Tab === 'cas') renderCasesSection(content);
      else renderPhase2QuizIntro(content);
    },
  });
}

function renderPronounsSection(root) {
  root.appendChild(el('p', { class: 'lead' }, 'Les pronoms personnels isolés (الضمائر المنفصلة).'));
  const table = el('div', { class: 'card' });
  DATA.phase2.pronouns.forEach(p => {
    table.appendChild(el('div', { class: 'list-row' },
      el('span', { class: 'ar-cell' }, p.ar),
      el('span', { class: 'translit-cell' }, `${p.translit} — ${p.person}`),
      el('span', { class: 'fr-cell' }, p.fr),
      listenBtn(p.ar)));
  });
  root.appendChild(table);
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderPronounsQuiz(root); } }, 'Commencer le quiz'));
}

function renderPronounsQuiz(root) {
  const items = sample(DATA.phase2.pronouns, Math.min(10, DATA.phase2.pronouns.length));
  const allMeanings = DATA.phase2.pronouns.map(p => p.fr);
  const questions = mcqFromList(items, {
    getPrompt: (p) => p.ar,
    getCorrectValue: (p) => p.fr,
    distractorPool: allMeanings,
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Les pronoms personnels sont acquis !',
    failMessage: 'Revois le tableau des pronoms puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ pronounsQuizBest: Math.max(PROGRESS.pronounsQuizBest, pct), pronounsQuizDone: PROGRESS.pronounsQuizDone || pass }),
  });
}

function renderGenderNumberSection(root) {
  root.appendChild(el('p', { class: 'lead' }, 'Comment former le féminin, le duel et le pluriel en arabe.'));
  const grouped = {};
  DATA.phase2.gender_number.forEach(item => {
    grouped[item.type_label] = grouped[item.type_label] || [];
    grouped[item.type_label].push(item);
  });
  Object.entries(grouped).forEach(([label, items]) => {
    root.appendChild(el('h2', null, label));
    const card = el('div', { class: 'card' });
    items.forEach(item => {
      card.appendChild(el('div', { class: 'list-row' },
        el('span', { class: 'ar-cell' }, `${item.base} → ${item.target}`),
        el('span', { class: 'translit-cell' }, `${item.base_translit} → ${item.target_translit}`),
        el('span', { class: 'fr-cell' }, `${item.base_fr} → ${item.target_fr}`),
        listenBtn(item.target)));
    });
    root.appendChild(card);
  });
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderGenderNumberQuiz(root); } }, 'Commencer le quiz'));
}

function renderGenderNumberQuiz(root) {
  const items = DATA.phase2.gender_number;
  const allTargets = items.map(i => i.target);
  const questions = mcqFromList(items, {
    getPrompt: () => null,
    getCorrectValue: (i) => i.target,
    distractorPool: allTargets,
  }).map((q, idx) => {
    const item = items[idx];
    return Object.assign(q, {
      prompt: el('div', null,
        el('div', { class: 'example-word' }, item.base),
        el('div', { class: 'lead', style: 'font-size:0.85rem;margin-top:6px;' }, `${item.type_label} — ${item.base_fr}`)),
    });
  });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Les règles de genre et de nombre sont maîtrisées !',
    failMessage: 'Revois les exemples puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ genderNumberQuizBest: Math.max(PROGRESS.genderNumberQuizBest, pct), genderNumberQuizDone: PROGRESS.genderNumberQuizDone || pass }),
  });
}

function wordRoleQuestions(sentences, roleKey, note) {
  const allWords = [...new Set(sentences.flatMap(s => s.sentence.split(' ')))];
  return sentences.map(s => {
    const correct = s[roleKey];
    const distractors = sample(allWords.filter(w => w !== correct), Math.min(3, allWords.length - 1));
    const options = shuffle([...new Set([correct, ...distractors])]);
    return { prompt: s.sentence, promptClass: 'small-prompt', note, options, correctIndex: options.indexOf(correct) };
  });
}

function renderNominalSection(root) {
  root.appendChild(el('p', { class: 'lead' },
    'La phrase nominale commence par un nom : مبتدأ (sujet, en vert) + خبر (attribut, en orange).'));
  const card = el('div', { class: 'card' });
  DATA.phase2.nominal_sentences.forEach(s => {
    const [w1, w2] = s.sentence.split(' ');
    card.appendChild(el('div', null,
      el('div', { class: 'sentence-example' },
        el('span', { class: w1 === s.mubtada ? 'role-a' : 'role-b' }, w1), ' ',
        el('span', { class: w2 === s.khabar ? 'role-b' : 'role-a' }, w2)),
      el('p', { class: 'lead' }, `${s.translit} — ${s.fr}`)));
  });
  root.appendChild(card);
  root.appendChild(el('p', { class: 'role-highlight-legend' },
    el('span', null, el('span', { class: 'role-swatch', style: 'background:var(--accent)' }), 'مبتدأ (sujet)'),
    el('span', null, el('span', { class: 'role-swatch', style: 'background:var(--accent-2)' }), 'خبر (attribut)')));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderNominalQuiz(root); } }, 'Commencer l’exercice'));
}

function renderNominalQuiz(root) {
  const mubtadaQs = wordRoleQuestions(DATA.phase2.nominal_sentences, 'mubtada', 'Quel mot est le مبتدأ (sujet) ?');
  const khabarQs = wordRoleQuestions(DATA.phase2.nominal_sentences, 'khabar', 'Quel mot est le خبر (attribut) ?');
  const questions = shuffle([...mubtadaQs, ...khabarQs]);
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Tu identifies bien le مبتدأ et le خبر !',
    failMessage: 'Revois les exemples puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ nominalQuizBest: Math.max(PROGRESS.nominalQuizBest, pct), nominalQuizDone: PROGRESS.nominalQuizDone || pass }),
  });
}

function renderVerbalSection(root) {
  root.appendChild(el('p', { class: 'lead' },
    'La phrase verbale commence par un verbe : فعل (vert) + فاعل (sujet, orange) + مفعول به (COD, rose).'));
  const card = el('div', { class: 'card' });
  DATA.phase2.verbal_sentences.forEach(s => {
    const words = s.sentence.split(' ');
    card.appendChild(el('div', null,
      el('div', { class: 'sentence-example' }, words.map((w, i) => {
        const cls = w === s.fiil ? 'role-a' : (w === s.fail ? 'role-b' : (w === s.maful ? 'role-c' : ''));
        return el('span', { class: cls }, w + (i < words.length - 1 ? ' ' : ''));
      })),
      el('p', { class: 'lead' }, `${s.translit} — ${s.fr}`)));
  });
  root.appendChild(card);
  root.appendChild(el('p', { class: 'role-highlight-legend' },
    el('span', null, el('span', { class: 'role-swatch', style: 'background:var(--accent)' }), 'فعل (verbe)'),
    el('span', null, el('span', { class: 'role-swatch', style: 'background:var(--accent-2)' }), 'فاعل (sujet)'),
    el('span', null, el('span', { class: 'role-swatch', style: 'background:#e08fd0' }), 'مفعول به (COD)')));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderVerbalQuiz(root); } }, 'Commencer l’exercice'));
}

function renderVerbalQuiz(root) {
  const fiilQs = wordRoleQuestions(DATA.phase2.verbal_sentences, 'fiil', 'Quel mot est le فعل (verbe) ?');
  const failQs = wordRoleQuestions(DATA.phase2.verbal_sentences, 'fail', 'Quel mot est le فاعل (sujet) ?');
  const mafulQs = wordRoleQuestions(DATA.phase2.verbal_sentences, 'maful', 'Quel mot est le مفعول به (COD) ?');
  const questions = shuffle([...fiilQs, ...failQs, ...mafulQs]);
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Tu identifies bien les rôles de la phrase verbale !',
    failMessage: 'Revois les exemples puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ verbalQuizBest: Math.max(PROGRESS.verbalQuizBest, pct), verbalQuizDone: PROGRESS.verbalQuizDone || pass }),
  });
}

function renderCasesSection(root) {
  root.appendChild(el('p', { class: 'lead' }, 'Les trois cas grammaticaux (الإعراب) marquent la fonction du mot dans la phrase.'));
  const card = el('div', { class: 'card' });
  DATA.phase2.cases.forEach(c => {
    card.appendChild(el('div', { class: 'list-row' },
      el('span', { class: 'ar-cell' }, c.example),
      el('span', { class: 'translit-cell' }, `${c.name_ar} — ${c.name_fr}`),
      el('span', { class: 'fr-cell' }, c.usage_fr),
      listenBtn(c.example)));
  });
  root.appendChild(card);
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderCasesQuiz(root); } }, 'Commencer le quiz'));
}

function renderCasesQuiz(root) {
  const caseNames = {};
  DATA.phase2.cases.forEach(c => { caseNames[c.case] = c.name_fr; });
  const items = sample(CASE_QUIZ_WORDS, 10);
  const options3 = DATA.phase2.cases.map(c => c.name_fr);
  const questions = items.map(item => ({
    prompt: item.word,
    options: options3,
    correctIndex: options3.indexOf(caseNames[item.case]),
  }));
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Les cas grammaticaux sont maîtrisés !',
    failMessage: 'Revois le tableau des cas puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ casesQuizBest: Math.max(PROGRESS.casesQuizBest, pct), casesQuizDone: PROGRESS.casesQuizDone || pass }),
  });
}

function renderPhase2QuizIntro(root) {
  root.appendChild(el('p', { class: 'lead' }, "Quiz combinant pronoms, genre/nombre, phrases nominale/verbale et cas grammaticaux. Score de 75% requis."));
  if (PROGRESS.phase2Complete) root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score : ${PROGRESS.phase2FinalBest}% — Phase 2 déjà validée !`));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; startPhase2FinalQuiz(root); } }, 'Démarrer le quiz final'));
}

function startPhase2FinalQuiz(root) {
  const pronounQs = mcqFromList(sample(DATA.phase2.pronouns, 4), {
    getPrompt: (p) => p.ar, getCorrectValue: (p) => p.fr, distractorPool: DATA.phase2.pronouns.map(p => p.fr),
  });
  const genderItems = sample(DATA.phase2.gender_number, 4);
  const genderQuestions = mcqFromList(genderItems, {
    getPrompt: () => null, getCorrectValue: (i) => i.target, distractorPool: DATA.phase2.gender_number.map(i => i.target),
  }).map((q, idx) => Object.assign(q, {
    prompt: el('div', null, el('div', { class: 'example-word' }, genderItems[idx].base), el('div', { class: 'lead', style: 'font-size:0.8rem;' }, genderItems[idx].type_label)),
  }));
  const nominalQs = sample(wordRoleQuestions(DATA.phase2.nominal_sentences, 'mubtada', 'Quel mot est le مبتدأ ?'), 2);
  const verbalQs = sample(wordRoleQuestions(DATA.phase2.verbal_sentences, 'fail', 'Quel mot est le فاعل ?'), 2);
  const caseNames = {};
  DATA.phase2.cases.forEach(c => { caseNames[c.case] = c.name_fr; });
  const options3 = DATA.phase2.cases.map(c => c.name_fr);
  const caseQs = sample(CASE_QUIZ_WORDS, 5).map(item => ({
    prompt: item.word, options: options3, correctIndex: options3.indexOf(caseNames[item.case]),
  }));
  const questions = shuffle([...pronounQs, ...genderQuestions, ...nominalQs, ...verbalQs, ...caseQs]);
  runQuiz(root, questions, {
    passThreshold: 75,
    passMessage: 'Félicitations, tu valides la Phase 2 ! Direction la Phase 3 : vocabulaire et lecture.',
    failMessage: 'Pas encore ! Revois les sections où tu hésites puis retente le quiz final.',
    onFinish: (pct, pass) => updateProgress({ phase2FinalBest: Math.max(PROGRESS.phase2FinalBest, pct), phase2Complete: PROGRESS.phase2Complete || pass }),
  });
}

/* =====================================================================
   PHASE 3 — Vocabulaire et lecture
   ===================================================================== */

let phase3Tab = 'vocabulaire';
let vocabCategoryId = null;
let selectedTextId = null;
let selectedRoot = null;

function renderPhase3(root) {
  if (!vocabCategoryId && DATA.phase3.vocab_categories.length) vocabCategoryId = DATA.phase3.vocab_categories[0].id;
  if (!selectedRoot && DATA.phase3.roots.length) selectedRoot = DATA.phase3.roots[0].root;
  renderPhaseShell(root, {
    title: 'Phase 3 — Vocabulaire et lecture',
    lead: '6 à 12 mois : vocabulaire thématique, lecture de textes courts, racines trilitères.',
    tabs: [
      { key: 'vocabulaire', label: 'Vocabulaire' },
      { key: 'lecture', label: 'Lecture de textes' },
      { key: 'racines', label: 'Racines' },
      { key: 'quiz', label: 'Quiz final', done: PROGRESS.phase3Complete },
    ],
    active: phase3Tab,
    onSelect: (k) => { phase3Tab = k; navigate('phase3'); },
    render: (content) => {
      if (phase3Tab === 'vocabulaire') renderVocabSection(content);
      else if (phase3Tab === 'lecture') renderReadingTextsSection(content);
      else if (phase3Tab === 'racines') renderRootsSection(content);
      else renderPhase3QuizIntro(content);
    },
  });
}

function renderVocabSection(root) {
  root.appendChild(el('p', { class: 'lead' }, "Vocabulaire de base organisé par thème — un socle vers les 500 mots les plus fréquents."));
  const chips = el('div', { class: 'chip-row' });
  DATA.phase3.vocab_categories.forEach(cat => {
    const done = PROGRESS.vocabCategoriesDone.includes(cat.id);
    chips.appendChild(el('button', { class: `chip ${cat.id === vocabCategoryId ? 'active' : ''}`, onclick: () => { vocabCategoryId = cat.id; navigate('phase3'); } },
      cat.title, done ? el('span', { class: 'done-mark' }, ' ✓') : null));
  });
  root.appendChild(chips);

  const category = DATA.phase3.vocab_categories.find(c => c.id === vocabCategoryId);
  if (!category) return;
  addUnique('vocabCategoriesDone', category.id);
  root.appendChild(el('h2', null, `${category.title} — ${category.title_ar}`));
  const card = el('div', { class: 'card' });
  category.words.forEach(w => {
    card.appendChild(el('div', { class: 'list-row' },
      el('span', { class: 'ar-cell' }, w.ar),
      el('span', { class: 'translit-cell' }, w.translit),
      el('span', { class: 'fr-cell' }, w.fr),
      listenBtn(w.ar)));
  });
  root.appendChild(card);
  const best = PROGRESS.vocabQuizBest[category.id];
  if (best !== undefined) root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score sur cette catégorie : ${best}%`));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderVocabQuiz(root, category); } }, `Quiz : ${category.title}`));
}

function renderVocabQuiz(root, category) {
  const allWordsAllCats = DATA.phase3.vocab_categories.flatMap(c => c.words);
  const items = sample(category.words, Math.min(8, category.words.length));
  const distractorPool = category.words.length >= 8 ? category.words.map(w => w.fr) : allWordsAllCats.map(w => w.fr);
  const questions = mcqFromList(items, { getPrompt: (w) => w.ar, getCorrectValue: (w) => w.fr, distractorPool });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: `Vocabulaire "${category.title}" maîtrisé !`,
    failMessage: 'Revois la liste puis réessaie.',
    onFinish: (pct, pass) => {
      const best = Object.assign({}, PROGRESS.vocabQuizBest, { [category.id]: Math.max(PROGRESS.vocabQuizBest[category.id] || 0, pct) });
      updateProgress({ vocabQuizBest: best });
      if (pass) addUnique('vocabCategoriesDone', category.id);
    },
  });
}

function renderReadingTextsSection(root) {
  root.appendChild(el('p', { class: 'lead' }, "6 textes courts et vocalisés, du plus simple au plus riche."));
  if (selectedTextId === null) {
    const grid = el('div', null);
    DATA.phase3.reading_texts.forEach(t => {
      const done = PROGRESS.readingTextsDone.includes(t.id);
      grid.appendChild(el('div', { class: 'card text-card', onclick: () => { selectedTextId = t.id; navigate('phase3'); } },
        el('strong', null, t.title, done ? el('span', { class: 'check-mark' }, ' ✓') : null),
        el('p', { class: 'lead' }, t.text.slice(0, 30) + '…')));
    });
    root.appendChild(grid);
    return;
  }
  const text = DATA.phase3.reading_texts.find(t => t.id === selectedTextId);
  root.appendChild(el('button', { class: 'btn secondary', onclick: () => { selectedTextId = null; navigate('phase3'); } }, '← Retour à la liste'));
  const card = el('div', { class: 'card' });
  card.appendChild(el('h2', { style: 'margin-top:0' }, text.title));
  card.appendChild(el('div', { class: 'text-body' }, text.text));
  card.appendChild(el('button', { class: 'btn secondary', onclick: () => speak(text.text) }, '🔊 Écouter'));
  const reveal = el('div');
  card.appendChild(el('button', { class: 'btn secondary', style: 'margin-left:8px;', onclick: () => { reveal.innerHTML = ''; reveal.appendChild(el('p', { class: 'lead' }, text.translation)); } }, 'Afficher la traduction'));
  card.appendChild(reveal);
  root.appendChild(card);
  root.appendChild(el('button', { class: 'btn', onclick: () => { const c = el('div'); root.appendChild(c); startTextQuestions(c, text); } }, 'Questions de compréhension'));
}

function startTextQuestions(root, text) {
  const questions = text.questions.map(q => ({ prompt: q.q, promptClass: 'french-prompt', options: q.options, correctIndex: q.correct }));
  runQuiz(root, questions, {
    passThreshold: 50,
    passMessage: 'Bonne compréhension du texte !',
    failMessage: 'Relis le texte et sa traduction puis réessaie.',
    onFinish: (pct, pass) => { if (pass) addUnique('readingTextsDone', text.id); },
  });
}

function renderRootsSection(root) {
  root.appendChild(el('p', { class: 'lead' },
    "Une racine trilitère porte un sens général ; ses lettres se combinent selon des schèmes pour former verbes et noms."));
  const chips = el('div', { class: 'chip-row' });
  DATA.phase3.roots.forEach(r => {
    chips.appendChild(el('button', { class: `chip ${r.root === selectedRoot ? 'active' : ''}`, onclick: () => { selectedRoot = r.root; navigate('phase3'); } }, `${r.root} (${r.meaning_fr})`));
  });
  root.appendChild(chips);
  const root_ = DATA.phase3.roots.find(r => r.root === selectedRoot);
  if (!root_) return;
  const card = el('div', { class: 'card' });
  root_.words.forEach(w => {
    card.appendChild(el('div', { class: 'list-row' },
      el('span', { class: 'ar-cell' }, w.ar),
      el('span', { class: 'translit-cell' }, `${w.translit} (${w.type})`),
      el('span', { class: 'fr-cell' }, w.fr),
      listenBtn(w.ar)));
  });
  root.appendChild(card);
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderRootsQuiz(root); } }, 'Commencer le quiz des racines'));
}

function renderRootsQuiz(root) {
  const allWords = DATA.phase3.roots.flatMap(r => r.words.map(w => ({ ...w, root: r.root })));
  const items = sample(allWords, Math.min(8, allWords.length));
  const allRoots = DATA.phase3.roots.map(r => r.root);
  const questions = mcqFromList(items, { getPrompt: (w) => w.ar, getCorrectValue: (w) => w.root, distractorPool: allRoots });
  runQuiz(root, questions, {
    passThreshold: 70,
    passMessage: 'Tu reconnais bien les racines trilitères !',
    failMessage: 'Revois les familles de mots puis réessaie.',
    onFinish: (pct, pass) => updateProgress({ rootsQuizBest: Math.max(PROGRESS.rootsQuizBest, pct), rootsQuizDone: PROGRESS.rootsQuizDone || pass }),
  });
}

function renderPhase3QuizIntro(root) {
  root.appendChild(el('p', { class: 'lead' }, "Quiz combinant vocabulaire, compréhension de lecture et racines. Score de 75% requis."));
  if (PROGRESS.phase3Complete) root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score : ${PROGRESS.phase3FinalBest}% — Phase 3 déjà validée !`));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; startPhase3FinalQuiz(root); } }, 'Démarrer le quiz final'));
}

function startPhase3FinalQuiz(root) {
  const allWords = DATA.phase3.vocab_categories.flatMap(c => c.words);
  const vocabQs = mcqFromList(sample(allWords, 6), { getPrompt: (w) => w.ar, getCorrectValue: (w) => w.fr, distractorPool: allWords.map(w => w.fr) });
  const readingQs = sample(DATA.phase3.reading_texts, 3).map(t => {
    const q = sample(t.questions, 1)[0];
    return { prompt: q.q, promptClass: 'french-prompt', options: q.options, correctIndex: q.correct };
  });
  const allRootWords = DATA.phase3.roots.flatMap(r => r.words.map(w => ({ ...w, root: r.root })));
  const allRoots = DATA.phase3.roots.map(r => r.root);
  const rootQs = mcqFromList(sample(allRootWords, 4), { getPrompt: (w) => w.ar, getCorrectValue: (w) => w.root, distractorPool: allRoots });
  const questions = shuffle([...vocabQs, ...readingQs, ...rootQs]);
  runQuiz(root, questions, {
    passThreshold: 75,
    passMessage: 'Félicitations, tu valides la Phase 3 ! Direction la Phase 4 : le niveau avancé.',
    failMessage: 'Pas encore ! Continue à pratiquer puis retente le quiz final.',
    onFinish: (pct, pass) => updateProgress({ phase3FinalBest: Math.max(PROGRESS.phase3FinalBest, pct), phase3Complete: PROGRESS.phase3Complete || pass }),
  });
}

/* =====================================================================
   PHASE 4 — Niveau avancé
   ===================================================================== */

let phase4Tab = 'textes';

function renderPhase4(root) {
  renderPhaseShell(root, {
    title: 'Phase 4 — Niveau avancé',
    lead: 'Textes littéraires classiques, grammaire approfondie, lecture du Coran avec compréhension.',
    tabs: [
      { key: 'textes', label: 'Textes classiques' },
      { key: 'grammaire', label: 'Grammaire approfondie' },
      { key: 'coran', label: 'Coran' },
      { key: 'quiz', label: 'Quiz final', done: PROGRESS.phase4Complete },
    ],
    active: phase4Tab,
    onSelect: (k) => { phase4Tab = k; navigate('phase4'); },
    render: (content) => {
      if (phase4Tab === 'textes') renderTextesClassiquesSection(content);
      else if (phase4Tab === 'grammaire') renderGrammaireApprofondieSection(content);
      else if (phase4Tab === 'coran') renderCoranSection(content);
      else renderPhase4QuizIntro(content);
    },
  });
}

function renderTextesClassiquesSection(root) {
  updateProgress({ proverbsSeen: true, poetrySeen: true });
  root.appendChild(el('h2', { style: 'margin-top:0' }, 'Proverbes (أمثال)'));
  DATA.phase4.proverbs.forEach(p => {
    root.appendChild(el('div', { class: 'card' },
      el('div', { class: 'text-body', style: 'font-size:1.5rem;margin:0 0 8px;' }, p.ar),
      el('p', { class: 'lead' }, `${p.translit}`),
      el('p', null, el('strong', null, 'Sens : '), p.meaning_fr),
      listenBtn(p.ar)));
  });
  root.appendChild(el('h2', null, 'Poésie classique'));
  DATA.phase4.poetry.forEach(v => {
    root.appendChild(el('div', { class: 'card' },
      el('div', { class: 'text-body', style: 'font-size:1.4rem;margin:0 0 8px;' }, v.verse),
      el('p', { class: 'lead' }, v.translit),
      el('p', null, v.fr),
      el('p', { class: 'phase-resource' }, v.author),
      el('p', { class: 'locked-note' }, v.note),
      listenBtn(v.verse)));
  });
}

function renderGrammaireApprofondieSection(root) {
  updateProgress({ morphologySeen: true, rhetoricSeen: true });
  root.appendChild(el('h2', { style: 'margin-top:0' }, 'الصرف — Les 10 formes verbales'));
  root.appendChild(el('p', { class: 'lead' }, "Chaque schème (وزن) ajoute une nuance de sens à la racine de base."));
  const table = el('div', { class: 'card' });
  DATA.phase4.morphology_forms.forEach(f => {
    table.appendChild(el('div', { class: 'list-row' },
      el('span', { class: 'ar-cell', style: 'min-width:70px;' }, `${f.form}. ${f.pattern}`),
      el('span', { class: 'translit-cell' }, f.nuance_fr),
      el('span', { class: 'fr-cell' }, `${f.example_ar} — ${f.example_translit} : ${f.example_fr}`),
      listenBtn(f.example_ar)));
  });
  root.appendChild(table);

  root.appendChild(el('h2', null, 'البلاغة — Introduction à la rhétorique'));
  DATA.phase4.rhetoric_figures.forEach(fig => {
    root.appendChild(el('div', { class: 'card' },
      el('strong', null, `${fig.name_ar} — ${fig.name_fr}`),
      el('div', { class: 'text-body', style: 'font-size:1.4rem;margin:10px 0;' }, fig.example_ar),
      el('p', { class: 'lead' }, `${fig.example_translit} — ${fig.example_fr}`),
      el('p', null, fig.explanation_fr),
      listenBtn(fig.example_ar)));
  });
}

function renderCoranSection(root) {
  addUnique('quranSeen', 'fatiha');
  addUnique('quranSeen', 'ikhlas');
  root.appendChild(el('p', { class: 'locked-note' },
    "Lecture proposée dans un but strictement linguistique (vocabulaire, structure). Pour une étude religieuse, réfère-toi à un enseignant qualifié et à une traduction certifiée."));
  DATA.phase4.quran_texts.forEach(surah => {
    root.appendChild(el('h2', null, `${surah.title_fr} — ${surah.title}`));
    const card = el('div', { class: 'card' });
    surah.ayat.forEach(a => {
      card.appendChild(el('div', { class: 'list-row' },
        el('span', { class: 'ar-cell', style: 'min-width:30px;' }, String(a.n)),
        el('span', { class: 'ar-cell' }, a.ar),
        el('span', { class: 'fr-cell' }, a.gloss_fr),
        listenBtn(a.ar)));
    });
    root.appendChild(card);
  });
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; renderQuranQuiz(root); } }, 'Petit quiz de compréhension'));
}

function renderQuranQuiz(root) {
  const questions = QURAN_QUIZ.map(q => ({ prompt: q.q, promptClass: 'french-prompt', options: q.options, correctIndex: q.correct }));
  runQuiz(root, questions, {
    passThreshold: 50,
    passMessage: 'Bonne compréhension des deux sourates !',
    failMessage: 'Relis les gloses puis réessaie.',
    onFinish: () => {},
  });
}

function renderPhase4QuizIntro(root) {
  root.appendChild(el('p', { class: 'lead' }, "Quiz combinant proverbes, formes verbales, rhétorique et compréhension du Coran. Score de 75% requis."));
  if (PROGRESS.phase4Complete) root.appendChild(el('p', { class: 'phase-resource' }, `Meilleur score : ${PROGRESS.phase4FinalBest}% — Phase 4 déjà validée !`));
  root.appendChild(el('button', { class: 'btn', onclick: () => { root.innerHTML = ''; startPhase4FinalQuiz(root); } }, 'Démarrer le quiz final'));
}

function startPhase4FinalQuiz(root) {
  const proverbQs = mcqFromList(sample(DATA.phase4.proverbs, 3), {
    getPrompt: (p) => p.ar, getCorrectValue: (p) => p.meaning_fr, distractorPool: DATA.phase4.proverbs.map(p => p.meaning_fr),
  });
  const morphItems = sample(DATA.phase4.morphology_forms, 3);
  const allForms = DATA.phase4.morphology_forms.map(f => `Forme ${f.form}`);
  const morphQs = morphItems.map(f => {
    const distractors = sample(allForms.filter(x => x !== `Forme ${f.form}`), 3);
    const options = shuffle([`Forme ${f.form}`, ...distractors]);
    return {
      prompt: el('div', null, el('div', { class: 'example-word' }, f.example_ar), el('div', { class: 'lead', style: 'font-size:0.85rem;' }, f.example_fr)),
      options, correctIndex: options.indexOf(`Forme ${f.form}`),
    };
  });
  const rhetoricQs = mcqFromList(sample(DATA.phase4.rhetoric_figures, 3), {
    getPrompt: (f) => f.example_ar, getCorrectValue: (f) => f.name_fr, distractorPool: DATA.phase4.rhetoric_figures.map(f => f.name_fr),
  });
  const quranQs = sample(QURAN_QUIZ, 3).map(q => ({ prompt: q.q, promptClass: 'french-prompt', options: q.options, correctIndex: q.correct }));
  const questions = shuffle([...proverbQs, ...morphQs, ...rhetoricQs, ...quranQs]);
  runQuiz(root, questions, {
    passThreshold: 75,
    passMessage: 'Félicitations, tu valides la Phase 4 ! Tu as parcouru l’ensemble du programme.',
    failMessage: 'Continue à pratiquer les sections avancées puis retente le quiz final.',
    onFinish: (pct, pass) => updateProgress({ phase4FinalBest: Math.max(PROGRESS.phase4FinalBest, pct), phase4Complete: PROGRESS.phase4Complete || pass }),
  });
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('letter-modal-close').addEventListener('click', closeLetterModal);
  document.getElementById('letter-modal').addEventListener('click', (e) => { if (e.target.id === 'letter-modal') closeLetterModal(); });
  document.getElementById('main-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn) navigate(btn.dataset.route);
  });
  await loadData();
  navigate('accueil');
});
