"""Contenu pédagogique de la Phase 2 : grammaire fondamentale (النحو)."""

PRONOUNS = [
    {"ar": "أَنَا", "translit": "ana", "fr": "je / moi", "person": "1e sing."},
    {"ar": "نَحْنُ", "translit": "naḥnu", "fr": "nous", "person": "1e plur."},
    {"ar": "أَنْتَ", "translit": "anta", "fr": "tu (masc.)", "person": "2e sing. m."},
    {"ar": "أَنْتِ", "translit": "anti", "fr": "tu (fém.)", "person": "2e sing. f."},
    {"ar": "أَنْتُمَا", "translit": "antumā", "fr": "vous deux", "person": "2e duel"},
    {"ar": "أَنْتُمْ", "translit": "antum", "fr": "vous (masc. plur.)", "person": "2e plur. m."},
    {"ar": "أَنْتُنَّ", "translit": "antunna", "fr": "vous (fém. plur.)", "person": "2e plur. f."},
    {"ar": "هُوَ", "translit": "huwa", "fr": "il", "person": "3e sing. m."},
    {"ar": "هِيَ", "translit": "hiya", "fr": "elle", "person": "3e sing. f."},
    {"ar": "هُمَا", "translit": "humā", "fr": "eux/elles deux", "person": "3e duel"},
    {"ar": "هُمْ", "translit": "hum", "fr": "ils", "person": "3e plur. m."},
    {"ar": "هُنَّ", "translit": "hunna", "fr": "elles", "person": "3e plur. f."},
]

GENDER_NUMBER = [
    {"type": "feminin", "type_label": "Masculin → féminin (+ ة)",
     "base": "مُعَلِّمٌ", "base_translit": "muʿallimun", "base_fr": "un enseignant",
     "target": "مُعَلِّمَةٌ", "target_translit": "muʿallimatun", "target_fr": "une enseignante"},
    {"type": "feminin", "type_label": "Masculin → féminin (+ ة)",
     "base": "طَالِبٌ", "base_translit": "ṭālibun", "base_fr": "un étudiant",
     "target": "طَالِبَةٌ", "target_translit": "ṭālibatun", "target_fr": "une étudiante"},
    {"type": "duel", "type_label": "Singulier → duel (+ ان)",
     "base": "كِتَابٌ", "base_translit": "kitābun", "base_fr": "un livre",
     "target": "كِتَابَانِ", "target_translit": "kitābāni", "target_fr": "deux livres"},
    {"type": "duel", "type_label": "Singulier → duel (+ ان)",
     "base": "بِنْتٌ", "base_translit": "bintun", "base_fr": "une fille",
     "target": "بِنْتَانِ", "target_translit": "bintāni", "target_fr": "deux filles"},
    {"type": "pluriel_sain_m", "type_label": "Pluriel masculin régulier (+ ون)",
     "base": "مُعَلِّمٌ", "base_translit": "muʿallimun", "base_fr": "un enseignant",
     "target": "مُعَلِّمُونَ", "target_translit": "muʿallimūna", "target_fr": "des enseignants"},
    {"type": "pluriel_sain_f", "type_label": "Pluriel féminin régulier (+ ات)",
     "base": "مُعَلِّمَةٌ", "base_translit": "muʿallimatun", "base_fr": "une enseignante",
     "target": "مُعَلِّمَاتٌ", "target_translit": "muʿallimātun", "target_fr": "des enseignantes"},
    {"type": "pluriel_brise", "type_label": "Pluriel irrégulier (جمع تكسير)",
     "base": "كِتَابٌ", "base_translit": "kitābun", "base_fr": "un livre",
     "target": "كُتُبٌ", "target_translit": "kutubun", "target_fr": "des livres"},
    {"type": "pluriel_brise", "type_label": "Pluriel irrégulier (جمع تكسير)",
     "base": "وَلَدٌ", "base_translit": "waladun", "base_fr": "un garçon",
     "target": "أَوْلَادٌ", "target_translit": "awlādun", "target_fr": "des garçons"},
]

