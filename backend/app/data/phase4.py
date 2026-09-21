"""Contenu pédagogique de la Phase 4 : niveau avancé.

Les textes classiques et coraniques sont présentés dans un but
strictement linguistique (lecture, vocabulaire, structure). Pour une
étude religieuse ou une traduction faisant autorité, se référer à
un enseignant qualifié et à une traduction certifiée.
"""

PROVERBS = [
    {"ar": "الصَّبْرُ مِفْتَاحُ الْفَرَجِ", "translit": "aṣ-ṣabru miftāḥu al-faraji",
     "fr": "La patience est la clé du soulagement.", "meaning_fr": "La patience permet de surmonter les difficultés."},
    {"ar": "مَنْ جَدَّ وَجَدَ", "translit": "man jadda wajada",
     "fr": "Qui cherche avec sérieux trouve.", "meaning_fr": "L'équivalent de « qui veut, peut »."},
    {"ar": "الْعِلْمُ نُورٌ", "translit": "al-ʿilmu nūrun",
     "fr": "Le savoir est une lumière.", "meaning_fr": "Le savoir éclaire et guide."},
    {"ar": "كُلُّ شَيْءٍ إِذَا زَادَ عَنْ حَدِّهِ اِنْقَلَبَ إِلَى ضِدِّهِ", "translit": "kullu shay’in idhā zāda ʿan ḥaddihi inqalaba ilā ḍiddihi",
     "fr": "Toute chose, si elle dépasse sa juste mesure, se retourne contre elle-même.",
     "meaning_fr": "L'équivalent de « l'excès en tout est un défaut »."},
    {"ar": "دَاوِمْ عَلَى الْعَمَلِ وَلَوْ قَلَّ", "translit": "dāwim ʿalā al-ʿamali wa-law qalla",
     "fr": "Persévère dans le travail même s'il est modeste.", "meaning_fr": "Mieux vaut peu mais régulier que beaucoup mais irrégulier."},
    {"ar": "الْجَارُ قَبْلَ الدَّارِ", "translit": "al-jāru qabla ad-dāri",
     "fr": "Le voisin avant la maison.", "meaning_fr": "Choisis bien ton entourage avant ton lieu de vie."},
]

POETRY = [
    {
        "verse": "عَلَى قَدْرِ أَهْلِ الْعَزْمِ تَأْتِي الْعَزَائِمُ — وَتَأْتِي عَلَى قَدْرِ الْكِرَامِ الْمَكَارِمُ",
        "translit": "ʿalā qadri ahli al-ʿazmi ta’tī al-ʿazā’imu — wa-ta’tī ʿalā qadri al-kirāmi al-makārimu",
        "fr": "Les résolutions sont à la mesure de ceux qui ont de la détermination — et les nobles actions sont à la mesure des personnes nobles.",
        "author": "Al-Mutanabbî (poète classique, 10e siècle)",
        "note": "Vers particulièrement célèbre de la littérature arabe classique ; à retrouver dans un recueil (ديوان) pour une étude approfondie du mètre et du contexte.",
    },
]

MORPHOLOGY_FORMS = [
    {"form": "I", "pattern": "فَعَلَ", "nuance_fr": "Forme de base", "example_ar": "كَتَبَ", "example_translit": "kataba", "example_fr": "il a écrit"},
    {"form": "II", "pattern": "فَعَّلَ", "nuance_fr": "Intensif / causatif", "example_ar": "دَرَّسَ", "example_translit": "darrasa", "example_fr": "il a enseigné"},
    {"form": "III", "pattern": "فَاعَلَ", "nuance_fr": "Réciprocité / effort vers autrui", "example_ar": "كَاتَبَ", "example_translit": "kātaba", "example_fr": "il a correspondu (par écrit) avec"},
    {"form": "IV", "pattern": "أَفْعَلَ", "nuance_fr": "Causatif", "example_ar": "أَعْلَمَ", "example_translit": "aʿlama", "example_fr": "il a informé"},
    {"form": "V", "pattern": "تَفَعَّلَ", "nuance_fr": "Réflexif de la forme II", "example_ar": "تَعَلَّمَ", "example_translit": "taʿallama", "example_fr": "il a appris"},
    {"form": "VI", "pattern": "تَفَاعَلَ", "nuance_fr": "Réciprocité mutuelle", "example_ar": "تَدَارَسَ", "example_translit": "tadārasa", "example_fr": "ils ont étudié ensemble"},
    {"form": "VII", "pattern": "اِنْفَعَلَ", "nuance_fr": "Passif / résultat subi", "example_ar": "اِنْكَسَرَ", "example_translit": "inkasara", "example_fr": "il s'est cassé"},
    {"form": "VIII", "pattern": "اِفْتَعَلَ", "nuance_fr": "Réflexif / effort sur soi", "example_ar": "اِجْتَمَعَ", "example_translit": "ijtamaʿa", "example_fr": "il s'est réuni"},
    {"form": "IX", "pattern": "اِفْعَلَّ", "nuance_fr": "Couleurs / défauts physiques", "example_ar": "اِحْمَرَّ", "example_translit": "iḥmarra", "example_fr": "il a rougi"},
    {"form": "X", "pattern": "اِسْتَفْعَلَ", "nuance_fr": "Demande / recherche de l'action", "example_ar": "اِسْتَعْلَمَ", "example_translit": "istaʿlama", "example_fr": "il s'est renseigné"},
]

