import React, { useState } from "react";
import {
  Code2,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw
} from "lucide-react";

export default function QuizPage({
  studentAnswer,
  setStudentAnswer,
  studentReasoning,
  setStudentReasoning,
  scratchpadText,
  setScratchpadText,
  confidence,
  setConfidence,
  onSubmitQuiz,
  onNavigateStep
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitQuiz();
    }, 400);
  };

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">UNIT 03 · UNDERSTANDING CHECK</div>
          <h1 className="page-title">What will this loop print?</h1>
          <p className="page-subtitle">
            An answer tells us what you think. Your explanation helps us understand why.
          </p>
        </div>
        <div className="header-meta">
          <span>Demo journey · Attempt 02</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper-container">
        <button
          className="step-item step-active"
          onClick={() => onNavigateStep("quiz")}
        >
          <span className="step-badge">01</span>
          <span>Quiz</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item"
          onClick={() => onNavigateStep("diagnosis")}
        >
          <span className="step-badge">02</span>
          <span>Diagnosis</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item"
          onClick={() => onNavigateStep("relearn")}
        >
          <span className="step-badge">03</span>
          <span>Relearn</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item"
          onClick={() => onNavigateStep("recheck")}
        >
          <span className="step-badge">04</span>
          <span>Recheck</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid-2col">
        {/* Left Column: Code & Scratchpad */}
        <div>
          {/* Code Card */}
          <div className="card">
            <div className="card-header-row">
              <span className="pill-badge badge-blue">Predict the output</span>
              <span className="meta-light-pill">Loops · No time limit</span>
            </div>

            <h3 className="quiz-prompt-title">
              Read the code without running it. What value is printed, and how did you get there?
            </h3>

            {/* Code Block */}
            <div className="code-panel">
              <div className="code-header">
                <div className="code-title">
                  <Code2 size={13} />
                  <span>loop_check.py</span>
                </div>
                <span>Python 3</span>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span className="line-num">1</span>
                  <span>total = <span className="code-num">0</span></span>
                </div>
                <div className="code-line">
                  <span className="line-num">2</span>
                  <span><span className="code-kw">for</span> n <span className="code-kw">in</span> <span className="code-fn">range</span>(<span className="code-num">1</span>, <span className="code-num">4</span>):</span>
                </div>
                <div className="code-line">
                  <span className="line-num">3</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;total = total + n</span>
                </div>
                <div className="code-line">
                  <span className="line-num">4</span>
                  <span></span>
                </div>
                <div className="code-line">
                  <span className="line-num">5</span>
                  <span><span className="code-fn">print</span>(total)</span>
                </div>
              </div>
            </div>

            <div className="info-callout callout-purple" style={{ margin: "14px 0 0" }}>
              <span>📍</span>
              <span>Trace the values of n and total. You can use the scratchpad below.</span>
            </div>
          </div>

          {/* Scratchpad Card */}
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-header-row">
              <h3 className="card-title-sub">Your scratchpad</h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="meta-light-pill">Optional · Not executed</span>
                <span className="pill-badge badge-gray">Demo draft saved</span>
              </div>
            </div>

            <textarea
              className="textarea-input scratchpad-textarea"
              rows={3}
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              placeholder="e.g. n values: 1, 2, 3... total = ..."
            />

            <p className="scratchpad-note-text">
              Notes or working code can help us tell a boundary mistake from an accumulation mistake.
            </p>
          </div>

          {/* Bottom Chips */}
          <div className="quiz-bottom-chips-row">
            <span>Concepts in this check: range boundaries · accumulation · loop tracing</span>
            <span>Practice, not a grade</span>
          </div>
        </div>

        {/* Right Column: Share Your Thinking */}
        <div>
          <div className="card share-thinking-card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Share your thinking</h3>
              <span className="pill-badge badge-green">
                <Check size={11} strokeWidth={3} />
                <span>All fields saved</span>
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Field 01 */}
              <div className="form-group">
                <label className="form-label">01 &nbsp; Your predicted output</label>
                <input
                  type="text"
                  className="text-input"
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Enter the printed integer"
                  required
                />
                <div className="form-subtext">
                  Enter the exact value printed by the program.
                </div>
              </div>

              {/* Field 02 */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    02 &nbsp; Explain how you got there
                  </label>
                  <span className="pill-badge badge-purple" style={{ fontSize: "9px" }}>
                    Explanation saved
                  </span>
                </div>
                <textarea
                  className="textarea-input"
                  rows={4}
                  value={studentReasoning}
                  onChange={(e) => setStudentReasoning(e.target.value)}
                  placeholder="Which values does the loop visit? How does total change?"
                  required
                />
                <div className="form-subtext">
                  Which values does the loop visit? How does total change? It's okay to be unsure.
                </div>
              </div>

              {/* Field 03 */}
              <div className="form-group">
                <label className="form-label">03 &nbsp; How confident do you feel?</label>
                <div className="confidence-group">
                  {["Still exploring", "Somewhat sure", "Very sure"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`confidence-btn ${confidence === lvl ? "selected" : ""}`}
                      onClick={() => setConfidence(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice Banner */}
              <div className="info-callout callout-purple">
                <Sparkles size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  We'll compare your answer, explanation and working to find the concept that needs attention—not just mark an answer wrong.
                </span>
              </div>

              {/* Actions Footer */}
              <div className="action-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => alert("Progress saved locally.")}
                >
                  Save & come back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? "Analyzing reasoning..." : "Analyze my reasoning"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
