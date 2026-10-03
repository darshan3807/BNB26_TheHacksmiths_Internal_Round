
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import re

from src.diagnose import diagnose
from src.intervention import get_intervention


app = FastAPI(
    title="Re:Learn API",
    description="AI-assisted Python misconception diagnosis and reassessment",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


CONFIDENCE_THRESHOLD = 0.50


class DiagnosisRequest(BaseModel):
    student_answer: str = Field(min_length=1, max_length=1000)
    student_reasoning: str = Field(min_length=1, max_length=3000)


class ReassessmentRequest(BaseModel):
    misconception_label: str
    student_answer: str = Field(min_length=1, max_length=1000)
    student_reasoning: str = Field(min_length=1, max_length=3000)


# These are new practice questions, separate from the initial quiz.
PRACTICE_QUESTIONS = {
    "loop_range": {
        "question": "What values does list(range(2, 5)) produce?",
        "expected": ["2", "3", "4"],
        "keywords": [
            "exclude", "excluded", "stop", "not include",
            "before", "does not include",
        ],
        "hint": (
            "range(start, stop) includes the start value "
            "but stops before the stop value."
        ),
    },
    "variable_reassignment": {
        "question": (
            "If x = 10 and then x = x + 5, what does print(x) display?"
        ),
        "expected": ["15"],
        "keywords": [
            "update", "reassign", "new value", "10 + 5",
            "becomes 15", "15",
        ],
        "hint": (
            "The second assignment calculates a new value for x "
            "and stores that value in x."
        ),
    },
    "operator_precedence": {
        "question": "What does print(2 + 3 * 4) display?",
        "expected": ["14"],
        "keywords": [
            "multiplication", "multiply", "first",
            "precedence", "3 * 4", "12",
        ],
        "hint": (
            "Multiplication is performed before addition "
            "in this expression."
        ),
    },
    "loop_accumulation": {
        "question": (
            "What does this code print?\n"
            "total = 0\n"
            "for n in range(1, 4):\n"
            "    total += n\n"
            "print(total)"
        ),
        "expected": ["6"],
        "keywords": [
            "add", "sum", "total", "1 + 2 + 3",
            "accumulate", "accumulation",
        ],
        "hint": (
            "Trace the total after each iteration. "
            "The loop visits 1, 2, and 3."
        ),
    },
    "correct_understanding": {
        "question": "What does print(2 + 3 * 4) display?",
        "expected": ["14"],
        "keywords": [
            "multiplication", "multiply", "first",
            "precedence", "3 * 4", "12",
        ],
        "hint": (
            "Work out the multiplication before the addition."
        ),
    },
    "uncertain": {
        "question": "What values does list(range(2, 5)) produce?",
        "expected": ["2", "3", "4"],
        "keywords": [
            "exclude", "excluded", "stop", "not include",
            "before", "does not include",
        ],
        "hint": (
            "range(start, stop) includes the start value "
            "but excludes the stop value."
        ),
    },
}


def normalize_numbers(text):
    """Extract numbers so common list formats are accepted."""
    return re.findall(r"-?\d+(?:\.\d+)?", text.strip())


def explanation_is_relevant(reasoning, keywords):
    """Basic keyword check, not a full understanding assessment."""
    text = reasoning.casefold()
    return any(keyword in text for keyword in keywords)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "application": "Re:Learn",
    }


@app.post("/api/diagnose")
def create_diagnosis(request: DiagnosisRequest):
    try:
        result = diagnose(
            request.student_answer,
            request.student_reasoning,
        )

        label = result["predicted_misconception"]
        confidence = float(result["confidence"])

        lesson = get_intervention(label)
        practice = PRACTICE_QUESTIONS.get(
            label,
            PRACTICE_QUESTIONS["uncertain"],
        )

        return {
            "predicted_misconception": label,
            "confidence": confidence,
            "alternatives": result.get("alternatives", []),
            "confidence_status": (
                "tentative"
                if confidence < CONFIDENCE_THRESHOLD
                else "higher_relative_confidence"
            ),
            "notice": (
                "This is a preliminary prediction from a small "
                "synthetic dataset, not a confirmed diagnosis."
            ),
            "lesson": {
                "title": lesson["title"],
                "explanation": lesson["explanation"],
                "example": lesson["example"],
            },
            "practice_question": practice["question"],
            "practice_hint": practice["hint"],
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=500,
            detail="Trained model not found. Run src/train_model.py first.",
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error
    except (KeyError, TypeError) as error:
        raise HTTPException(
            status_code=500,
            detail="The diagnosis or intervention data is incomplete.",
        ) from error


@app.post("/api/reassess")
def reassess_student(request: ReassessmentRequest):
    label = request.misconception_label
    practice = PRACTICE_QUESTIONS.get(label)

    if practice is None:
        raise HTTPException(
            status_code=400,
            detail="Unknown misconception label.",
        )

    actual = normalize_numbers(request.student_answer)
    expected = practice["expected"]

    if actual != expected:
        return {
            "result": "incorrect",
            "answer_correct": False,
            "explanation_relevant": False,
            "feedback": (
                "Your answer does not match the expected output. "
                + practice["hint"]
            ),
            "hint": practice["hint"],
        }

    relevant = explanation_is_relevant(
        request.student_reasoning,
        practice["keywords"],
    )

    if not relevant:
        return {
            "result": "explanation_needed",
            "answer_correct": True,
            "explanation_relevant": False,
            "feedback": (
                "Your answer is correct, but your explanation "
                "needs more detail. Explain how you worked it out."
            ),
            "hint": practice["hint"],
        }

    return {
        "result": "correct",
        "answer_correct": True,
        "explanation_relevant": True,
        "feedback": (
            "Your answer and explanation match the expected "
            "result and the key idea. This is a positive practice "
            "result, not proof of lasting mastery."
        ),
        "hint": practice["hint"],
    }