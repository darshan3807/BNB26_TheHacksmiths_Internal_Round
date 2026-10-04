import React, { useState } from "react";
import { Check, Code2, ArrowRight, Clock } from "lucide-react";

export default function RecheckPage({
  onNavigateStep,
  onViewProgress
}) {
  const [transferAnswer, setTransferAnswer] = useState("14");
  const [transferReasoning, setTransferReasoning] = useState(
    "The levels are 2, 3, 4 and 5. 6 is the stop boundary, so it is not visited. The points are 2 + 3 + 4 + 5 = 14."
  );
  const [counterfactualAnswer, setCounterfactualAnswer] = useState(
    "Level 6 would be included, but 7 still would not. That adds 6 points, so the new total is 20."
  );

  return (
    <div className="recheck-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">TRANSFER CHECK · ATTEMPT 03</div>
          <h1 className="page-title">Can you use the idea in a new context?</h1>
          <p className="page-subtitle">
            New boundaries, a new story, and a follow-up explanation. No answer memorization.
          </p>
        </div>
        <div className="header-meta meta-active">
          <Check size={13} strokeWidth={3} />
          <span>Response reviewed</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper-container">
        <button
          className="step-item step-complete"
          onClick={() => onNavigateStep("quiz")}
        >
          <span className="step-badge">
            <Check size={11} strokeWidth={3} />
          </span>
          <span>Quiz</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item step-complete"
          onClick={() => onNavigateStep("diagnosis")}
        >
          <span className="step-badge">
            <Check size={11} strokeWidth={3} />
          </span>
          <span>Diagnosis</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item step-complete"
          onClick={() => onNavigateStep("relearn")}
        >
          <span className="step-badge">
            <Check size={11} strokeWidth={3} />
          </span>
          <span>Relearn</span>
        </button>
        <span className="step-sep">›</span>
        <button
          className="step-item step-active"
          onClick={() => onNavigateStep("recheck")}
        >
          <span className="step-badge">04</span>
          <span>Recheck</span>
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid-2col">
        {/* Left Column: Context & Explanation */}
        <div>
          {/* Problem Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Points at a coding club</h3>
              <span className="pill-badge badge-blue">Changed context</span>
            </div>
            <p className="lesson-desc-text" style={{ marginBottom: "12px" }}>
              A club awards points for challenge levels. Predict the total points, then explain which levels contribute.
            </p>

            <div className="code-panel">
              <div className="code-header">
                <div className="code-title">
                  <Code2 size={13} />
                  <span>club_points.py</span>
                </div>
                <span>Python 3</span>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span className="line-num">1</span>
                  <span>points = <span className="code-num">0</span></span>
                </div>
                <div className="code-line">
                  <span className="line-num">2</span>
                  <span><span className="code-kw">for</span> level <span className="code-kw">in</span> <span className="code-fn">range</span>(<span className="code-num">2</span>, <span className="code-num">6</span>):</span>
                </div>
                <div className="code-line">
                  <span className="line-num">3</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;points += level</span>
                </div>
                <div className="code-line">
                  <span className="line-num">4</span>
                  <span></span>
                </div>
                <div className="code-line">
                  <span className="line-num">5</span>
                  <span><span className="code-fn">print</span>(points)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Explanation Card */}
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-header-row">
              <h3 className="card-title-sub">Your submitted explanation</h3>
              <span className="pill-badge badge-purple">Very sure</span>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <span className="field-sub-header">PREDICTED OUTPUT</span>
              <div className="predicted-large-val">{transferAnswer}</div>
            </div>

            <div className="evidence-quote" style={{ marginBottom: "16px" }}>
              "{transferReasoning}"
            </div>

            {/* Counterfactual Callout */}
            <div className="counterfactual-box">
              <div className="counterfactual-title">
                What changes if the stop value becomes 7?
              </div>
              <div className="counterfactual-answer">
                "{counterfactualAnswer}"
              </div>
            </div>

            <div className="history-notice-p">
              Your learning history keeps the original attempts and this new evidence.
            </div>
          </div>
        </div>

        {/* Right Column: Demonstrated Evidence & Learner Model Updated */}
        <div>
          {/* Demonstrated Evidence */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Understanding demonstrated</h3>
              <span style={{ color: "var(--green)" }}>
                <Check size={20} strokeWidth={2.5} />
              </span>
            </div>
            <p className="lesson-desc-text" style={{ marginBottom: "16px" }}>
              The answer and reasoning agree. Here's the evidence we checked:
            </p>

            <div className="checks-list">
              <div className="check-evidence-row">
                <span className="check-icon-circle">
                  <Check size={13} strokeWidth={3} />
                </span>
                <div>
                  <strong>Correct output</strong>
                  <p>14 matches the trace: 2 → 5 → 9 → 14.</p>
                </div>
              </div>

              <div className="check-evidence-row">
                <span className="check-icon-circle">
                  <Check size={13} strokeWidth={3} />
                </span>
                <div>
                  <strong>Correct boundary explanation</strong>
                  <p>You explicitly exclude 6 and include the start, 2.</p>
                </div>
              </div>

              <div className="check-evidence-row">
                <span className="check-icon-circle">
                  <Check size={13} strokeWidth={3} />
                </span>
                <div>
                  <strong>Transfer to a counterfactual</strong>
                  <p>You predict 20 when the stop changes to 7, and explain why.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Learner Model Updated Card */}
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-header-row">
              <h3 className="card-title-sub">Learner model updated</h3>
              <span className="pill-badge badge-purple">Provisional</span>
            </div>

            <div className="model-transition-line">
              Recurring boundary confusion → <span style={{ color: "var(--primary)" }}>Transfer demonstrated</span>
            </div>

            <p className="model-transition-desc">
              One successful transfer check is encouraging, but doesn't establish lasting resolution. We'll check retention in your next session.
            </p>

            <div className="delayed-check-box">
              <Clock size={16} className="delayed-check-icon" />
              <div>
                <strong>Delayed check · Next session</strong>
                <p>A fresh loop, without the lesson beside it</p>
              </div>
            </div>

            <button
              className="btn-text"
              style={{ marginTop: "12px" }}
              onClick={() => onNavigateStep("relearn")}
            >
              <span>Still unsure? Revisit the visual walkthrough.</span>
            </button>

            <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border-light)" }}>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={onViewProgress}
              >
                <span>View my learning progress</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
