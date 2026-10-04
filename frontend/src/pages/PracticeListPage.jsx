import React from "react";
import { ArrowRight, BookOpen, Clock, Check, Sparkles } from "lucide-react";
import { practiceCatalogData } from "../data/mockData.js";

export default function PracticeListPage({ onStartQuiz }) {
  return (
    <div className="practice-catalog-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="eyebrow">PRACTICE & QUIZZES</div>
          <h1 className="page-title">Test your mental models.</h1>
          <p className="page-subtitle">
            Diagnostic quizzes designed to identify reasoning patterns—not just score answers.
          </p>
        </div>
        <div className="header-meta">
          <span>Active Journey · Python Foundations</span>
        </div>
      </div>

      {/* Grid of Practice Cards */}
      <div className="practice-cards-grid">
        {practiceCatalogData.map((item) => (
          <div
            key={item.id}
            className={`card practice-topic-card ${item.id === "loops" ? "topic-highlighted" : ""}`}
          >
            <div className="card-header-row">
              <span className="meta-light-pill">{item.unit}</span>
              <span
                className={`pill-badge ${
                  item.status === "Current focus"
                    ? "badge-purple"
                    : item.status === "Mastered"
                    ? "badge-green"
                    : "badge-gray"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="topic-card-title">{item.title}</h3>

            <div className="topic-snippet-preview">
              <code>{item.snippet}</code>
            </div>

            <div className="topic-stats-row">
              <span>{item.questionCount} questions</span>
              <span>·</span>
              <span>{item.difficulty}</span>
              {item.revisitCount > 0 && (
                <>
                  <span>·</span>
                  <span style={{ color: "var(--amber)", fontWeight: "600" }}>
                    {item.revisitCount} to revisit
                  </span>
                </>
              )}
            </div>

            <div className="topic-card-footer">
              <button
                className={`btn-${item.id === "loops" ? "primary" : "secondary"}`}
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => onStartQuiz(item.id)}
              >
                <span>{item.id === "loops" ? "Start practice check" : "Practice topic"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
