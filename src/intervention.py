
"""
Re:Learn - Targeted Learning Interventions

Maps a predicted misconception to a focused explanation
and a reassessment question.
"""

INTERVENTIONS = {
    "correct_understanding": {
        "title": "Build on your understanding",
        "explanation": (
            "Your response may indicate that you understand "
            "the concept. Let's verify your understanding "
            "with a new example."
        ),
        "example": (
            "In Python, range(2, 5) produces 2, 3, 4."
        ),
        "question": (
            "What values does range(3, 6) produce, "
            "and why is the stop value handled that way?"
        ),
        "expected_answer": "3, 4, 5",
    },

    "variable_reassignment": {
        "title": "Understand variable reassignment",
        "explanation": (
            "A variable can be assigned a new value. "
            "In x = x + 2, Python reads the current value "
            "of x, adds 2, and stores the result back in x."
        ),
        "example": (
            "x = 5\n"
            "x = x + 2\n"
            "print(x)  # 7"
        ),
        "question": (
            "If x = 4 and then x = x + 3, "
            "what does print(x) display?"
        ),
        "expected_answer": "7",
    },

    "operator_precedence": {
        "title": "Understand operator precedence",
        "explanation": (
            "Python follows operator precedence. "
            "Multiplication is evaluated before addition "
            "unless parentheses change the order."
        ),
        "example": "print(3 + 2 * 4)  # 11",
        "question": (
            "What does print(5 + 3 * 2) display? "
            "Explain which operation happens first."
        ),
        "expected_answer": "11",
    },

    "loop_range": {
        "title": "Understand the range() boundary",
        "explanation": (
            "In range(start, stop), Python includes the "
            "start value and excludes the stop value "
            "when using the default positive step."
        ),
        "example": (
            "list(range(1, 4))  # [1, 2, 3]\n"
            "The value 4 is not included."
        ),
        "question": (
            "What values does range(2, 5) produce? "
            "Explain why the final value is included "
            "or excluded."
        ),
        "expected_answer": "2, 3, 4",
    },

    "loop_accumulation": {
        "title": "Trace the running total",
        "explanation": (
            "An accumulator stores a running result. "
            "Each iteration updates its current value. "
            "Trace the variable after every iteration."
        ),
        "example": (
            "total = 0\n"
            "for i in range(3):\n"
            "    total += i\n"
            "# total changes: 0 -> 0 -> 1 -> 3"
        ),
        "question": (
            "What is the final value of total?\n"
            "total = 0\n"
            "for i in range(1, 4):\n"
            "    total += i"
        ),
        "expected_answer": "6",
    },

    "uncertain": {
        "title": "Let's understand your thinking",
        "explanation": (
            "There is not enough evidence to identify "
            "a specific misconception confidently. "
            "Let's work through a smaller example together."
        ),
        "example": (
            "For range(1, 3), the values are 1 and 2."
        ),
        "question": (
            "What values do you think range(1, 3) produces? "
            "Explain your answer in your own words."
        ),
        "expected_answer": "1, 2",
    },
}


def get_intervention(misconception_label):
    """Return the intervention matching a predicted label."""

    label = str(misconception_label).strip().lower()

    return INTERVENTIONS.get(
        label,
        INTERVENTIONS["uncertain"],
    )


def display_intervention(misconception_label):
    """Print the intervention in a readable format."""

    intervention = get_intervention(misconception_label)

    print("\n" + "=" * 45)
    print("         Re:Learn - Targeted Support")
    print("=" * 45)

    print("\nLesson:", intervention["title"])
    print("\nExplanation:")
    print(intervention["explanation"])

    print("\nExample:")
    print(intervention["example"])

    print("\nReassessment question:")
    print(intervention["question"])

    print("\nNote: The predicted label is a hypothesis,")
    print("not a confirmed diagnosis.")


if __name__ == "__main__":
    print("Available misconception labels:")
    for label in INTERVENTIONS:
        print("-", label)

    label = input(
        "\nEnter the predicted misconception label: "
    ).strip()

    display_intervention(label)