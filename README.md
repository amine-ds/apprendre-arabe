# Apprendre l'arabe classique

Application d'apprentissage de l'arabe classique, basée sur le programme marocain en 4 phases. Les 4 phases sont jouables de bout en bout.

## Programme

1. **L'alphabet et les bases** (4-6 semaines) — 28 lettres, harakat, voyelles longues, tanwin, lecture syllabique.
2. **Grammaire fondamentale** (3-6 mois) — pronoms personnels, genre/nombre, phrase nominale/verbale, cas grammaticaux (مرفوع/منصوب/مجرور).
3. **Vocabulaire et lecture** (6-12 mois) — socle de ~180 mots répartis en 13 thèmes (salutations, animaux, école, vêtements, famille, nombres, couleurs, corps, nourriture, maison, temps, verbes, adjectifs — vers l'objectif des 500 mots les plus fréquents), 6 textes courts avec questions de compréhension, introduction aux racines trilitères.
4. **Niveau avancé** — proverbes et un extrait de poésie classique, les 10 formes verbales (الصرف) et une introduction à la rhétorique (البلاغة), lecture d'Al-Fâtiha et Al-Ikhlâs avec glose linguistique mot-à-mot.

Chaque phase propose des leçons interactives, des quiz notés et un quiz final de validation ; la progression (lettres vues, meilleurs scores, phases validées) est sauvegardée en local dans le navigateur.

> **Note sur le contenu religieux/classique** : les textes coraniques et le vers de poésie classique sont présentés dans un but strictement linguistique (vocabulaire, structure, lecture). Pour une étude religieuse ou une analyse littéraire faisant autorité, réfère-toi à un enseignant qualifié et à des sources certifiées.

## Pensé pour les enfants — ludique et gamifié

Inspiré des mécaniques des grandes applications d'apprentissage de langues (Duolingo, Lingodeer, Madinah Arabic) :

- **Design coloré et animé** : thème clair, police ludique, mascotte (Sami le chameau 🐫) qui réagit et encourage, confettis et sons de succès.
- **XP, niveaux et série (streak)** : chaque bonne réponse rapporte de l'XP, l'enfant monte de niveau (Débutant → Maître de l'arabe) et entretient une série de jours consécutifs.
- **Badges à collectionner** : 14 badges (alphabet complet, quiz parfait, séries de 3/7 jours, phases terminées, etc.), consultables dans l'onglet **Badges**.
- **Défi du jour** : un mini-quiz surprise quotidien qui mélange tout ce qui a été appris.
- **Traçage des lettres** : mini-jeu au doigt/à la souris (canvas) pour s'entraîner à écrire chacune des 28 lettres.
- **Jeu de mémoire** : retrouver les paires mot arabe / traduction française, par catégorie de vocabulaire.

## Stack

- Backend : FastAPI (sert les données pédagogiques en JSON + les fichiers statiques du frontend)
- Frontend : HTML / CSS / JavaScript vanilla, sans framework
- Progression, XP, niveaux, badges et streak sauvegardés en local (localStorage du navigateur), pas de compte utilisateur nécessaire

## Lancer en local

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Ouvre ensuite `http://localhost:8000`.

## Déploiement

Le fichier `render.yaml` permet un déploiement direct sur [Render](https://render.com).

## Structure

```text
apprendre-arabe/
├─ backend/
│  ├─ app/
│  │  ├─ main.py          # API FastAPI + service des fichiers statiques
│  │  └─ data/
│  │     ├─ phase1.py     # Alphabet, harakat, tanwin, lecture syllabique
│  │     ├─ phase2.py     # Pronoms, genre/nombre, phrases nominale/verbale, cas
│  │     ├─ phase3.py     # Vocabulaire thématique, textes de lecture, racines
│  │     └─ phase4.py     # Proverbes, poésie, morphologie, rhétorique, Coran
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js               # Navigation par phase, quiz, exercices interactifs
└─ render.yaml
```