NOMINAL_SENTENCES = [
    {"sentence": "الْبَيْتُ كَبِيرٌ", "translit": "al-baytu kabīrun", "fr": "La maison est grande.",
     "mubtada": "الْبَيْتُ", "khabar": "كَبِيرٌ"},
    {"sentence": "الْوَلَدُ نَشِيطٌ", "translit": "al-waladu nashīṭun", "fr": "Le garçon est actif.",
     "mubtada": "الْوَلَدُ", "khabar": "نَشِيطٌ"},
    {"sentence": "الْجَوُّ جَمِيلٌ", "translit": "al-jawwu jamīlun", "fr": "Le temps est beau.",
     "mubtada": "الْجَوُّ", "khabar": "جَمِيلٌ"},
    {"sentence": "الْمُعَلِّمَةُ لَطِيفَةٌ", "translit": "al-muʿallimatu laṭīfatun", "fr": "L'enseignante est gentille.",
     "mubtada": "الْمُعَلِّمَةُ", "khabar": "لَطِيفَةٌ"},
]

VERBAL_SENTENCES = [
    {"sentence": "كَتَبَ الْوَلَدُ الدَّرْسَ", "translit": "kataba al-waladu ad-darsa",
     "fr": "Le garçon a écrit la leçon.", "fiil": "كَتَبَ", "fail": "الْوَلَدُ", "maful": "الدَّرْسَ"},
    {"sentence": "أَكَلَ الطِّفْلُ التُّفَّاحَةَ", "translit": "akala aṭ-ṭiflu at-tuffāḥata",
     "fr": "L'enfant a mangé la pomme.", "fiil": "أَكَلَ", "fail": "الطِّفْلُ", "maful": "التُّفَّاحَةَ"},
    {"sentence": "فَتَحَ الرَّجُلُ الْبَابَ", "translit": "fataḥa ar-rajulu al-bāba",
     "fr": "L'homme a ouvert la porte.", "fiil": "فَتَحَ", "fail": "الرَّجُلُ", "maful": "الْبَابَ"},
    {"sentence": "قَرَأَتِ الْبِنْتُ الْكِتَابَ", "translit": "qara’ati al-bintu al-kitāba",
     "fr": "La fille a lu le livre.", "fiil": "قَرَأَتِ", "fail": "الْبِنْتُ", "maful": "الْكِتَابَ"},
]

CASES = [
    {"case": "marfu", "name_ar": "مَرْفُوع", "name_fr": "marfūʿ (nominatif)", "mark": "ـُ / ضمة",
     "usage_fr": "sujet (مبتدأ), prédicat (خبر), sujet du verbe (فاعل)",
     "example": "الْكِتَابُ", "example_translit": "al-kitābu"},
    {"case": "mansub", "name_ar": "مَنْصُوب", "name_fr": "manṣūb (accusatif)", "mark": "ـَ / فتحة",
     "usage_fr": "complément d'objet direct (مفعول به)",
     "example": "الْكِتَابَ", "example_translit": "al-kitāba"},
    {"case": "majrur", "name_ar": "مَجْرُور", "name_fr": "majrūr (génitif)", "mark": "ـِ / كسرة",
     "usage_fr": "après une préposition (حرف جر) ou en annexion (إضافة)",
     "example": "الْكِتَابِ", "example_translit": "al-kitābi"},
]

