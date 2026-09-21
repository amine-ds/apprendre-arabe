from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.data.phase1 import (
    CURRICULUM,
    HARAKAT,
    LETTERS,
    LONG_VOWELS,
    READING_WORDS,
    SIMPLE_LETTERS,
    TANWIN,
)
from app.data.phase2 import (
    CASES,
    GENDER_NUMBER,
    NOMINAL_SENTENCES,
    PRONOUNS,
    VERBAL_SENTENCES,
)
from app.data.phase3 import READING_TEXTS, ROOTS, VOCAB_CATEGORIES
from app.data.phase4 import MORPHOLOGY_FORMS, POETRY, PROVERBS, QURAN_TEXTS, RHETORIC_FIGURES

app = FastAPI(title="Apprendre l'arabe classique")

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"


@app.get("/api/curriculum")
def get_curriculum():
    return CURRICULUM


@app.get("/api/letters")
def get_letters():
    return LETTERS


@app.get("/api/harakat")
def get_harakat():
    return {"harakat": HARAKAT, "long_vowels": LONG_VOWELS}


@app.get("/api/tanwin")
def get_tanwin():
    return TANWIN


@app.get("/api/reading")
def get_reading():
    return {"simple_letters": SIMPLE_LETTERS, "words": READING_WORDS}


@app.get("/api/phase2")
def get_phase2():
    return {
        "pronouns": PRONOUNS,
        "gender_number": GENDER_NUMBER,
        "nominal_sentences": NOMINAL_SENTENCES,
        "verbal_sentences": VERBAL_SENTENCES,
        "cases": CASES,
    }


@app.get("/api/phase3")
def get_phase3():
    return {
        "vocab_categories": VOCAB_CATEGORIES,
        "reading_texts": READING_TEXTS,
        "roots": ROOTS,
    }


@app.get("/api/phase4")
def get_phase4():
    return {
        "proverbs": PROVERBS,
        "poetry": POETRY,
        "morphology_forms": MORPHOLOGY_FORMS,
        "rhetoric_figures": RHETORIC_FIGURES,
        "quran_texts": QURAN_TEXTS,
    }


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
