"""
Re:Learn AI - Backend Server
Supports both MySQL and SQLite automatically.
"""

import os
from typing import Optional, List
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import sqlalchemy
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

# ---------------------------------------------------------------------------
# 1. DATABASE CONFIGURATION
# ---------------------------------------------------------------------------
# If MYSQL_URL is set in environment, it uses MySQL.
# Otherwise, it automatically defaults to a local SQLite database (relearn.db).
MYSQL_URL = os.getenv("MYSQL_URL")
DATABASE_URL = MYSQL_URL if MYSQL_URL else "sqlite:///relearn.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------------------------------------------------------------
# 2. DATABASE MODELS
# ---------------------------------------------------------------------------
class UserModel(Base):
    __tablename__ = "users"
    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(32), default="student")
    avatar = Column(String(16), default="MC")
    enrolled_course = Column(String(255), default="Python Foundations")
    completed_units = Column(Integer, default=2)
    total_units = Column(Integer, default=6)
    created_at = Column(DateTime, default=datetime.utcnow)

class AttemptModel(Base):
    __tablename__ = "attempts"
    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), nullable=False)
    topic = Column(String(64), nullable=False)
    question_code = Column(Text, nullable=False)
    student_answer = Column(String(255), nullable=False)
    student_reasoning = Column(Text, nullable=False)
    scratchpad = Column(Text, nullable=True)
    predicted_misconception = Column(String(64), nullable=False)
    misconception_name = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Auto-seed demo users
with SessionLocal() as db:
    if not db.query(UserModel).filter_by(id="u_maya").first():
        db.add(UserModel(
            id="u_maya",
            name="Maya Chen",
            email="maya.chen@learn.edu",
            role="student",
            avatar="MC",
            completed_units=2,
            total_units=6
        ))
        db.add(UserModel(
            id="u_educator",
            name="Dr. Alex Mercer",
            email="alex.mercer@cs.edu",
            role="educator",
            avatar="AM",
            completed_units=6,
            total_units=6
        ))
        db.commit()

# ---------------------------------------------------------------------------
# 3. COGNITIVE MISCONCEPTION ML LOGIC
# ---------------------------------------------------------------------------
def run_ml_diagnosis(student_answer: str, student_reasoning: str):
    ans = student_answer.strip().lower()
    rsn = student_reasoning.strip().lower()

    # Rule & Token Classifier for loop range boundaries
    if ans == "10" or any(k in rsn for k in ["includes 4", "1, 2, 3 and 4", "1+2+3+4", "includes the stop"]):
        return {
            "predicted_misconception": "loop_range",
            "confidence": 0.94,
            "title": "Your addition works. Your boundary needs a rethink.",
            "subtitle": "Different misconceptions can produce 10. Your reasoning helps tell them apart.",
            "hypotheses": [
                {
                    "title": "Stop value treated as included",
                    "badge": "Strong evidence",
                    "badgeClass": "badge-purple",
                    "calc": "1 + 2 + 3 + 4 = 10",
                    "desc": "Your explanation explicitly includes 4. Your trace adds it after reaching 6."
                },
                {
                    "title": "Accumulator starts at the wrong value",
                    "badge": "Not supported",
                    "badgeClass": "badge-gray",
                    "calc": "4 + (1 + 2 + 3) = 10",
                    "desc": "This also gives 10, but your first running total is 1 not 5. Your work does not support this."
                },
                {
                    "title": "Arithmetic slip with the right sequence",
                    "badge": "Not supported",
                    "badgeClass": "badge-gray",
                    "calc": "1 + 2 + 3 → mistaken total 10",
                    "desc": "Your trace correctly reaches 6, then adds 4. That points to a boundary issue, not addition."
                }
            ],
            "keepWorking": "Your running totals show how accumulation works. We'll focus on range boundaries, not restart the whole lesson."
        }

    if ans in ["3", "4"] or any(k in rsn for k in ["last value", "replaces", "resets", "overwrites"]):
        return {
            "predicted_misconception": "loop_accumulation",
            "confidence": 0.88,
            "title": "Your range boundary is tracked. Accumulator state was missed.",
            "subtitle": "The loop updates total on each step rather than overwriting it.",
            "hypotheses": [
                {
                    "title": "Accumulator overwritten each iteration",
                    "badge": "Strong evidence",
                    "badgeClass": "badge-purple",
                    "calc": "total = n (stores last value)",
                    "desc": "Your reasoning indicates total was assigned the final iteration value rather than accumulated."
                }
            ],
            "keepWorking": "You accurately tracked loop steps. We'll focus on running sums with `total += n`."
        }

    if ans in ["6", "14"]:
        return {
            "predicted_misconception": "correct_understanding",
            "confidence": 0.98,
            "title": "Exact understanding demonstrated!",
            "subtitle": "You correctly stopped before the upper boundary and performed running accumulation.",
            "hypotheses": [
                {
                    "title": "Proper range boundary & running sum",
                    "badge": "Verified",
                    "badgeClass": "badge-green",
                    "calc": "Stop boundary excluded correctly",
                    "desc": "Your reasoning accurately identified the exclusive stop condition."
                }
            ],
            "keepWorking": "You have mastered the foundational boundary rule of Python's range()."
        }

    return {
        "predicted_misconception": "uncertain",
        "confidence": 0.76,
        "title": "Preliminary reasoning analysis",
        "subtitle": "We compared your prediction against our synthetic misconception taxonomy.",
        "hypotheses": [
            {
                "title": "Step execution divergence",
                "badge": "Hypothesis",
                "badgeClass": "badge-purple",
                "calc": f"Input: {ans}",
                "desc": "Reasoning indicates divergence in boundary tracking."
            }
        ],
        "keepWorking": "Tracing execution step by step will help clarify loop boundaries."
    }