AFFIX_PRONOUNS = [
    {"suffix": "ي", "translit_suffix": "-ī", "meaning": "mon / ma",
     "example": "كِتَابِي", "example_translit": "kitābī", "example_fr": "mon livre"},
    {"suffix": "كَ", "translit_suffix": "-ka", "meaning": "ton / ta (à un garçon)",
     "example": "كِتَابُكَ", "example_translit": "kitābuka", "example_fr": "ton livre"},
    {"suffix": "كِ", "translit_suffix": "-ki", "meaning": "ton / ta (à une fille)",
     "example": "كِتَابُكِ", "example_translit": "kitābuki", "example_fr": "ton livre"},
    {"suffix": "هُ", "translit_suffix": "-hu", "meaning": "son / sa (à lui)",
     "example": "كِتَابُهُ", "example_translit": "kitābuhu", "example_fr": "son livre"},
    {"suffix": "هَا", "translit_suffix": "-hā", "meaning": "son / sa (à elle)",
     "example": "كِتَابُهَا", "example_translit": "kitābuhā", "example_fr": "son livre"},
    {"suffix": "نَا", "translit_suffix": "-nā", "meaning": "notre",
     "example": "كِتَابُنَا", "example_translit": "kitābunā", "example_fr": "notre livre"},
    {"suffix": "كُمْ", "translit_suffix": "-kum", "meaning": "votre",
     "example": "كِتَابُكُمْ", "example_translit": "kitābukum", "example_fr": "votre livre"},
    {"suffix": "هُمْ", "translit_suffix": "-hum", "meaning": "leur",
     "example": "كِتَابُهُمْ", "example_translit": "kitābuhum", "example_fr": "leur livre"},
]

DEMONSTRATIVES = [
    {"ar": "هَذَا", "translit": "hādhā", "fr": "celui-ci / ce (masculin)",
     "example": "هَذَا كِتَابٌ", "example_translit": "hādhā kitābun", "example_fr": "ceci est un livre"},
    {"ar": "هَذِهِ", "translit": "hādhihi", "fr": "celle-ci / cette (féminin)",
     "example": "هَذِهِ سَيَّارَةٌ", "example_translit": "hādhihi sayyāratun", "example_fr": "ceci est une voiture"},
    {"ar": "ذَلِكَ", "translit": "dhālika", "fr": "celui-là (masculin, éloigné)",
     "example": "ذَلِكَ بَيْتٌ", "example_translit": "dhālika baytun", "example_fr": "cela est une maison (là-bas)"},
    {"ar": "تِلْكَ", "translit": "tilka", "fr": "celle-là (féminin, éloigné)",
     "example": "تِلْكَ مَدْرَسَةٌ", "example_translit": "tilka madrasatun", "example_fr": "cela est une école (là-bas)"},
    {"ar": "هَؤُلَاءِ", "translit": "hā'ulā'i", "fr": "ceux-ci / celles-ci (pluriel, proche)",
     "example": "هَؤُلَاءِ أَطْفَالٌ", "example_translit": "hā'ulā'i aṭfālun", "example_fr": "ce sont des enfants"},
]

IDAFA_EXAMPLES = [
    {"phrase": "بَيْتُ الرَّجُلِ", "translit": "baytu ar-rajuli", "fr": "la maison de l'homme",
     "mudaf": "بَيْتُ", "mudaf_ilayhi": "الرَّجُلِ"},
    {"phrase": "كِتَابُ الطَّالِبِ", "translit": "kitābu aṭ-ṭālibi", "fr": "le livre de l'étudiant",
     "mudaf": "كِتَابُ", "mudaf_ilayhi": "الطَّالِبِ"},
    {"phrase": "مَدْرَسَةُ الْبِنْتِ", "translit": "madrasatu al-binti", "fr": "l'école de la fille",
     "mudaf": "مَدْرَسَةُ", "mudaf_ilayhi": "الْبِنْتِ"},
    {"phrase": "بَابُ الْبَيْتِ", "translit": "bābu al-bayti", "fr": "la porte de la maison",
     "mudaf": "بَابُ", "mudaf_ilayhi": "الْبَيْتِ"},
]

