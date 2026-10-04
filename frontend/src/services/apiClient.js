// Unified Dual-Mode API Client for Re:Learn
// Transparently switches between the Python/MySQL backend and in-browser SQLite

import { sqliteStorage } from "../db/sqliteStorage.js";
import { analyzeAnswer as clientAnalyzeAnswer } from "./diagnosisService.js";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const apiClient = {
  isBackendConnected: false,

  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { method: "GET", signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        this.isBackendConnected = true;
        return { online: true, info: data };
      }
    } catch {
      // Backend not running
    }
    this.isBackendConnected = false;
    return { online: false, info: { database: "In-Browser SQLite", ml_model: "Client Engine" } };
  },

  async diagnose(topicId, studentAnswer, studentReasoning) {
    if (this.isBackendConnected) {
      try {
        const res = await fetch(`${BACKEND_URL}/diagnose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_answer: studentAnswer, student_reasoning: studentReasoning }),
          signal: AbortSignal.timeout(3000)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fallback below
      }
    }
    // Instant client-side fallback
    return clientAnalyzeAnswer(topicId, studentAnswer, studentReasoning);
  },

  async saveAttempt(attemptData) {
    if (this.isBackendConnected) {
      try {
        const res = await fetch(`${BACKEND_URL}/attempts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attemptData),
          signal: AbortSignal.timeout(3000)
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback below
      }
    }
    return sqliteStorage.addAttempt(attemptData);
  }
};
