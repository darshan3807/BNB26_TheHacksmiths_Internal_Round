
import re


def normalize_answer(answer):
    """Convert different number-list formats into a common format."""
    return re.findall(r"-?\d+", answer.strip())


def assess_answer(misconception_label, student_answer):
    """Check a student's answer against the expected answer."""

    expected_answers = {
        "loop_range": ["2", "3", "4"],
        "variable_reassignment": ["15"],
        "operator_precedence": ["14"],
        "loop_accumulation": ["6"],
        "correct_understanding": ["6"],
    }

    accepted = expected_answers.get(misconception_label)

    if accepted is None:
        return {
            "result": "needs_review",
            "message": "This question does not have an automatic answer check yet.",
        }

    actual = normalize_answer(student_answer)

    if actual == accepted:
        return {
            "result": "correct",
            "message": (
                "Correct! range(2, 5) produces 2, 3, and 4. "
                "The stop value 5 is excluded."
            ),
        }

    return {
        "result": "incorrect",
        "message": (
            "Not quite. Remember that range(start, stop) "
            "includes the start value but excludes the stop value. "
            "Try again."
        ),
    }


if __name__ == "__main__":
    print("=== Re:Learn Reassessment ===")
    print("Question: What values does range(2, 5) produce?")
    answer = input("Your answer: ")

    result = assess_answer("loop_range", answer)

    print("\nResult:", result["result"])
    print(result["message"])