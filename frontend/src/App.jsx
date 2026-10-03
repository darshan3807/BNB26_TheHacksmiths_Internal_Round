
import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000/api";

const navigation = [
  { title: "LEARNING SPACE", items: [
    ["Overview", "overview", "▦"],
    ["My course", "course", "▣"],
    ["Practice & quizzes", "practice", "☷"],
    ["Relearn studio", "relearn", "✳"],
    ["Learning progress", "progress", "⌁"],
  ]},
  { title: "BUILDER SPACE", items: [
    ["Model evaluation", "evaluation", "⚗"],
  ]},
];

const initialAnswer = "6";
const initialReasoning =
  "The loop visits 1, 2, and 3. I add each value to total, giving 1, then 3, then 6.";

function CodePanel({ children, title = "main.py" }) {
  return (
    <div className="code-panel">
      <div className="code-heading">
        <span>‹› &nbsp; {title}</span>
        <span>Python 3</span>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Stepper({ active }) {
  const steps = ["Quiz", "Diagnosis", "Relearn", "Recheck"];
  return (
    <div className="stepper">
      {steps.map((step, i) => (
        <div className={`step ${i + 1 <= active ? "step-active" : ""}`} key={step}>
          <span className="step-number">{i + 1 <= active && i + 1 < active ? "✓" : `0${i + 1}`}</span>
          {step}
          {i < steps.length - 1 && <span className="step-arrow">›</span>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("overview");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState("Somewhat sure");
  const [diagnosis, setDiagnosis] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceReasoning, setPracticeReasoning] = useState("");
  const [reassessment, setReassessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lessonTab, setLessonTab] = useState("Visual walkthrough");

  function startQuiz() {
    setPage("practice");
    setError("");
    setReassessment(null);
  }

  async function analyseAnswer(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setDiagnosis(null);
    setReassessment(null);

    try {
      const response = await fetch(`${API}/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_answer: answer.trim(),
          student_reasoning: reasoning.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Diagnosis request failed.");
      setDiagnosis(data);
      setPage("diagnosis");
    } catch (err) {
      setError(
        `Could not connect to the learning API. Check that FastAPI is running on port 8000. ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitReassessment(event) {
    event.preventDefault();
    if (!diagnosis) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/reassess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          misconception_label: diagnosis.predicted_misconception,
          student_answer: practiceAnswer.trim(),
          student_reasoning: practiceReasoning.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Reassessment failed.");
      setReassessment(data);
    } catch (err) {
      setError(`Could not submit your reassessment. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function resetAttempt() {
    setAnswer("");
    setReasoning("");
    setPracticeAnswer("");
    setPracticeReasoning("");
    setDiagnosis(null);
    setReassessment(null);
    setError("");
    setPage("practice");
  }

  const label = (diagnosis?.predicted_misconception || "not assessed")
    .replaceAll("_", " ");

  function renderOverview() {
    return (
      <>
        <div className="page-intro">
          <div>
            <div className="eyebrow">YOUR LEARNING STUDIO</div>
            <h1>Welcome back, Maya.</h1>
            <p>Small steps, deeper understanding. Let’s pick up where you left off.</p>
          </div>
          <span className="muted">Demo journey · Before quiz</span>
        </div>

        <div className="stats-grid">
          <Stat label="Your learning path" value="2 / 6" note="Units completed" icon="▣" />
          <Stat label="Understanding, not just scores" value="6 / 12" note="Concepts demonstrated so far" icon="✳" />
          <Stat label="A little progress every day" value="42 min" note="Learning time this week" icon="◷" />
        </div>

        <div className="dashboard-grid">
          <section className="card continue-card">
            <div className="eyebrow">CONTINUE LEARNING</div>
            <div className="continue-content">
              <div>
                <h2>Loops & the range() function</h2>
                <p>Learn which values a loop visits, then explain what your code prints.</p>
                <small>◷ 8 min &nbsp; Visual + code + practice</small>
              </div>
              <div className="range-preview">
                <code>range(1, 4)</code>
                <div className="range-values">
                  {[1, 2, 3, 4].map((n) => (
                    <span className={n === 4 ? "excluded" : "included"} key={n}>{n}</span>
                  ))}
                </div>
                <small>Start here. Stop before 4.</small>
              </div>
            </div>
            <button onClick={() => setPage("course")}>Continue to lesson <span>→</span></button>
          </section>

          <section className="card next-card">
            <h3>A good next step</h3>
            <h4>◎ &nbsp; Look closer at loop boundaries</h4>
            <p>Explore which values the loop visits. Focus on the pattern, not just the answer.</p>
            <div className="snippet">
              <code>list(range(0, 4))</code>
              <small>Expected [0, 1, 2, 3]</small>
            </div>
            <small className="purple-text">A clue to investigate, not a label about you.</small>
          </section>

          <section className="card path-card">
            <div className="card-heading"><h3>Your Python learning path</h3><button className="text-button" onClick={() => setPage("course")}>View course →</button></div>
            <div className="unit-grid">
              <Unit title="Variables" description="Names & values" complete />
              <Unit title="Conditionals" description="Making decisions" complete />
              <Unit title="Loops" description="Repeat with purpose" active />
            </div>
            <p className="muted">UP NEXT &nbsp; Lists & indexing &nbsp; → &nbsp; Functions &nbsp; → &nbsp; Build a small project</p>
          </section>

          <section className="card recent-card">
            <div className="card-heading"><h3>Recent learning</h3><small>This week</small></div>
            {["Range boundary check", "Conditional logic", "Variables & assignment"].map((item, i) => (
              <div className="recent-item" key={item}>
                <span className={i === 0 ? "gold-icon" : "green-icon"}>{i === 0 ? "◎" : "✓"}</span>
                <div><strong>{item}</strong><small>{["A pattern to explore · Today", "Understanding demonstrated · Yesterday", "Unit completed · 1 Oct"][i]}</small></div>
              </div>
            ))}
            <button className="text-button" onClick={() => setPage("progress")}>Explore your learner model →</button>
          </section>
        </div>
      </>
    );
  }

  function renderCourse() {
    return (
      <>
        <PageIntro eyebrow="PYTHON FOUNDATIONS · UNIT 03" title="Loops: one step at a time." subtitle="Make repetition predictable by understanding the values your loop visits." />
        <div className="course-layout">
          <section className="card course-list">
            <h3>Course content</h3>
            <p className="muted">2 of 6 units completed · Self-paced</p>
            {["01  Variables & types", "02  Conditionals", "03  Loops & iteration", "04  Lists & indexing", "05  Functions", "06  Your first project"].map((item, i) => (
              <button key={item} className={`course-item ${i === 2 ? "selected" : ""}`} onClick={() => i === 2 ? setLessonTab("Visual walkthrough") : setError("This demo currently focuses on the Loops unit.")}>{item}<span>{i < 2 ? "✓" : i === 2 ? "⌄" : "○"}</span></button>
            ))}
          </section>

          <div className="course-main">
            <section className="card">
              <div className="card-heading"><h3>Understanding range()</h3><span className="pill">Lesson 03 / 04</span></div>
              <div className="tabs">
                {["Visual walkthrough", "Read explanation", "Code example"].map((tab) => (
                  <button className={lessonTab === tab ? "tab active-tab" : "tab"} key={tab} onClick={() => setLessonTab(tab)}>{tab}</button>
                ))}
              </div>
              {lessonTab === "Visual walkthrough" ? (
                <>
                  <p>Think of range(start, stop) as a path: begin at start, visit each whole number, and stop just before stop.</p>
                  <RangeDiagram />
                </>
              ) : lessonTab === "Read explanation" ? (
                <div className="lesson-copy"><h3>The stop value is excluded</h3><p>Python includes the start value and excludes the stop value. For a positive step, the loop continues while the current value is less than stop.</p><code>start ≤ n &lt; stop</code><p>For range(1, 4), n can be 1, 2, or 3.</p></div>
              ) : (
                <CodePanel>{"for number in range(1, 4):\n    print(number)\n\n# Output: 1 2 3"}</CodePanel>
              )}
            </section>

            <div className="two-columns">
              <CodePanel>{"for number in range(1, 4):\n    print(number)\n\n# Output → 1 2 3"}</CodePanel>
              <section className="card">
                <h3>Trace the loop</h3>
                {[1, 2, 3].map((n) => <div className="trace-row" key={n}><span>{["First", "Second", "Third"][n - 1]} visit</span><code>number = {n}</code></div>)}
                <p className="purple-text">4 is never assigned to number.</p>
              </section>
            </div>
            <section className="card start-check"><div><h3>Ready to explain it yourself?</h3><p>Try a short check. We’ll learn from your reasoning.</p></div><button onClick={startQuiz}>Start understanding check →</button></section>
          </div>
        </div>
      </>
    );
  }

  function renderPractice() {
    return (
      <>
        <PageIntro eyebrow="UNIT 03 · UNDERSTANDING CHECK" title="What will this loop print?" subtitle="An answer tells us what you think. Your explanation helps us understand why." />
        <Stepper active={1} />
        <form className="practice-grid" onSubmit={analyseAnswer}>
          <div className="practice-left">
            <section className="card">
              <div className="card-heading"><span className="pill">Predict the output</span><small>Loops · No time limit</small></div>
              <h3>Read the code without running it. What value is printed, and how did you get there?</h3>
              <CodePanel title="loop_check.py">{"total = 0\nfor n in range(1, 4):\n    total = total + n\n\nprint(total)"}</CodePanel>
              <p className="muted">♧ Trace the values of n and total. You can use the scratchpad below.</p>
            </section>
            <section className="card scratchpad">
              <div className="card-heading"><h3>Your scratchpad</h3><small>Optional · Not executed</small></div>
              <code>n values: 1, 2, 3<br />total: &nbsp;&nbsp;1 → 3 → 6</code>
              <p className="muted">Notes or working code can help distinguish a boundary mistake from an accumulation mistake.</p>
            </section>
          </div>
          <section className="card thinking-form">
            <div className="card-heading"><h3>Share your thinking</h3><small>Not graded</small></div>
            <label htmlFor="answer">01 &nbsp; Your predicted output</label>
            <input id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="e.g. 6" required />
            <label htmlFor="reasoning">02 &nbsp; Explain how you got there</label>
            <textarea id="reasoning" value={reasoning} onChange={(e) => setReasoning(e.target.value)} placeholder="Explain how you reached your answer, step by step..." rows={5} required />
            <small className="muted">Which values does the loop visit? How does total change? It’s okay to be unsure.</small>
            <label>03 &nbsp; How confident do you feel?</label>
            <div className="confidence-options">
              {["Still exploring", "Somewhat sure", "Very sure"].map((item) => <button type="button" key={item} className={confidence === item ? "confidence selected" : "confidence"} onClick={() => setConfidence(item)}>{item}</button>)}
            </div>
            <div className="notice">✳ &nbsp; We’ll compare your answer, explanation and working to explore the concept—not just mark an answer wrong.</div>
            {error && <p className="error-message">{error}</p>}
            <button className="full-button" type="submit" disabled={loading}>{loading ? "Analysing…" : "Analyse my reasoning →"}</button>
          </section>
        </form>
      </>
    );
  }

  function renderDiagnosis() {
    return (
      <>
        <PageIntro eyebrow="YOUR LEARNING CHECK · DIAGNOSIS" title="Let's look at the thinking behind your answer." subtitle="The prediction is a clue to explore, not a fixed label about you." />
        <Stepper active={2} />
        {!diagnosis ? <section className="card"><p>Submit a quiz answer first.</p><button onClick={startQuiz}>Go to practice →</button></section> : (
          <div className="diagnosis-layout">
            <section className="card">
              <span className="pill">PRELIMINARY MODEL PREDICTION</span>
              <h2 className="capitalize">{label}</h2>
              <p>Relative model confidence: <strong>{Math.round(diagnosis.confidence * 100)}%</strong></p>
              <div className="confidence-bar"><span style={{ width: `${Math.max(3, diagnosis.confidence * 100)}%` }} /></div>
              <div className="notice">{diagnosis.notice || "This is a preliminary prediction, not a confirmed diagnosis."}</div>
              <h3>Your submitted answer</h3><p>{answer}</p>
              <h3>Your explanation</h3><p>{reasoning}</p>
              {diagnosis.alternatives?.length > 0 && <><h3>Other possible patterns</h3>{diagnosis.alternatives.map((item) => <div className="alternative" key={item.label}><span className="capitalize">{item.label.replaceAll("_", " ")}</span><strong>{Math.round(item.confidence * 100)}%</strong></div>)}</>}
              <button onClick={() => setPage("relearn")}>Explore this concept →</button>
            </section>
            <section className="card">
              <div className="eyebrow">WHAT HAPPENS NEXT</div>
              <h2>Understand, don't just score.</h2>
              <p>We’ll use a focused explanation and a new question to help you explore the underlying concept.</p>
              <RangeDiagram />
              <button className="full-button" onClick={() => setPage("relearn")}>Continue to relearning →</button>
            </section>
          </div>
        )}
      </>
    );
  }

  function renderRelearn() {
    const lesson = diagnosis?.lesson;
    return (
      <>
        <PageIntro eyebrow="A LESSON PICKED FOR YOUR REASONING" title="The stop is a boundary, not a destination." subtitle="Let’s rebuild your mental model of range() in three different ways." />
        <Stepper active={3} />
        <div className="relearn-layout">
          <div className="relearn-left">
            <section className="card">
              <div className="card-heading"><h3>▣ &nbsp; See the boundary</h3><span className="pill">01 · Visual</span></div>
              <RangeDiagram />
              <p className="muted">Python visits the start value and stops before the stop value.</p>
            </section>
            <section className="card">
              <div className="card-heading"><h3>Trace it in code</h3><span className="pill">03 · Code</span></div>
              <CodePanel>{"total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)\n\n# Output → 6"}</CodePanel>
            </section>
          </div>
          <div className="relearn-right">
            <section className="card">
              <div className="card-heading"><h3>Put it into words</h3><span className="pill">02 · Text</span></div>
              <h2>{lesson?.title || "Understanding range()"}</h2>
              <p>{lesson?.explanation || "range(start, stop) includes start and excludes stop."}</p>
              {lesson?.example && <div className="snippet"><code>{lesson.example}</code></div>}
              <div className="notice">start ≤ n &lt; stop<br />For range(1, 4), n can be 1, 2 or 3.</div>
            </section>
            <section className="card">
              <h3>Explain it back</h3>
              <p>What would you change in your original explanation?</p>
              <textarea rows={4} value={practiceReasoning} onChange={(e) => setPracticeReasoning(e.target.value)} placeholder="Explain what you understand now..." />
              <p className="muted">A helpful reflection. Now let’s test it in a different context.</p>
            </section>
          </div>
        </div>
        <section className="next-banner"><div><h3>New context. Same concept.</h3><p>We’ll check your answer and explanation, not just whether you remember a number.</p></div><button onClick={() => { setPracticeAnswer(""); setReassessment(null); setPage("recheck"); }}>Try a fresh understanding check →</button></section>
      </>
    );
  }

  function renderRecheck() {
    const question = diagnosis?.practice_question || "What values does list(range(2, 5)) produce?";
    return (
      <>
        <PageIntro eyebrow="UNIT 03 · RECHECK" title="Try the concept in a new context." subtitle="Use what you learned, then explain why your answer makes sense." />
        <Stepper active={4} />
        <form className="card recheck-card" onSubmit={submitReassessment}>
          <span className="pill">FRESH PRACTICE QUESTION</span>
          <h2>{question}</h2>
          {question.includes("\n") && <CodePanel>{question}</CodePanel>}
          <label htmlFor="practice-answer">Your answer</label>
          <input id="practice-answer" value={practiceAnswer} onChange={(e) => setPracticeAnswer(e.target.value)} placeholder="Enter your answer" required />
          <label htmlFor="practice-reasoning">Explain your reasoning</label>
          <textarea id="practice-reasoning" value={practiceReasoning} onChange={(e) => setPracticeReasoning(e.target.value)} placeholder="Explain how you worked it out..." rows={4} required />
          {diagnosis?.practice_hint && <p className="muted">Hint: {diagnosis.practice_hint}</p>}
          {error && <p className="error-message">{error}</p>}
          <button className="full-button" disabled={loading}>{loading ? "Checking…" : "Check my understanding →"}</button>
          {reassessment && <div className={`result-box ${reassessment.result === "correct" ? "result-correct" : ""}`}><h3>{reassessment.result === "correct" ? "A positive practice result" : reassessment.result === "explanation_needed" ? "Your answer matches — let's explain why" : "Keep exploring"}</h3><p>{reassessment.feedback}</p><small>Practice feedback is not proof of lasting mastery.</small></div>}
          {reassessment && <button type="button" onClick={() => setPage("progress")}>View learning progress →</button>}
        </form>
      </>
    );
  }

  function renderProgress() {
    return (
      <>
        <PageIntro eyebrow="YOUR UNDERSTANDING, OVER TIME" title="Progress is more than a correct answer." subtitle="See concepts you’ve demonstrated and patterns to explore next." />
        <div className="stats-grid"><Stat label="Concepts demonstrated" value={reassessment?.result === "correct" ? "7 / 12" : "6 / 12"} note="Demo progress" icon="✳" /><Stat label="Recurring pattern tracked" value={diagnosis ? "1" : "0"} note="Based on this session" icon="◎" /><Stat label="Retention check planned" value="1" note="Not checked yet" icon="▦" /></div>
        <section className="card progress-card"><h2>A learning record for this session</h2><p>{diagnosis ? `The model suggested: ${label}.` : "Complete a practice check to create a session record."}</p>{diagnosis && <div className="progress-event"><span>◎</span><div><h3>Initial check</h3><p>Your answer: {answer}</p><small>{reasoning}</small></div></div>}{reassessment && <div className="progress-event"><span>✓</span><div><h3>Reassessment</h3><p>{reassessment.feedback}</p></div></div>}<p className="muted">This prototype does not yet save learner history between browser sessions.</p><button onClick={startQuiz}>Start another practice check →</button></section>
        <section className="card"><h3>Your learner model</h3><p>Understanding should be based on evidence from multiple attempts, not one model prediction.</p><div className="unit-grid"><Unit title="Variable assignment" description="Needs more evidence" /><Unit title="Loop boundaries" description={reassessment?.result === "correct" ? "Positive practice result" : "Practise and reflect"} active /><Unit title="Accumulation" description="Needs more evidence" /></div></section>
      </>
    );
  }

  function renderEvaluation() {
    return <><PageIntro eyebrow="BUILDER SPACE" title="Model evaluation" subtitle="Review a prediction carefully. The prototype uses a small synthetic dataset." /><section className="card"><h3>Current model limitations</h3><ul><li>Predictions can be uncertain or incorrect.</li><li>Confidence is a model estimate, not a probability of true understanding.</li><li>Reassessment uses simple answer and keyword checks.</li><li>Real learner progress is not persisted yet.</li></ul><button onClick={startQuiz}>Run a practice check →</button></section></>;
  }

  const renderers = {
    overview: renderOverview,
    course: renderCourse,
    practice: renderPractice,
    diagnosis: renderDiagnosis,
    relearn: renderRelearn,
    recheck: renderRecheck,
    progress: renderProgress,
    evaluation: renderEvaluation,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage("overview")}><span className="brand-mark">r:</span><span>Re:Learn</span></button>
        {navigation.map((group) => <div className="nav-group" key={group.title}><div className="nav-heading">{group.title}</div>{group.items.map(([title, id, icon]) => <button key={id} className={`nav-link ${page === id || (id === "practice" && ["diagnosis", "recheck"].includes(page)) || (id === "relearn" && page === "relearn") ? "nav-active" : ""}`} onClick={() => { setPage(id); setError(""); }}>{icon}<span>{title}</span></button>)}</div>)}
        <div className="sidebar-course"><strong>Python foundations</strong><p>2 of 6 units completed</p><div className="mini-progress"><span /></div><button onClick={() => setPage("course")}>View learning path →</button></div>
        <div className="sidebar-bottom"><span>ⓘ &nbsp; Help & getting started</span><div className="profile"><span className="avatar">MC</span><div><strong>Maya Chen</strong><small>Demo learner</small></div></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div><span className="muted">Workspace</span><span className="crumb">›</span><strong>{page === "overview" ? "Overview" : page === "course" ? "Python foundations / Loops" : page === "practice" ? "Practice / Loop understanding check" : page === "diagnosis" ? "Practice / Diagnosis" : page === "relearn" ? "Relearn studio / Range boundaries" : page === "recheck" ? "Practice / Recheck" : page === "progress" ? "Learning progress / Learner model" : "Model evaluation"}</strong></div><div className="top-actions"><span className="search-box">⌕ &nbsp; Search your learning space</span><span className="workspace-tag">DEMO WORKSPACE</span><span>♧</span></div></header>
        <div className="page-content">
          {renderers[page]()}
          <footer>Demo content · Sample learner data, not a live assessment <span>Understand the why. Learn a better way.</span></footer>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, note, icon }) {
  return <section className="card stat-card"><div>{label}<span>{icon}</span></div><strong>{value}</strong><small>{note}</small></section>;
}

function Unit({ title, description, complete, active }) {
  return <div className={`unit-card ${active ? "unit-active" : ""}`}><span className={complete ? "green-text" : "purple-text"}>{complete ? "✓" : active ? "↻" : "○"}</span><h4>{title}</h4><p>{description}</p><small className={complete ? "green-text" : "purple-text"}>{complete ? "Completed" : active ? "In progress" : "Upcoming"}</small></div>;
}

function PageIntro({ eyebrow, title, subtitle }) {
  return <div className="page-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}

function RangeDiagram() {
  return <div className="range-diagram"><div className="diagram-code">range(1, 4)<small>Default step: +1</small></div><div className="diagram-values">{[1, 2, 3, 4].map((n) => <div className="diagram-value-wrap" key={n}><div className={`diagram-value ${n === 1 ? "value-start" : n === 4 ? "value-stop" : ""}`}>{n}</div><small>{n === 1 ? "start · included" : n === 4 ? "stop · excluded" : n === 3 ? "last value" : "next value"}</small></div>)}</div><p>The stop value marks a boundary, not a value to visit.</p></div>;
}