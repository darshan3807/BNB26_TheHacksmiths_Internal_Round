import React from "react";
import {
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  Check,
  ChevronRight,
  Code2
} from "lucide-react";
import {
  continueLearningCardData,
  goodNextStepData,
  pythonLearningPath,
  recentLearningItems
} from "../data/mockData.js";

export default function OverviewPage({ onNavigate, learner }) {
  return (
    <div className="overview-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">YOUR LEARNING STUDIO</div>
          <h1 className="page-title">Welcome back, {learner.name.split(" ")[0]}.</h1>
          <p className="page-subtitle">
            Small steps, deeper understanding. Let's pick up where you left off.
          </p>
        </div>
        <div className="header-meta">
          <span>Demo journey · Before quiz</span>
        </div>
      </div>

      {/* Top 3 Statistics Cards */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-top">
            <span>Your learning path</span>
            <span className="stat-icon-wrap">
              <BookOpen size={16} />
            </span>
          </div>
          <div className="stat-num">
            {learner.completedUnits} / {learner.totalUnits}
          </div>
          <div className="stat-desc">Units completed</div>
        </div>

        <div className="stat-box">
          <div className="stat-top">
            <span>Understanding, not just scores</span>
            <span className="stat-icon-wrap">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="stat-num">
            {learner.conceptsDemonstrated} / {learner.totalConcepts}
          </div>
          <div className="stat-desc">Concepts demonstrated so far</div>
        </div>

        <div className="stat-box">
          <div className="stat-top">
            <span>A little progress every day</span>
            <span className="stat-icon-wrap">
              <Clock size={16} />
            </span>
          </div>
          <div className="stat-num">{learner.learningMinutesThisWeek} min</div>
          <div className="stat-desc">Learning time this week</div>
        </div>
      </div>

      {/* Two Column Section 1: Continue Learning + A Good Next Step */}
      <div className="grid-2col overview-main-grid">
        {/* Continue Learning Card */}
        <div className="card continue-card">
          <div className="card-header-row">
            <span className="eyebrow" style={{ color: "var(--primary)" }}>
              CONTINUE LEARNING
            </span>
            <span className="meta-light-pill">
              {continueLearningCardData.unitLabel}
            </span>
          </div>

          <h2 className="continue-title">{continueLearningCardData.title}</h2>
          <p className="continue-desc">{continueLearningCardData.description}</p>

          <div className="continue-meta-row">
            <span>◷ {continueLearningCardData.duration}</span>
            <span>·</span>
            <span>{continueLearningCardData.format}</span>
          </div>

          {/* Interactive Range Visual */}
          <div className="overview-range-card">
            <div className="overview-range-header">
              <code>{continueLearningCardData.rangeSnippet}</code>
            </div>

            <div className="overview-range-nodes">
              {continueLearningCardData.values.map((v) => (
                <div
                  key={v.num}
                  className={`overview-range-box ${v.excluded ? "box-excluded" : "box-included"}`}
                >
                  <span className="box-val">{v.num}</span>
                  <span className="box-lbl">{v.label}</span>
                </div>
              ))}
            </div>

            <div className="overview-range-caption">
              {continueLearningCardData.caption}
            </div>
          </div>

          <div className="continue-footer-row">
            <button
              className="btn-primary"
              onClick={() => onNavigate("course")}
            >
              <span>Continue to lesson</span>
              <ArrowRight size={14} />
            </button>
            <span className="continue-footer-note">
              {continueLearningCardData.footerNotice}
            </span>
          </div>
        </div>

        {/* A Good Next Step Card */}
        <div className="card next-step-card">
          <div className="card-header-row">
            <h3 className="card-title-sub">{goodNextStepData.title}</h3>
          </div>

          <div className="recommendation-badge-row">
            <span className="rec-icon">◎</span>
            <strong className="rec-title">{goodNextStepData.recommendation}</strong>
          </div>

          <p className="next-step-desc">{goodNextStepData.description}</p>

          <div className="snippet-box">
            <code>{goodNextStepData.snippet}</code>
            <div className="snippet-expected">{goodNextStepData.expected}</div>
          </div>

          <div className="next-step-footer">
            <p className="footer-philosophy">{goodNextStepData.footerNote}</p>
          </div>
        </div>
      </div>

      {/* Two Column Section 2: Learning Path + Recent Learning */}
      <div className="grid-2col overview-secondary-grid" style={{ marginTop: "24px" }}>
        {/* Your Python Learning Path Card */}
        <div className="card learning-path-card">
          <div className="card-header-row">
            <h3 className="card-title-sub">Your Python learning path</h3>
            <button
              className="btn-text"
              onClick={() => onNavigate("course")}
            >
              <span>View course</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="path-units-row">
            {pythonLearningPath.map((u) => (
              <div
                key={u.id}
                className={`path-unit-box ${u.isInProgress ? "unit-in-progress" : ""}`}
                onClick={() => onNavigate("course")}
              >
                <div className="unit-header-line">
                  <strong>{u.title}</strong>
                  {u.isCompleted && (
                    <span className="unit-check-circle">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  {u.isInProgress && (
                    <span className="unit-progress-tag">In progress</span>
                  )}
                </div>
                <p className="unit-subtitle">{u.subtitle}</p>
                <span className="unit-status-text">{u.status}</span>
              </div>
            ))}
          </div>

          <div className="up-next-strip">
            <span className="up-next-label">UP NEXT</span>
            <span className="up-next-items">
              Lists & indexing → Functions → Build a small project
            </span>
          </div>
        </div>

        {/* Recent Learning Card */}
        <div className="card recent-learning-card">
          <div className="card-header-row">
            <h3 className="card-title-sub">Recent learning</h3>
            <span className="meta-light-pill">This week</span>
          </div>

          <div className="recent-list">
            {recentLearningItems.map((item, idx) => (
              <div key={idx} className="recent-item">
                <span className={`recent-bullet ${item.type === "completed" ? "bullet-green" : "bullet-purple"}`}>
                  {item.type === "completed" ? "✓" : "◎"}
                </span>
                <div className="recent-text">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="recent-card-footer">
            <button
              className="btn-text"
              onClick={() => onNavigate("progress")}
            >
              <span>Explore your learner model</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