VERB_CONJUGATION = {
    "root": "ك ت ب", "meaning_fr": "écrire",
    "past": [
        {"pronoun": "أَنَا", "pronoun_fr": "je", "form": "كَتَبْتُ", "translit": "katabtu"},
        {"pronoun": "أَنْتَ", "pronoun_fr": "tu (garçon)", "form": "كَتَبْتَ", "translit": "katabta"},
        {"pronoun": "أَنْتِ", "pronoun_fr": "tu (fille)", "form": "كَتَبْتِ", "translit": "katabti"},
        {"pronoun": "هُوَ", "pronoun_fr": "il", "form": "كَتَبَ", "translit": "kataba"},
        {"pronoun": "هِيَ", "pronoun_fr": "elle", "form": "كَتَبَتْ", "translit": "katabat"},
        {"pronoun": "نَحْنُ", "pronoun_fr": "nous", "form": "كَتَبْنَا", "translit": "katabnā"},
    ],
    "present": [
        {"pronoun": "أَنَا", "pronoun_fr": "je", "form": "أَكْتُبُ", "translit": "aktubu"},
        {"pronoun": "أَنْتَ", "pronoun_fr": "tu (garçon)", "form": "تَكْتُبُ", "translit": "taktubu"},
        {"pronoun": "أَنْتِ", "pronoun_fr": "tu (fille)", "form": "تَكْتُبِينَ", "translit": "taktubīna"},
        {"pronoun": "هُوَ", "pronoun_fr": "il", "form": "يَكْتُبُ", "translit": "yaktubu"},
        {"pronoun": "هِيَ", "pronoun_fr": "elle", "form": "تَكْتُبُ", "translit": "taktubu"},
        {"pronoun": "نَحْنُ", "pronoun_fr": "nous", "form": "نَكْتُبُ", "translit": "naktubu"},
    ],
}

PREPOSITIONS = [
    {"ar": "فِي", "translit": "fī", "fr": "dans / en"},
    {"ar": "عَلَى", "translit": "ʿalā", "fr": "sur"},
    {"ar": "مِنْ", "translit": "min", "fr": "de / depuis"},
    {"ar": "إِلَى", "translit": "ilā", "fr": "vers / à"},
    {"ar": "مَعَ", "translit": "maʿa", "fr": "avec"},
    {"ar": "تَحْتَ", "translit": "taḥta", "fr": "sous"},
    {"ar": "فَوْقَ", "translit": "fawqa", "fr": "au-dessus de"},
]

QUESTION_WORDS = [
    {"ar": "هَلْ", "translit": "hal", "fr": "est-ce que (réponse oui/non)"},
    {"ar": "مَنْ", "translit": "man", "fr": "qui"},
    {"ar": "مَاذَا", "translit": "mādhā", "fr": "quoi / qu'est-ce que"},
    {"ar": "أَيْنَ", "translit": "ayna", "fr": "où"},
    {"ar": "مَتَى", "translit": "matā", "fr": "quand"},
    {"ar": "كَيْفَ", "translit": "kayfa", "fr": "comment"},
    {"ar": "لِمَاذَا", "translit": "limādhā", "fr": "pourquoi"},
]

COORDINATION = [
    {"ar": "وَ", "translit": "wa", "fr": "et"},
    {"ar": "أَوْ", "translit": "aw", "fr": "ou"},
    {"ar": "ثُمَّ", "translit": "thumma", "fr": "puis"},
    {"ar": "لَكِنْ", "translit": "lākin", "fr": "mais"},
]

NEGATION = [
    {"ar": "لَا", "translit": "lā", "fr": "ne...pas (au présent)",
     "example": "لَا أَفْهَمُ", "example_translit": "lā afhamu", "example_fr": "je ne comprends pas"},
    {"ar": "لَيْسَ", "translit": "laysa", "fr": "n'est pas (phrase nominale)",
     "example": "الْبَيْتُ لَيْسَ كَبِيرًا", "example_translit": "al-baytu laysa kabīran", "example_fr": "la maison n'est pas grande"},
    {"ar": "لَمْ", "translit": "lam", "fr": "ne...pas (au passé)",
     "example": "لَمْ أَكْتُبْ", "example_translit": "lam aktub", "example_fr": "je n'ai pas écrit"},
]

CURRICULUM_PHASE2 = {
    "title": "Grammaire fondamentale (النحو)",
    "sections": [
        "Les pronoms personnels (isolés et affixes)",
        "Les démonstratifs",
        "Masculin / féminin, singulier / duel / pluriel",
        "L'annexion (الإضافة)",
        "La phrase nominale (المبتدأ والخبر)",
        "La phrase verbale (الفعل والفاعل والمفعول)",
        "Le verbe : passé et présent",
        "Les cas grammaticaux : marfūʿ, manṣūb, majrūr",
        "Les mots-outils : prépositions, interrogation, coordination, négation",
    ],
}
