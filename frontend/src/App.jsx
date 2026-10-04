import React, { useState } from "react";
import "./App.css";

// Mock Data
import { initialLearner } from "./data/mockData.js";

// Components
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Pages matching Figma Screens 1 to 8
import OverviewPage from "./pages/OverviewPage.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import PracticeListPage from "./pages/PracticeListPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import DiagnosisPage from "./pages/DiagnosisPage.jsx";
import RelearnPage from "./pages/RelearnPage.jsx";
import RecheckPage from "./pages/RecheckPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import EvaluationPage from "./pages/EvaluationPage.jsx";

export default function App() {
  // Navigation State: 'overview' | 'course' | 'practice' | 'quiz' | 'diagnosis' | 'relearn' | 'recheck' | 'progress' | 'evaluation'
  const [currentPage, setCurrentPage] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Learner State
  const [learner, setLearner] = useState(initialLearner);

  // Quiz Form State
  const [studentAnswer, setStudentAnswer] = useState("10");
  const [studentReasoning, setStudentReasoning] = useState(
    "range(1, 4) includes 1, 2, 3 and 4. I add them to get 10."
  );
  const [scratchpadText, setScratchpadText] = useState(
    "n values: 1, 2, 3, 4\ntotal: 1 → 3 → 6 → 10"
  );
  const [confidence, setConfidence] = useState("Very sure");

  // Relearn Reflection State
  const [relearnReflection, setRelearnReflection] = useState(
    "4 is the stopping boundary, so the loop only adds 1, 2 and 3. I included a value that the loop never visits."
  );

  // Breadcrumbs text mapper
  const getBreadcrumbText = () => {
    switch (currentPage) {
      case "overview":
        return "Overview";
      case "course":
        return "Python foundations / Loops";
      case "practice":
        return "Practice & quizzes";
      case "quiz":
        return "Practice / Loop understanding check";
      case "diagnosis":
        return "Practice / Answer diagnosis";
      case "relearn":
        return "Relearn studio / Range boundaries";
      case "recheck":
        return "Practice / Resolution check";
      case "progress":
        return "Learning progress / Learner model";
      case "evaluation":
        return "Builder space / Model evaluation";
      default:
        return "Overview";
    }
  };

  // Flow Handlers
  const handleStartQuiz = () => {
    setCurrentPage("quiz");
  };

  const handleSubmitQuiz = () => {
    setCurrentPage("diagnosis");
  };

  const handleNavigateStep = (stepName) => {
    setCurrentPage(stepName);
  };

  const handleViewProgress = () => {
    // Update learner stats to reflect completed transfer check
    setLearner((prev) => ({
      ...prev,
      conceptsDemonstrated: 7,
      hasCompletedAttempt03: true
    }));
    setCurrentPage("progress");
  };

  return (
    <div className="app-shell">
      {/* Global Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        learner={learner}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Main View Area */}
      <main className="main-area">
        {/* Global Header */}
        <Header
          breadcrumb={getBreadcrumbText()}
          onNavigate={(page) => setCurrentPage(page)}
          onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Content Container */}
        <div className="page-content">
          {currentPage === "overview" && (
            <OverviewPage
              onNavigate={(page) => setCurrentPage(page)}
              learner={learner}
            />
          )}

          {currentPage === "course" && (
            <CoursePage
              onNavigate={(page) => setCurrentPage(page)}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {currentPage === "practice" && (
            <PracticeListPage
              onStartQuiz={handleStartQuiz}
            />
          )}

          {currentPage === "quiz" && (
            <QuizPage
              studentAnswer={studentAnswer}
              setStudentAnswer={setStudentAnswer}
              studentReasoning={studentReasoning}
              setStudentReasoning={setStudentReasoning}
              scratchpadText={scratchpadText}
              setScratchpadText={setScratchpadText}
              confidence={confidence}
              setConfidence={setConfidence}
              onSubmitQuiz={handleSubmitQuiz}
              onNavigateStep={handleNavigateStep}
            />
          )}

          {currentPage === "diagnosis" && (
            <DiagnosisPage
              studentAnswer={studentAnswer}
              studentReasoning={studentReasoning}
              scratchpadText={scratchpadText}
              onNavigateStep={handleNavigateStep}
            />
          )}

          {currentPage === "relearn" && (
            <RelearnPage
              relearnReflection={relearnReflection}
              setRelearnReflection={setRelearnReflection}
              onNavigateStep={handleNavigateStep}
            />
          )}

          {currentPage === "recheck" && (
            <RecheckPage
              onNavigateStep={handleNavigateStep}
              onViewProgress={handleViewProgress}
            />
          )}

          {currentPage === "progress" && (
            <ProgressPage
              onNavigate={(page) => setCurrentPage(page)}
              onStartNextSession={handleStartQuiz}
            />
          )}

          {currentPage === "evaluation" && (
            <EvaluationPage />
          )}

          {/* Minimal Brand Footer */}
          <Footer />
        </div>
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Help & Getting Started</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="help-modal-body">
              <h4>About Re:Learn</h4>
              <p>
                Re:Learn is an AI-assisted cognitive learning environment for introductory Python. Rather than simply marking answers right or wrong, Re:Learn diagnoses underlying mental models from your explanations and scratchpad working.
              </p>
              <h4>The 4-Step Learning Cycle</h4>
              <ol className="help-steps-list">
                <li><strong>01 Quiz:</strong> Predict program output and share your reasoning.</li>
                <li><strong>02 Diagnosis:</strong> See which cognitive misconception fits the evidence.</li>
                <li><strong>03 Relearn:</strong> Rebuild your boundary model visually, in text, and through code.</li>
                <li><strong>04 Recheck:</strong> Verify lasting understanding with a counterfactual transfer check.</li>
              </ol>
              <div style={{ marginTop: "18px", textAlign: "right" }}>
                <button
                  className="btn-primary"
                  onClick={() => setShowHelpModal(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
