# Apprendre l'arabe classique

Application d'apprentissage de l'arabe classique, basée sur le programme marocain en 4 phases.

## Programme

1. **L'alphabet et les bases** (4-6 semaines) — 28 lettres, harakat, voyelles longues, tanwin, lecture syllabique. *(Implémenté dans cette version.)*
2. **Grammaire fondamentale** (3-6 mois) — phrase nominale/verbale, cas grammaticaux, pronoms.
3. **Vocabulaire et lecture** (6-12 mois) — 500 mots fréquents, textes courts, racines trilitères.
4. **Niveau avancé** — textes classiques, grammaire approfondie, lecture du Coran.

La Phase 1 est entièrement jouable : exploration des lettres, quiz, harakat, tanwin et exercices de lecture syllabique. Les phases 2 à 4 sont présentées comme feuille de route dans l'onglet **Programme** et seront développées ensuite.

## Stack

- Backend : FastAPI (sert les données pédagogiques en JSON + les fichiers statiques du frontend)
- Frontend : HTML / CSS / JavaScript vanilla, sans framework
- Progression sauvegardée en local (localStorage du navigateur), pas de compte utilisateur nécessaire

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
│  │  └─ data/phase1.py   # Contenu pédagogique (lettres, harakat, tanwin, mots)
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js               # Navigation, quiz, exercices de lecture
└─ render.yaml
```
