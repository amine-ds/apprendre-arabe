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


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
