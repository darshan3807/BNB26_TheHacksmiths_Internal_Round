import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export default function DiagnosisPage({
  studentAnswer,
  studentReasoning,
  scratchpadText,
  onNavigateStep
}) {
  const [selectedHypothesis, setSelectedHypothesis] = useState(0);

  const hypotheses = [
    {
      title: "Stop value treated as included",
      badge: "Strong evidence",
      badgeClass: "badge-purple",
      calc: "1 + 2 + 3 + 4 = 10",
      desc: "Your explanation explicitly includes 4. Your trace adds it after reaching 6."
    },
    {
      title: "Accumulator starts at the wrong value",
      badge: "Not supported",
      badgeClass: "badge-gray",
      calc: "4 + (1 + 2 + 3) = 10",
      desc: "This also gives 10, but your first running total is 1 not 5. Your work does not support this."
    },
    {
      title: "Arithmetic slip with the right sequence",
      badge: "Not supported",
      badgeClass: "badge-gray",
      calc: "1 + 2 + 3 → mistaken total 10",
      desc: "Your trace correctly reaches 6, then adds 4. That points to a boundary issue, not addition."
    }
  ];

  return (
    <div className="diagnosis-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">AI ASSISTED DIAGNOSIS · ATTEMPT 02</div>
          <h1 className="page-title">
            Your addition works. Your boundary needs a rethink.
          </h1>
          <p className="page-subtitle">
            Different misconceptions can produce 10. Your reasoning helps tell them apart.
          </p>
        </div>
        <div className="header-meta">
          <span>Demo diagnosis</span>
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
          className="step-item step-active"
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

      {/* Output Comparison Banner */}
      <div className="comparison-banner">
        <div className="comparison-values">
          <span className="comparison-tag">
            Your output: <strong>{studentAnswer || "10"}</strong>
          </span>
          <span className="comparison-arrow">→</span>
          <span className="comparison-tag">
            Actual output: <strong style={{ color: "var(--primary)" }}>6</strong>
          </span>
        </div>
        <div className="comparison-desc">
          range(1, 4) visits 1, 2 and 3. The stop value, 4, is never added to total.
        </div>
        <span className="pill-badge badge-amber">Needs a concept check</span>
      </div>

      {/* Two Column Grid */}
      <div className="grid-2col">
        {/* Left Column: Hypotheses */}
        <div>
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Which explanation fits the evidence?</h3>
              <span className="pill-badge badge-purple">3 hypotheses</span>
            </div>

            <div className="hypothesis-list">
              {hypotheses.map((item, idx) => {
                const isSelected = selectedHypothesis === idx;
                return (
                  <div
                    key={item.title}
                    className={`hypothesis-item ${isSelected ? "hypothesis-selected" : ""}`}
                    onClick={() => setSelectedHypothesis(idx)}
                  >
                    <div className="hypothesis-header">
                      <span className="hypothesis-title">{item.title}</span>
                      <span className={`pill-badge ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>
                    <div className="hypothesis-calc">{item.calc}</div>
                    <p className="hypothesis-desc">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Clarifying Card */}
          <div className="card clarify-card" style={{ marginTop: "20px" }}>
            <div className="clarify-row">
              <span className="clarify-icon">ⓘ</span>
              <div>
                <strong>A diagnosis is a hypothesis, not a verdict.</strong>
                <p>
                  If this doesn't reflect your thinking, request a clarifying question before continuing.
                </p>
                <button
                  className="btn-text"
                  onClick={() => onNavigateStep("quiz")}
                >
                  <span>That's not what I meant</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence & Relearning CTA */}
        <div>
          <div className="card evidence-card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Evidence from your response</h3>
            </div>

            <div className="evidence-section">
              <div className="evidence-field-label">YOUR EXPLANATION</div>
              <div className="evidence-quote">
                "{studentReasoning || "range(1, 4) includes 1, 2, 3 and 4. I add them to get 10."}"
              </div>
            </div>

            <div className="evidence-section">
              <div className="evidence-field-label">YOUR SCRATCHPAD</div>
              <div className="evidence-scratchpad-quote">
                {scratchpadText || "total: 1 → 3 → 6 → 10"}
              </div>
            </div>

            <p className="evidence-subnote">
              A previous response also included the stop value in range(0, 4).
            </p>

            {/* Keep what already works */}
            <div className="info-callout callout-green" style={{ margin: "14px 0" }}>
              <Check size={16} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ display: "block", marginBottom: "3px" }}>
                  Keep what already works
                </strong>
                <span>
                  Your running totals show how accumulation works. We'll focus on range boundaries, not restart the whole lesson.
                </span>
              </div>
            </div>

            {/* Next Step Box */}
            <div className="next-relearn-prompt-box">
              <div className="next-prompt-eyebrow">
                NEXT: REBUILD THE BOUNDARY MODEL
              </div>
              <div className="next-prompt-subtitle">
                Visual walkthrough · Short explanation · Code trace
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={() => onNavigateStep("relearn")}
              >
                <span>Start targeted relearning</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
