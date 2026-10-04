import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { courseOutline } from "../data/mockData.js";

export default function CoursePage({ onNavigate, onStartQuiz }) {
  const [activeTab, setActiveTab] = useState("Visual walkthrough");
  const [expandedUnit, setExpandedUnit] = useState("u03");
  const [activeLessonId, setActiveLessonId] = useState("l03");

  return (
    <div className="course-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">PYTHON FOUNDATIONS · UNIT 03</div>
          <h1 className="page-title">Loops: one step at a time.</h1>
          <p className="page-subtitle">
            Make repetition predictable by understanding the values your loop visits.
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => onNavigate("overview")}
        >
          <span>Course overview</span>
          <span>☰</span>
        </button>
      </div>

      <div className="course-grid">
        {/* Left Column: Course Content Outline */}
        <div className="course-sidebar-card card">
          <div className="card-header-row">
            <h3 className="card-title-sub">Course content</h3>
          </div>
          <p className="course-meta-p">2 of 6 units completed · Self paced</p>

          <div className="course-units-list">
            {courseOutline.map((unit) => {
              if (unit.lessons) {
                return (
                  <div key={unit.id} className="unit-accordion-group">
                    <div
                      className="course-unit-item unit-active-header"
                      onClick={() =>
                        setExpandedUnit(expandedUnit === unit.id ? null : unit.id)
                      }
                    >
                      <span>
                        {unit.num} &nbsp;{unit.title}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`accordion-arrow ${
                          expandedUnit === unit.id ? "rotate-open" : ""
                        }`}
                      />
                    </div>

                    {expandedUnit === unit.id && (
                      <div className="lesson-sublist">
                        {unit.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`lesson-subitem ${
                              lesson.id === activeLessonId
                                ? "lesson-selected"
                                : ""
                            }`}
                            onClick={() => {
                              setActiveLessonId(lesson.id);
                              if (lesson.id === "l04") {
                                onStartQuiz();
                              }
                            }}
                          >
                            <div className="lesson-left">
                              <span className="lesson-status-icon">
                                {lesson.status === "Complete" ? "✓" : lesson.active ? "◉" : "○"}
                              </span>
                              <span>{lesson.title}</span>
                            </div>
                            <span className="lesson-duration">
                              {lesson.duration} · {lesson.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={unit.id} className="course-unit-item">
                  <span>
                    {unit.num} &nbsp;{unit.title}
                  </span>
                  {unit.completed ? (
                    <span className="unit-check-green">✓</span>
                  ) : (
                    <span className="unit-bullet-muted">○</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pace-card">
            <strong>Go at your own pace</strong>
            <p>
              Switch formats anytime. Your understanding matters more than your
              speed.
            </p>
          </div>
        </div>

        {/* Right Column: Active Lesson View */}
        <div className="course-main-content">
          {/* Main Lesson Card */}
          <div className="card lesson-view-card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Understanding range()</h3>
              <span className="pill-badge badge-purple">Lesson 03 / 04</span>
            </div>

            {/* Tabs */}
            <div className="tab-bar">
              {["Visual walkthrough", "Read explanation", "Code example"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab 1: Visual Walkthrough */}
            {activeTab === "Visual walkthrough" && (
              <div className="tab-content-pane">
                <p className="lesson-desc-text">
                  Think of range(start, stop) as a path: begin at start, visit
                  each whole number, and stop just before stop.
                </p>

                {/* Range Path Diagram */}
                <div className="range-diagram-card">
                  <div className="range-diagram-header">
                    <span>range(1, 4)</span>
                    <span className="step-tag">Default step: +1</span>
                  </div>

                  <div className="range-path-row">
                    <div className="range-node">
                      <div className="range-box box-start">1</div>
                      <span className="range-node-label">start · included</span>
                    </div>
                    <span className="range-arrow">→</span>
                    <div className="range-node">
                      <div className="range-box box-mid">2</div>
                      <span className="range-node-label">next value</span>
                    </div>
                    <span className="range-arrow">→</span>
                    <div className="range-node">
                      <div className="range-box box-mid">3</div>
                      <span className="range-node-label">last value</span>
                    </div>
                    <span className="range-arrow">→</span>
                    <div className="range-node">
                      <div className="range-box box-stop">4</div>
                      <span className="range-node-label">stop · excluded</span>
                    </div>
                  </div>

                  <div className="range-diagram-footer-note">
                    The stop value marks a boundary, not a value to visit.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Read Explanation */}
            {activeTab === "Read explanation" && (
              <div className="tab-content-pane">
                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                  The exclusive stop boundary
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                  In Python, <code>range(start, stop)</code> begins counting at <code>start</code> and produces integers as long as <code>current &lt; stop</code>.
                  Because the condition is strictly less than, the stop argument itself is never returned.
                </p>
                <div className="formula-callout" style={{ margin: "14px 0" }}>
                  <code>start ≤ value &lt; stop</code>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  If you want to count up to 4, you must specify <code>range(1, 5)</code>.
                </p>
              </div>
            )}

            {/* Tab 3: Code Example */}
            {activeTab === "Code example" && (
              <div className="tab-content-pane">
                <div className="code-panel">
                  <div className="code-header">
                    <div className="code-title">
                      <Code2 size={13} />
                      <span>example.py</span>
                    </div>
                    <span>Python 3</span>
                  </div>
                  <div className="code-content">
                    <div className="code-line"><span className="line-num">1</span><span>for val in range(1, 4):</span></div>
                    <div className="code-line"><span className="line-num">2</span><span>    print(val)</span></div>
                  </div>
                  <div className="code-output-strip">
                    <span>Output → 1 2 3</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Cards Row: Code + Trace Table */}
          <div className="grid-2col" style={{ marginTop: "20px" }}>
            {/* Code Snippet Card */}
            <div className="code-panel" style={{ margin: 0 }}>
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
                  <span><span className="code-kw">for</span> number <span className="code-kw">in</span> <span className="code-fn">range</span>(<span className="code-num">1</span>, <span className="code-num">4</span>):</span>
                </div>
                <div className="code-line">
                  <span className="line-num">2</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-fn">print</span>(number)</span>
                </div>
              </div>
              <div className="code-output-strip">
                <span>Output → <strong>1 &nbsp;2 &nbsp;3</strong></span>
              </div>
              <div className="code-footer-tip">
                Read the sequence first. Then trace one loop iteration at a time.
              </div>
            </div>

            {/* Trace Table Card */}
            <div className="card trace-loop-card">
              <div className="card-header-row">
                <h3 className="card-title-sub">Trace the loop</h3>
                <span className="meta-light-pill">3 iterations</span>
              </div>

              <div className="trace-rows-list">
                <div className="trace-row">
                  <span className="trace-step-lbl">First visit</span>
                  <code className="trace-var-val">number = 1</code>
                </div>
                <div className="trace-row">
                  <span className="trace-step-lbl">Second visit</span>
                  <code className="trace-var-val">number = 2</code>
                </div>
                <div className="trace-row">
                  <span className="trace-step-lbl">Third visit</span>
                  <code className="trace-var-val">number = 3</code>
                </div>
              </div>

              <div className="trace-callout-text">
                4 is never assigned to number.
              </div>
            </div>
          </div>

          {/* Bottom Check Banner */}
          <div className="card check-prompt-card" style={{ marginTop: "20px" }}>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
                Ready to explain it yourself?
              </h4>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
                Try a short check. We'll learn from your reasoning.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={onStartQuiz}
            >
              <span>Start understanding check</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