# ---------------------------------------------------------------------------
# 4. FASTAPI APP & ENDPOINTS
# ---------------------------------------------------------------------------
app = FastAPI(title="Re:Learn API", version="2.0.0")

# Enable CORS for React frontend (Vite port 5173 / 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnosisRequest(BaseModel):
    student_answer: str = Field(..., min_length=1)
    student_reasoning: str = Field(..., min_length=1)

class AttemptRequest(BaseModel):
    user_id: str
    topic: str
    question_code: str
    student_answer: str
    student_reasoning: str
    scratchpad: Optional[str] = ""
    predicted_misconception: str
    misconception_name: str
    confidence: float
    is_resolved: bool = False

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "MySQL" if MYSQL_URL else "SQLite (relearn.db)",
        "server_time": datetime.utcnow().isoformat()
    }

@app.post("/api/diagnose")
def diagnose_answer(req: DiagnosisRequest):
    return run_ml_diagnosis(req.student_answer, req.student_reasoning)

@app.post("/api/reassess")
def reassess_transfer(payload: dict):
    ans = str(payload.get("student_answer", "")).strip()
    rsn = str(payload.get("student_reasoning", "")).lower()
    is_correct = (ans == "14")
    is_reasoned = any(k in rsn for k in ["stop", "exclude", "boundary", "not visited", "6 is"])
    return {
        "is_correct": is_correct,
        "is_reasoned": is_reasoned,
        "demonstrated": is_correct and is_reasoned
    }

@app.get("/api/attempts")
def get_attempts(user_id: str = "u_maya"):
    with SessionLocal() as db:
        attempts = db.query(AttemptModel).filter_by(user_id=user_id).order_by(AttemptModel.created_at.desc()).all()
        return [
            {
                "id": a.id,
                "topic": a.topic,
                "student_answer": a.student_answer,
                "student_reasoning": a.student_reasoning,
                "scratchpad": a.scratchpad,
                "misconception_name": a.misconception_name,
                "confidence": a.confidence,
                "is_resolved": a.is_resolved,
                "timestamp": a.created_at.strftime("Today %H:%M")
            }
            for a in attempts
        ]

@app.post("/api/attempts")
def save_attempt(req: AttemptRequest):
    with SessionLocal() as db:
        new_att = AttemptModel(
            id=f"att_{int(datetime.utcnow().timestamp())}",
            user_id=req.user_id,
            topic=req.topic,
            question_code=req.question_code,
            student_answer=req.student_answer,
            student_reasoning=req.student_reasoning,
            scratchpad=req.scratchpad,
            predicted_misconception=req.predicted_misconception,
            misconception_name=req.misconception_name,
            confidence=req.confidence,
            is_resolved=req.is_resolved
        )
        db.add(new_att)
        db.commit()
        return {"success": True, "id": new_att.id}

@app.get("/api/users")
def get_users():
    with SessionLocal() as db:
        users = db.query(UserModel).all()
        return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]

if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print("🚀 Re:Learn Backend Server is Running!")
    print(f"📁 Database Mode: {'MySQL' if MYSQL_URL else 'SQLite (relearn.db)'}")
    print("🌐 API Base URL:  http://localhost:8000")
    print("📄 API Docs URL:  http://localhost:8000/docs")
    print("=" * 60 + "\n")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)