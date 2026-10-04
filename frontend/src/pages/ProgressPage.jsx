import React from "react";
import { Download, Check, Clock, ArrowRight, RotateCw } from "lucide-react";

export default function ProgressPage({ onNavigate, onStartNextSession }) {
  const learnerModelRows = [
    {
      concept: "Variable assignment",
      status: "Demonstrated",
      badgeClass: "badge-green",
      evidence: "Explained names and values · 1 Oct",
      nextStep: "Continue practicing"
    },
    {
      concept: "Conditional logic",
      status: "Demonstrated",
      badgeClass: "badge-green",
      evidence: "Correct branch + explanation · 2 Oct",
      nextStep: "Use in future lessons"
    },
    {
      concept: "Accumulation",
      status: "Demonstrated",
      badgeClass: "badge-green",
      evidence: "Consistent running totals · Attempts 02-03",
      nextStep: "Keep this strategy"
    },
    {
      concept: "Range endpoints",
      status: "Provisional transfer",
      badgeClass: "badge-purple",
      evidence: "2 earlier errors → 1 explained transfer",
      nextStep: "Delayed check"
    },
    {
      concept: "List indexing",
      status: "Not yet checked",
      badgeClass: "badge-gray",
      evidence: "No assessment evidence collected",
      nextStep: "Upcoming unit 04"
    }
  ];

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">YOUR UNDERSTANDING, OVER TIME</div>
          <h1 className="page-title">Progress is more than a correct answer.</h1>
          <p className="page-subtitle">
            See the concepts you've demonstrated, the patterns we've noticed, and the evidence behind each.
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => alert("Summary report downloaded.")}
        >
          <Download size={13} />
          <span>Export learning summary</span>
        </button>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-top">
            <span>Concepts demonstrated</span>
            <span>✳</span>
          </div>
          <div className="stat-num">7 / 12</div>
          <div className="stat-desc">Includes 1 provisional transfer check</div>
        </div>

        <div className="stat-box">
          <div className="stat-top">
            <span>Recurring pattern tracked</span>
            <span>◎</span>
          </div>
          <div className="stat-num">1</div>
          <div className="stat-desc">Range endpoint · 2 earlier attempts</div>
        </div>

        <div className="stat-box">
          <div className="stat-top">
            <span>Retention check planned</span>
            <span>▦</span>
          </div>
          <div className="stat-num">1</div>
          <div className="stat-desc">Next session · Not checked yet</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid-2col">
        {/* Left Column: Recurring Pattern Timeline */}
        <div className="card timeline-card">
          <div className="card-header-row">
            <h3 className="card-title-sub">A recurring pattern, with new evidence</h3>
            <span className="pill-badge badge-purple">Range endpoint</span>
          </div>

          <div className="timeline-events-list">
            {/* Event 1 */}
            <div className="timeline-event">
              <div className="timeline-icon icon-amber">↻</div>
              <div className="timeline-body">
                <div className="timeline-header">
                  <span className="timeline-title">Initial check</span>
                  <span className="pill-badge badge-amber">Boundary confusion</span>
                </div>
                <div className="timeline-time">Attempt 01 · Today, 09:12</div>
                <div className="timeline-detail">
                  <code>list(range(0, 4))</code>
                  <p>Expected [0, 1, 2, 3, 4]; included the stop value.</p>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="timeline-event">
              <div className="timeline-icon icon-amber">↻</div>
              <div className="timeline-body">
                <div className="timeline-header">
                  <span className="timeline-title">Pattern repeated</span>
                  <span className="pill-badge badge-amber">Recurring pattern</span>
                </div>
                <div className="timeline-time">Attempt 02 · Today, 09:24</div>
                <div className="timeline-detail">
                  <span>sum of <code>range(1, 4)</code></span>
                  <p>Answered 10; explanation explicitly added 4.</p>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="timeline-event">
              <div className="timeline-icon icon-green">✓</div>
              <div className="timeline-body">
                <div className="timeline-header">
                  <span className="timeline-title">Transfer demonstrated</span>
                  <span className="pill-badge badge-green">Provisional understanding</span>
                </div>
                <div className="timeline-time">Attempt 03 · Today, 09:32</div>
                <div className="timeline-detail">
                  <span>sum of <code>range(2, 6)</code></span>
                  <p>Answered 14; excluded 6 and explained the change to stop = 7.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-footer-note">
            Between attempts 02 and 03: visual boundary lesson, code trace and teach-back.
          </div>
        </div>

        {/* Right Column: Concept Coverage & What Happens Next */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Concept Coverage Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">Concept coverage</h3>
            </div>

            <div className="coverage-segments">
              {[...Array(7)].map((_, i) => (
                <div key={`d-${i}`} className="coverage-seg seg-done" />
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={`dev-${i}`} className="coverage-seg seg-dev" />
              ))}
              {[...Array(2)].map((_, i) => (
                <div key={`w-${i}`} className="coverage-seg" />
              ))}
            </div>

            <div className="coverage-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "var(--primary)" }} />
                <span>Demonstrated</span>
                <strong>7</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#baa2fb" }} />
                <span>Developing</span>
                <strong>3</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#eaebf2" }} />
                <span>Not yet checked</span>
                <strong>2</strong>
              </div>
            </div>
          </div>

          {/* What happens next? Card */}
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title-sub">What happens next?</h3>
            </div>
            <p className="lesson-desc-text" style={{ marginBottom: "16px" }}>
              Try a delayed range check next session. Until then, this concept stays provisional even though you answered the transfer question correctly.
            </p>
            <button
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={onStartNextSession}
            >
              <span>Preview next session</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: Your Learner Model */}
      <div className="card data-table-card" style={{ marginTop: "24px" }}>
        <div className="card-header-row">
          <h3 className="card-title-sub">Your learner model</h3>
          <span className="meta-light-pill">Selected concepts · Updated after attempt 03</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Concept</th>
              <th>Current understanding</th>
              <th>Evidence</th>
              <th>Next step</th>
            </tr>
          </thead>
          <tbody>
            {learnerModelRows.map((row) => (
              <tr key={row.concept}>
                <td>
                  <strong>{row.concept}</strong>
                </td>
                <td>
                  <span className={`pill-badge ${row.badgeClass}`}>
                    {row.status}
                  </span>
                </td>
                <td className="cell-muted">{row.evidence}</td>
                <td>
                  <span
                    style={{
                      fontSize: "12px",
                      color: row.status === "Provisional transfer" ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: row.status === "Provisional transfer" ? "600" : "400"
                    }}
                  >
                    {row.nextStep}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