RHETORIC_FIGURES = [
    {"name_ar": "التَّشْبِيه", "name_fr": "la comparaison (tashbīh)",
     "example_ar": "هُوَ كَالْأَسَدِ فِي الشَّجَاعَةِ", "example_translit": "huwa ka-al-asadi fī ash-shajāʿati",
     "example_fr": "Il est comme un lion en courage.",
     "explanation_fr": "On compare deux éléments à l'aide d'un outil de comparaison (كَ = comme)."},
    {"name_ar": "الاسْتِعَارَة", "name_fr": "la métaphore (istiʿāra)",
     "example_ar": "رَأَيْتُ أَسَدًا يُلْقِي خِطَابًا", "example_translit": "ra’aytu asadan yulqī khiṭāban",
     "example_fr": "J'ai vu un « lion » faire un discours.",
     "explanation_fr": "On retire l'outil de comparaison et on utilise directement le mot au sens figuré (ici, « lion » désigne une personne courageuse)."},
    {"name_ar": "الْكِنَايَة", "name_fr": "l'allusion (kināya)",
     "example_ar": "فُلَانٌ كَثِيرُ الرَّمَادِ", "example_translit": "fulānun kathīru ar-ramādi",
     "example_fr": "Untel a « beaucoup de cendres ».",
     "explanation_fr": "Expression classique désignant, par allusion, une personne très généreuse et hospitalière (beaucoup de feu de cuisine = beaucoup d'invités)."},
    {"name_ar": "الطِّبَاق", "name_fr": "l'antithèse (ṭibāq)",
     "example_ar": "يَعْلَمُ السِّرَّ وَالْجَهْرَ", "example_translit": "yaʿlamu as-sirra wa-al-jahra",
     "example_fr": "Il connaît le secret et le déclaré.",
     "explanation_fr": "On rapproche deux mots de sens opposés dans la même phrase pour créer un effet de contraste."},
]

QURAN_TEXTS = [
    {
        "id": "fatiha", "title": "سُورَةُ الْفَاتِحَة", "title_fr": "Al-Fâtiha (l'Ouverture)",
        "ayat": [
            {"n": 1, "ar": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "translit": "bismi Allāhi ar-raḥmāni ar-raḥīmi",
             "gloss_fr": "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux."},
            {"n": 2, "ar": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "translit": "al-ḥamdu lillāhi rabbi al-ʿālamīna",
             "gloss_fr": "La louange est à Allah, Seigneur des mondes."},
            {"n": 3, "ar": "الرَّحْمَٰنِ الرَّحِيمِ", "translit": "ar-raḥmāni ar-raḥīmi",
             "gloss_fr": "Le Tout Miséricordieux, le Très Miséricordieux."},
            {"n": 4, "ar": "مَالِكِ يَوْمِ الدِّينِ", "translit": "māliki yawmi ad-dīni",
             "gloss_fr": "Maître du Jour de la rétribution."},
            {"n": 5, "ar": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "translit": "iyyāka naʿbudu wa-iyyāka nastaʿīnu",
             "gloss_fr": "C'est Toi que nous adorons, et c'est Toi dont nous implorons secours."},
            {"n": 6, "ar": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "translit": "ihdinā aṣ-ṣirāṭa al-mustaqīma",
             "gloss_fr": "Guide-nous dans le droit chemin."},
            {"n": 7, "ar": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
             "translit": "ṣirāṭa alladhīna anʿamta ʿalayhim ghayri al-maghḍūbi ʿalayhim walā aḍ-ḍāllīna",
             "gloss_fr": "Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés."},
        ],
    },
    {
        "id": "ikhlas", "title": "سُورَةُ الْإِخْلَاص", "title_fr": "Al-Ikhlâs (Le monothéisme pur)",
        "ayat": [
            {"n": 1, "ar": "قُلْ هُوَ اللَّهُ أَحَدٌ", "translit": "qul huwa Allāhu aḥadun",
             "gloss_fr": "Dis : « Il est Allah, Unique. »"},
            {"n": 2, "ar": "اللَّهُ الصَّمَدُ", "translit": "Allāhu aṣ-ṣamadu",
             "gloss_fr": "Allah, Le Seul à être imploré pour ce que nous désirons."},
            {"n": 3, "ar": "لَمْ يَلِدْ وَلَمْ يُولَدْ", "translit": "lam yalid wa-lam yūlad",
             "gloss_fr": "Il n'a jamais engendré, n'a pas été engendré."},
            {"n": 4, "ar": "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", "translit": "wa-lam yakun lahu kufuwan aḥadun",
             "gloss_fr": "Et nul n'est égal à Lui."},
        ],
    },
]

CURRICULUM_PHASE4 = {
    "title": "Niveau avancé",
    "sections": [
        "Textes littéraires classiques (proverbes, poésie)",
        "Grammaire approfondie (الصرف, البلاغة)",
        "Lecture du Coran avec compréhension linguistique",
    ],
}
