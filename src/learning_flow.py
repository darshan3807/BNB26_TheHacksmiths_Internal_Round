
from diagnose import diagnose
from intervention import get_intervention


# Initial threshold for this prototype, not yet calibrated.
CONFIDENCE_THRESHOLD = 0.50


def run_learning_flow(answer, reasoning):
    """Connect misconception diagnosis with targeted support."""

    result = diagnose(answer, reasoning)

    label = result["predicted_misconception"]
    confidence = result["confidence"]

    print("\n" + "=" * 45)
    print("          Re:Learn Learning Flow")
    print("=" * 45)

    print("\nPredicted misconception:", label)
    print(f"Model confidence: {confidence:.1%}")

    # Do not immediately treat a low-confidence prediction as fact.
    if confidence < CONFIDENCE_THRESHOLD:
        print("\nDiagnosis is uncertain.")
        print("Clarifying question:")
        print(
            "Can you explain how you reached your answer, "
            "step by step?"
        )
        print(
            "\nNo specific misconception has been confirmed."
        )
        return {
            "status": "needs_clarification",
            "diagnosis": result,
        }

    intervention = get_intervention(label)

    print("\n--- Targeted Lesson ---")
    print("Topic:", intervention["title"])
    print("\nExplanation:")
    print(intervention["explanation"])
    print("\nExample:")
    print(intervention["example"])
    print("\n--- Reassessment ---")
    print(intervention["question"])

    return {
        "status": "intervention_provided",
        "diagnosis": result,
        "intervention": intervention,
    }


if __name__ == "__main__":
    answer = input("Enter the student's answer: ").strip()
    reasoning = input("Enter the student's reasoning: ").strip()

    if not answer or not reasoning:
        print("Please enter both an answer and reasoning.")
    else:
        try:
            run_learning_flow(answer, reasoning)
        except (FileNotFoundError, ValueError) as error:
            print(f"Error: {error}")