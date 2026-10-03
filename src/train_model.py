
from pathlib import Path
import pickle

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Project paths
ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data" / "misconception_dataset.csv"
MODEL_DIR = ROOT / "models"
MODEL_PATH = MODEL_DIR / "misconception_model.pkl"

# Load dataset
df = pd.read_csv(DATA_PATH)

required_columns = [
    "student_answer",
    "student_reasoning",
    "misconception_label",
]

missing = [column for column in required_columns if column not in df.columns]
if missing:
    raise ValueError(f"Missing dataset columns: {missing}")

df = df.dropna(subset=required_columns).copy()

# Combine answer and reasoning into model input
df["text"] = (
    "Answer: " + df["student_answer"].astype(str)
    + " Reasoning: " + df["student_reasoning"].astype(str)
)

X = df["text"]
y = df["misconception_label"].astype(str)

if y.nunique() < 2 or y.value_counts().min() < 2:
    raise ValueError(
        "Each misconception class needs at least two examples."
    )

# Split data for a basic evaluation
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y,
)

# Text classification pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            sublinear_tf=True,
        ),
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=42,
        ),
    ),
])

# Train and evaluate
model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("\n===== INITIAL MODEL EVALUATION =====")
print(f"Dataset examples: {len(df)}")
print(f"Training examples: {len(X_train)}")
print(f"Test examples: {len(X_test)}")
print("\nClassification report:")
print(classification_report(
    y_test,
    predictions,
    zero_division=0,
))

# Save model for later use
MODEL_DIR.mkdir(parents=True, exist_ok=True)

with open(MODEL_PATH, "wb") as file:
    pickle.dump(model, file)

print(f"\nModel saved to: {MODEL_PATH}")