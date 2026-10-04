import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, X, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

export default function Header({
  breadcrumb,
  onNavigate,
  onToggleMobile
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchContainerRef = useRef(null);

  const searchableItems = [
    { title: "Loops & the range() function", subtitle: "Unit 03 · Lesson 03", page: "course", tag: "Lesson" },
    { title: "What will this loop print?", subtitle: "Understanding check · Quiz", page: "quiz", tag: "Quiz" },
    { title: "Range boundary check", subtitle: "Targeted relearning · Range endpoint", page: "relearn", tag: "Relearn" },
    { title: "Progress & learner model", subtitle: "Competencies & retention tracking", page: "progress", tag: "Progress" },
    { title: "Practice & quizzes catalog", subtitle: "Variables, Conditionals, Loops", page: "practice", tag: "Practice" },
    { title: "Model evaluation & test cases", subtitle: "Builder space · Accuracy metrics", page: "evaluation", tag: "Builder" }
  ];

  const filteredResults = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (page) => {
    onNavigate(page);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-trigger"
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <span className="crumb-root">Workspace</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">{breadcrumb}</span>
        </nav>
      </div>

      <div className="top-actions">
        {/* Search Input with dropdown */}
        <div className="search-container" ref={searchContainerRef}>
          <div className="search-bar" onClick={() => setIsSearchOpen(true)}>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search your learning space"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            <kbd className="search-kbd">⌘ K</kbd>
          </div>

          {isSearchOpen && (
            <div className="search-results-dropdown">
              <div className="search-dropdown-header">
                {searchQuery ? `Matching "${searchQuery}"` : "Quick Navigation"}
              </div>
              {filteredResults.length > 0 ? (
                filteredResults.map((res, i) => (
                  <button
                    key={i}
                    className="search-result-item"
                    onClick={() => handleSelectResult(res.page)}
                  >
                    <div className="search-result-text">
                      <span className="result-title">{res.title}</span>
                      <span className="result-subtitle">{res.subtitle}</span>
                    </div>
                    <span className="result-tag">{res.tag}</span>
                  </button>
                ))
              ) : (
                <div className="no-search-results">
                  No matching lessons or checks found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Workspace Tag */}
        <div className="workspace-badge">DEMO WORKSPACE</div>

        {/* Notifications */}
        <div className="notifications-container">
          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <strong>Activity & Insights</strong>
                <span className="pill-badge badge-purple">1 new</span>
              </div>
              <div className="notification-item">
                <span className="notif-icon">✳</span>
                <div>
                  <strong>Range boundary diagnosed</strong>
                  <p>Attempt 02 identified stop-value inclusion. Targeted relearning prepared.</p>
                  <small>Today, 09:24</small>
                </div>
              </div>
              <div className="notification-item">
                <span className="notif-icon">✓</span>
                <div>
                  <strong>Conditional logic demonstrated</strong>
                  <p>Mastery confirmed across two consecutive checks.</p>
                  <small>Yesterday</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
