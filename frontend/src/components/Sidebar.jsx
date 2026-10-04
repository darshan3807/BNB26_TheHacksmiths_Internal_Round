import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Sparkles,
  BarChart2,
  Cpu,
  Layers,
  CheckCircle,
  User,
  X
} from "lucide-react";

export default function Sidebar({
  currentPage,
  onNavigate,
  learner,
  isMobileOpen,
  setIsMobileOpen,
  onOpenHelp
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: "▦", section: "LEARNING SPACE" },
    { id: "course", label: "My course", icon: "▣", section: "LEARNING SPACE" },
    { id: "practice", label: "Practice & quizzes", icon: "☷", section: "LEARNING SPACE" },
    { id: "relearn", label: "Relearn studio", icon: "✳", section: "LEARNING SPACE" },
    { id: "progress", label: "Learning progress", icon: "⌁", section: "LEARNING SPACE" },
    { id: "evaluation", label: "Model evaluation", icon: "⚗", section: "BUILDER SPACE" }
  ];

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const progressPercent = Math.round(
    (learner.completedUnits / learner.totalUnits) * 100
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? "sidebar-mobile-open" : ""}`}>
        {/* Brand */}
        <div className="brand-row">
          <button className="brand" onClick={() => handleItemClick("overview")}>
            <span className="brand-mark">r:</span>
            <span className="brand-name">Re:Learn</span>
          </button>
          {isMobileOpen && (
            <button
              className="close-mobile-btn"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* LEARNING SPACE */}
        <div className="nav-group">
          <div className="nav-heading">LEARNING SPACE</div>
          {navItems
            .filter((item) => item.section === "LEARNING SPACE")
            .map((item) => {
              const isActive =
                currentPage === item.id ||
                (item.id === "practice" &&
                  ["practice", "quiz", "diagnosis", "recheck"].includes(
                    currentPage
                  ));

              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? "nav-active" : ""}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* BUILDER SPACE */}
        <div className="nav-group">
          <div className="nav-heading">BUILDER SPACE</div>
          {navItems
            .filter((item) => item.section === "BUILDER SPACE")
            .map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? "nav-active" : ""}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Python Foundations Progress Card */}
        <div className="sidebar-course">
          <div className="sidebar-course-title">Python foundations</div>
          <div className="sidebar-course-sub">
            {learner.completedUnits} of {learner.totalUnits} units completed
          </div>
          <div className="sidebar-progress-bar">
            <div
              className="sidebar-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            className="sidebar-link-btn"
            onClick={() => handleItemClick("course")}
          >
            <span>View learning path</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Bottom Area */}
        <div className="sidebar-bottom">
          <button
            className="sidebar-help-btn"
            onClick={() => onOpenHelp && onOpenHelp()}
          >
            <HelpCircle size={14} />
            <span>Help & getting started</span>
          </button>

          <div className="profile-container">
            <button
              className="profile-card"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
            >
              <div className="profile-user-left">
                <div className="avatar">{learner.avatar}</div>
                <div className="profile-info">
                  <strong>{learner.name}</strong>
                  <small>{learner.role}</small>
                </div>
              </div>
              <ChevronRight
                size={14}
                className={`profile-arrow ${showProfileMenu ? "arrow-rotate" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <strong>{learner.name}</strong>
                  <small>maya.chen@learn.edu</small>
                </div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleItemClick("progress");
                    setShowProfileMenu(false);
                  }}
                >
                  <span>My learning record</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleItemClick("overview");
                    setShowProfileMenu(false);
                  }}
                >
                  <span>Workspace settings</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item text-muted-item"
                  onClick={() => {
                    alert("Demo session: Maya Chen is currently signed in.");
                    setShowProfileMenu(false);
                  }}
                >
                  <span>Switch account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
