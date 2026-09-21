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

CURRICULUM_PHASE2 = {
    "title": "Grammaire fondamentale (النحو)",
    "sections": [
        "Les pronoms personnels",
        "Masculin / féminin, singulier / duel / pluriel",
        "La phrase nominale (المبتدأ والخبر)",
        "La phrase verbale (الفعل والفاعل والمفعول)",
        "Les cas grammaticaux : marfūʿ, manṣūb, majrūr",
    ],
}
