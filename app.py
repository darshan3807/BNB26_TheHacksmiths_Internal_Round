
import streamlit as st

st.set_page_config(
    page_title="Re:Learn | Adaptive Learning",
    page_icon="🧠",
    layout="wide",
)

# Temporary questions for the first prototype.
# The trained ML model will be added in a later step.
QUESTIONS = {
    "Variables and assignment": {
        "code": "x = 5\nx = x + 2\nprint(x)",
        "correct_answer": "7",
        "concept": "Variable reassignment",
        "explanation": (
            "The first line assigns 5 to x. "
            "The second line reads the current value of x, "
            "adds 2, and stores 7 back in x."
        ),
    },
    "Addition and multiplication": {
        "code": "x = 3 + 2 * 4\nprint(x)",
        "correct_answer": "11",
        "concept": "Operator precedence",
        "explanation": (
            "Multiplication happens before addition. "
            "First calculate 2 * 4 = 8, then 3 + 8 = 11."
        ),
    },
    "Python loops": {
        "code": "total = 0\nfor i in range(3):\n    total += i\nprint(total)",
        "correct_answer": "3",
        "concept": "Loop execution",
        "explanation": (
            "range(3) produces 0, 1, and 2. "
            "The total becomes 0 + 1 + 2 = 3."
        ),
    },
}

if "attempts" not in st.session_state:
    st.session_state.attempts = 0

if "correct" not in st.session_state:
    st.session_state.correct = 0

st.title("🧠 Re:Learn")
st.subheader("Understand the mistake. Learn the concept.")

st.write(
    "An adaptive learning prototype for introductory programming. "
    "Practice a question, explain your reasoning, and learn from mistakes."
)

# Summary metrics
col1, col2, col3 = st.columns(3)

col1.metric("Questions attempted", st.session_state.attempts)
col2.metric("Correct answers", st.session_state.correct)
col3.metric(
    "Accuracy",
    f"{100 * st.session_state.correct / st.session_state.attempts:.0f}%"
    if st.session_state.attempts else "—",
)

st.divider()

st.header("Your learning workspace")

topic = st.selectbox(
    "Choose a programming concept",
    list(QUESTIONS.keys()),
)

question = QUESTIONS[topic]

st.markdown(f"### Concept: {question['concept']}")
st.write("Study the code and predict its output.")

st.code(question["code"], language="python")

with st.form("answer_form"):
    answer = st.text_input(
        "What will the code print?",
        placeholder="Enter your predicted output",
    )

    reasoning = st.text_area(
        "How did you arrive at your answer?",
        placeholder="Explain your thinking in your own words...",
    )

    submitted = st.form_submit_button(
        "Check my answer",
        type="primary",
    )

if submitted:
    if not answer.strip():
        st.warning("Enter your answer before submitting.")
    else:
        st.session_state.attempts += 1

        is_correct = (
            answer.strip() == question["correct_answer"]
        )

        if is_correct:
            st.session_state.correct += 1
            st.success("Your answer is correct!")
        else:
            st.warning(
                "Your answer differs from the expected output. "
                "Let's review the concept."
            )

        st.markdown("### Concept explanation")
        st.write(question["explanation"])

        if reasoning.strip():
            st.markdown("### Your reasoning")
            st.write(reasoning)

        st.caption(
            "Prototype stage: this version checks the final answer "
            "against a known answer. It does not yet diagnose the "
            "underlying misconception using a trained ML model."
        )

        st.rerun()

st.divider()

st.caption(
    "Re:Learn | Introductory Programming | AI-assisted learning"
)