import React, { useState } from "react";
import {
  Code2,
  Check,
  AlertCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  RotateCw
} from "lucide-react";
import { evaluationDataset, unseenTestCases } from "../data/mockData.js";

export default function EvaluationPage() {
  const [selectedResponseId, setSelectedResponseId] = useState("RL-018");
  const [activeFilter, setActiveFilter] = useState("All responses");
  const [selectedLabel, setSelectedLabel] = useState("Range endpoint");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [confirmedStatus, setConfirmedStatus] = useState(false);

  const selectedResponse =
    evaluationDataset.find((r) => r.id === selectedResponseId) ||
    evaluationDataset[0];

  const handleConfirmLabel = () => {
    setConfirmedStatus(true);
    setTimeout(() => setConfirmedStatus(false), 2500);
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      alert("Unseen evaluation batch completed: 35/40 matches (87.5% accuracy).");
    }, 800);
  };

  return (
    <div className="evaluation-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">BUILDER SPACE · INTRODUCTORY PYTHON</div>
          <h1 className="page-title">
            Evaluate the diagnosis, not just the answer.
          </h1>
          <p className="page-subtitle">
            Label learner reasoning, separate look-alike mistakes, and test generalization on unseen responses.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleRunEvaluation}
          disabled={isEvaluating}
        >
          <span>{isEvaluating ? "Evaluating batch..." : "Run unseen evaluation"}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Illustrative Banner */}
      <div className="illustrative-notice-banner">
        <span>
          Hackathon demo · Synthetic dataset and illustrative metrics. No live training run or measured model performance.
        </span>
        <span className="illustrative-badge">ILLUSTRATIVE</span>
      </div>

      {/* Dataset Overview Split Bar Card */}
      <div className="card model-split-card" style={{ marginTop: "16px" }}>
        <div className="split-card-header">
          <div>
            <strong>python-reasoning-demo · v0.3</strong>
            <span className="split-subtext">240 labeled responses · 196 reviewed</span>
          </div>
          <span className="split-prompt-tag">Split by learner + prompt</span>
        </div>

        <div className="split-badges-row">
          <div className="split-badge-item split-train">
            <strong>160 Train</strong>
            <span>Fit misconception model</span>
          </div>
          <div className="split-badge-item split-val">
            <strong>40 Validation</strong>
            <span>Tune & calibrate</span>
          </div>
          <div className="split-badge-item split-test">
            <strong>40 Unseen test</strong>
            <span>Held out from training</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Dataset & Label Review */}
      <div className="card review-card" style={{ marginTop: "20px" }}>
        <div className="card-header-row">
          <h3 className="card-title-sub">Dataset & label review</h3>
          <span className="meta-light-pill">196 / 240 reviewed · Import CSV ↑</span>
        </div>

        {/* Filter Pills */}
        <div className="review-filters-bar">
          {["All responses", "Incorrect", "Correct", "Needs review · 44"].map((filter) => (
            <button
              key={filter}
              className={`filter-pill-btn ${activeFilter === filter ? "filter-active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="review-split-grid">
          {/* Left Column: Code context & Table */}
          <div className="review-table-side">
            <div className="code-panel" style={{ margin: "0 0 14px 0" }}>
              <div className="code-content" style={{ padding: "12px 16px", fontSize: "11.5px" }}>
                <div>total = 0</div>
                <div>for n in range(1, 4):</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;total += n</div>
                <div>print(total)</div>
              </div>
              <div className="code-output-strip">
                <span>Expected output: <strong>6</strong></span>
              </div>
            </div>

            <div className="disambiguate-notice">
              Same output ≠ same misconception. A correct answer with no explanation can still have insufficient evidence.
            </div>

            <table className="custom-table" style={{ marginTop: "12px" }}>
              <thead>
                <tr>
                  <th>Response</th>
                  <th>Output</th>
                  <th>Reasoning evidence</th>
                  <th>Human label</th>
                </tr>
              </thead>
              <tbody>
                {evaluationDataset.map((row) => (
                  <tr
                    key={row.id}
                    className={`interactive-row ${selectedResponseId === row.id ? "row-selected" : ""}`}
                    onClick={() => {
                      setSelectedResponseId(row.id);
                      setSelectedLabel(row.label);
                    }}
                  >
                    <td>
                      <code style={{ fontWeight: "600" }}>{row.id}</code>
                    </td>
                    <td>
                      <span className={row.output === "6" ? "text-green" : "text-amber"}>
                        {row.output}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>{row.reasoning}</td>
                    <td>
                      <span className={`pill-badge badge-${row.badgeType}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column: Label Inspector */}
          <div className="inspector-side">
            <div className="inspector-box">
              <div className="inspector-header">
                <strong>Label inspector</strong>
                <span>{selectedResponse.id} · {selectedResponse.split}</span>
              </div>

              <div className="inspector-evidence-box">
                <span className="inspector-evidence-label">EVIDENCE</span>
                <p>"{selectedResponse.reasoning}"</p>
              </div>

              {/* Label Options */}
              <div className="label-radio-list">
                {[
                  "Range endpoint",
                  "Accumulator initialization",
                  "Arithmetic error",
                  "No misconception evidenced",
                  "Insufficient evidence"
                ].map((option) => (
                  <label
                    key={option}
                    className={`label-radio-item ${selectedLabel === option ? "radio-checked" : ""}`}
                    onClick={() => setSelectedLabel(option)}
                  >
                    <input
                      type="radio"
                      name="humanLabel"
                      checked={selectedLabel === option}
                      onChange={() => setSelectedLabel(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <div className="rationale-box">
                <span className="field-sub-header">REVIEWER RATIONALE</span>
                <p>
                  Includes stop explicitly; addition is consistent. Excludes an initialization error.
                </p>
              </div>

              <div className="inspector-actions-row">
                <button
                  className="btn-secondary"
                  onClick={() => alert("Flagged as ambiguous for team review.")}
                >
                  Flag ambiguous
                </button>
                <button
                  className="btn-primary"
                  onClick={handleConfirmLabel}
                >
                  <Check size={13} />
                  <span>{confirmedStatus ? "Label Confirmed!" : "Confirm label"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Unseen Response Evaluation */}
      <div className="card metrics-eval-card" style={{ marginTop: "24px" }}>
        <div className="card-header-row">
          <h3 className="card-title-sub">Unseen response evaluation</h3>
          <span className="meta-light-pill">Run demo-003 · 40 held out responses</span>
        </div>

        {/* 4 Metric Columns */}
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-lbl">Macro F1</span>
            <div className="metric-val">0.84</div>
            <span className="metric-sub">Across misconception labels</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Label accuracy</span>
            <div className="metric-val">87.5%</div>
            <span className="metric-sub">35 / 40 match human labels</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Abstention rate</span>
            <div className="metric-val">7.5%</div>
            <span className="metric-sub">3 / 40 need more evidence</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Most confused pair</span>
            <div className="metric-val" style={{ color: "var(--amber)" }}>2 cases</div>
            <span className="metric-sub">Endpoint ↔ initialization</span>
          </div>
        </div>

        {/* Held Out Results Table */}
        <div style={{ marginTop: "20px" }}>
          <div className="card-header-row">
            <h4 style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>
              Illustrative results
            </h4>
            <button className="btn-text">
              <span>View error analysis</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <table className="custom-table" style={{ marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Held out record</th>
                <th>Unseen reasoning</th>
                <th>Human label</th>
                <th>Model prediction</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {unseenTestCases.map((tc) => (
                <tr key={tc.id}>
                  <td><code>{tc.id}</code></td>
                  <td>"{tc.unseenReasoning}"</td>
                  <td><span className="pill-badge badge-gray">{tc.humanLabel}</span></td>
                  <td><span className="pill-badge badge-purple">{tc.modelPrediction}</span></td>
                  <td>
                    <span
                      className={`pill-badge ${
                        tc.isMatch === true
                          ? "badge-green"
                          : tc.isMatch === false
                          ? "badge-amber"
                          : "badge-gray"
                      }`}
                    >
                      {tc.review}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
