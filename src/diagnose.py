
from pathlib import Path
import pickle

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "misconception_model.pkl"


def load_model():
    """Load the trained misconception classification model."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. "
            "Run src/train_model.py first."
        )

    with open(MODEL_PATH, "rb") as file:
        return pickle.load(file)


def diagnose(student_answer, student_reasoning):
    """Predict a possible misconception from an answer and reasoning."""

    if not student_answer.strip() or not student_reasoning.strip():
        raise ValueError(
            "Both student answer and reasoning are required."
        )

    model = load_model()

    text = (
        f"Answer: {student_answer.strip()} "
        f"Reasoning: {student_reasoning.strip()}"
    )

    probabilities = model.predict_proba([text])[0]
    classes = model.classes_

    ranked_predictions = sorted(
        zip(classes, probabilities),
        key=lambda item: item[1],
        reverse=True,
    )

    best_label, best_probability = ranked_predictions[0]

    alternatives = [
        {
            "label": label,
            "confidence": round(float(probability), 3),
        }
        for label, probability in ranked_predictions[1:3]
    ]

    return {
        "predicted_misconception": best_label,
        "confidence": round(float(best_probability), 3),
        "alternatives": alternatives,
    }


if __name__ == "__main__":
    print("=" * 45)
    print("     Re:Learn - Misconception Diagnosis")
    print("=" * 45)

    try:
        answer = input("\nEnter the student's answer: ").strip()
        reasoning = input("Enter the student's reasoning: ").strip()

        result = diagnose(answer, reasoning)

        print("\n--- Diagnosis Result ---")
        print("Predicted label:", result["predicted_misconception"])
        print(f"Model confidence: {result['confidence']:.1%}")

        print("\n--- Alternative Predictions ---")

        if result["alternatives"]:
            for item in result["alternatives"]:
                print(
                    f"{item['label']}: "
                    f"{item['confidence']:.1%}"
                )
        else:
            print("No alternative predictions available.")

        print("\nNote:")
        print(
            "These are preliminary model predictions, "
            "not confirmed diagnoses."
        )
        print(
            "Low confidence or ambiguous reasoning should "
            "trigger further questions in a complete system."
        )

    except (FileNotFoundError, ValueError) as error:
        print(f"\nError: {error}")