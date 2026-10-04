import React, { useState } from "react";
import { Check, Code2, ArrowRight } from "lucide-react";

export default function RelearnPage({
  relearnReflection,
  setRelearnReflection,
  onNavigateStep
}) {
  const [visualStep, setVisualStep] = useState(1); // 1: Visit values, 2: Build total, 3: Stop loop

  return (
    <div className="relearn-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">A LESSON PICKED FOR YOUR REASONING</div>
          <h1 className="page-title">The stop is a boundary, not a destination.</h1>
          <p className="page-subtitle">
            Let's rebuild your mental model of range() in three different ways.
          </p>
        </div>
        <div className="header-meta">
          <span>Targeted · Range endpoint</span>
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
          className="step-item step-active"
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

      {/* Two Column Grid */}
      <div className="grid-2col">
        {/* Left Column: 01 Visual + 03 Code */}
        <div>
          {/* Visual Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">See the boundary</h3>
              <span className="pill-badge badge-purple">01 · Visual</span>
            </div>

            {/* Three Step Tabs */}
            <div className="relearn-pill-tabs">
              {[
                { id: 1, label: "1 Visit values" },
                { id: 2, label: "2 Build the total" },
                { id: 3, label: "3 Stop the loop" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`relearn-tab-btn ${visualStep === tab.id ? "tab-selected" : ""}`}
                  onClick={() => setVisualStep(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Range Diagram */}
            <div className="range-diagram-card">
              <div className="range-diagram-header">
                <span>range(1, 4)</span>
                <span className="step-tag">Three visits, not four</span>
              </div>

              <div className="range-path-row">
                <div className="range-node">
                  <div className="range-box box-start">1</div>
                  <span className="range-node-label">included</span>
                </div>
                <span className="range-arrow">→</span>
                <div className="range-node">
                  <div className="range-box box-mid">2</div>
                  <span className="range-node-label">included</span>
                </div>
                <span className="range-arrow">→</span>
                <div className="range-node">
                  <div className="range-box box-last">3</div>
                  <span className="range-node-label">last visit</span>
                </div>
                <span className="range-arrow">→</span>
                <div className="range-node">
                  <div className="range-box box-stop">4</div>
                  <span className="range-node-label">never visited</span>
                </div>
              </div>

              <div className="range-calc-strip">
                <span>1 + 2 + 3 = 6</span>
                <span className="crossed">+ 4</span>
              </div>
            </div>

            <p className="relearn-caption-p">
              Your addition was consistent with the values you chose. The part to change is which values belong in that sequence.
            </p>
          </div>

          {/* Code Trace Card */}
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-header-row">
              <h3 className="card-title-sub">Trace it in code</h3>
              <span className="pill-badge badge-purple">03 · Code</span>
            </div>

            <div className="code-panel">
              <div className="code-header">
                <div className="code-title">
                  <Code2 size={13} />
                  <span>main.py</span>
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
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;total += n <span className="code-comment"># total: 1 → 3 → 6</span></span>
                </div>
                <div className="code-line">
                  <span className="line-num">4</span>
                  <span><span className="code-fn">print</span>(total)</span>
                </div>
              </div>
              <div className="code-output-strip">
                <span>Output → <strong>6</strong> · n never becomes 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 02 Text + Explain It Back */}
        <div>
          {/* Text Explanation Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Put it into words</h3>
              <span className="pill-badge badge-purple">02 · Text</span>
            </div>

            <p className="lesson-desc-text">
              Python includes the start value, but excludes the stop value. For a positive step, the loop continues while the current value is less than stop.
            </p>

            <div className="formula-callout-box">
              <div className="formula-math">start ≤ n &lt; stop</div>
              <div className="formula-sub">For range(1, 4), n can be 1, 2 or 3.</div>
            </div>

            <p className="boundary-tip-p">
              Want to include 4? Move the boundary to 5: <code>range(1, 5)</code>.
            </p>
          </div>

          {/* Explain it back Card */}
          <div className="card" style={{ marginTop: "20px" }}>
            <div className="card-header-row">
              <h3 className="card-title-sub">Explain it back</h3>
            </div>
            <div className="form-subtext" style={{ marginBottom: "10px" }}>
              What would you change in your original explanation?
            </div>

            <textarea
              className="textarea-input"
              rows={4}
              value={relearnReflection}
              onChange={(e) => setRelearnReflection(e.target.value)}
            />

            <div className="info-callout callout-purple" style={{ margin: "14px 0 0" }}>
              <span>ⓘ</span>
              <span>A helpful reflection. Now let's test it in a different context.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Relearning Banner */}
      <div className="relearn-bottom-banner">
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
            New context. Same concept.
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
            We'll check your explanation—not just whether you remember 6.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => onNavigateStep("recheck")}
        >
          <span>Try a fresh understanding check</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
