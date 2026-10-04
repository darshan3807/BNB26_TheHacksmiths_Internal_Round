// Re:Learn Dynamic Cognitive Misconception Diagnosis Engine

export const TOPICS = {
  loops: {
    id: "loops",
    title: "Unit 03: Loops & range() boundary",
    code: "total = 0\nfor n in range(1, 4):\n    total = total + n\n\nprint(total)",
    expectedAnswer: "6",
    actualOutput: "6",
    codeFileName: "loop_check.py",
    scratchpadDefault: "n values: 1, 2, 3, 4\ntotal:    1 → 3 → 6 → 10",
    hints: "Trace the values of n and total. range(1, 4) starts at 1 and stops before 4.",
    practiceQuestion: "What values does list(range(2, 5)) produce?",
    practiceHint: "range(start, stop) includes the start value but stops before the stop value."
  },
  variables: {
    id: "variables",
    title: "Unit 01: Variable Reassignment",
    code: "x = 5\nx = x + 2\n\nprint(x)",
    expectedAnswer: "7",
    actualOutput: "7",
    codeFileName: "var_check.py",
    scratchpadDefault: "line 1: x is 5\nline 2: x becomes 5 + 2 = 7",
    hints: "Variables hold values that can be updated. x + 2 calculates a new value that replaces 5.",
    practiceQuestion: "If a = 10 and then a = a - 3, what is printed?",
    practiceHint: "The second assignment computes a new value for a and replaces 10 with 7."
  },
  operators: {
    id: "operators",
    title: "Unit 02: Operator Precedence",
    code: "total = 3 + 2 * 4\n\nprint(total)",
    expectedAnswer: "11",
    actualOutput: "11",
    codeFileName: "precedence.py",
    scratchpadDefault: "3 + 2 = 5\n5 * 4 = 20 ?? or 2 * 4 = 8 then + 3 = 11",
    hints: "Multiplication has higher priority than addition. Evaluate 2 * 4 first.",
    practiceQuestion: "What does print(5 + 3 * 2) display?",
    practiceHint: "Evaluate 3 * 2 first, then add 5."
  }
};

export function analyzeAnswer(topicId, answerStr, reasoningStr) {
  const ans = (answerStr || "").trim();
  const rsn = (reasoningStr || "").toLowerCase();

  if (topicId === "loops") {
    // Check if student added 4 (10)
    if (ans === "10" || rsn.includes("includes 4") || rsn.includes("1, 2, 3 and 4") || rsn.includes("1+2+3+4")) {
      return {
        label: "loop_range",
        title: "Your addition works. Your boundary needs a rethink.",
        subtitle: "Different misconceptions can produce 10. Your reasoning helps tell them apart.",
        confidence: 0.94,
        hypotheses: [
          {
            title: "Stop value treated as included",
            badge: "Strong evidence",
            badgeClass: "badge-purple",
            calc: "1 + 2 + 3 + 4 = 10",
            desc: "Your explanation explicitly included 4. Your trace adds 4 after reaching 6.",
            supported: true
          },
          {
            title: "Accumulator starts at the wrong value",
            badge: "Not supported",
            badgeClass: "badge-gray",
            calc: "4 + (1 + 2 + 3) = 10",
            desc: "This also gives 10, but your first running total is 1—not 5. Your work does not support this.",
            supported: false
          },
          {
            title: "Arithmetic slip with the right sequence",
            badge: "Not supported",
            badgeClass: "badge-gray",
            calc: "1 + 2 + 3 = mistake; total 10",
            desc: "Your trace correctly reaches 6, then adds 4. That points to a boundary issue, not addition.",
            supported: false
          }
        ],
        keepWorking: "Your running totals show how accumulation works. We'll focus on range boundaries, not restart the whole lesson.",
        relearnNote: "The stop value marks a boundary, not a value to visit."
      };
    }

    // Check if student thought accumulator resets or keeps last value (3 or 4)
    if (ans === "3" || ans === "4" || rsn.includes("last value") || rsn.includes("resets") || rsn.includes("replaces")) {
      return {
        label: "loop_accumulation",
        title: "Your range boundary is tracked. Accumulator state was missed.",
        subtitle: "The loop updates total on each step rather than overwriting it.",
        confidence: 0.88,
        hypotheses: [
          {
            title: "Accumulator overwritten each iteration",
            badge: "Strong evidence",
            badgeClass: "badge-purple",
            calc: "total = n (stores last value)",
            desc: "Your reasoning indicates total was assigned the final iteration value rather than accumulated.",
            supported: true
          },
          {
            title: "Zero-resetting accumulator",
            badge: "Partially supported",
            badgeClass: "badge-amber",
            calc: "total resets to 0 before last loop",
            desc: "Possible confusion about variable scope inside vs outside of loop block.",
            supported: false
          }
        ],
        keepWorking: "You accurately tracked loop steps. We'll focus on running sums with `total += n`.",
        relearnNote: "Accumulators keep memory across all iterations."
      };
    }

    // Correct understanding
    if (ans === "6") {
      return {
        label: "correct_understanding",
        title: "Exact understanding demonstrated!",
        subtitle: "You correctly stopped before 4 and accumulated 1, 2, and 3.",
        confidence: 0.98,
        hypotheses: [
          {
            title: "Proper range boundary & running sum",
            badge: "Verified",
            badgeClass: "badge-green",
            calc: "1 + 2 + 3 = 6 (4 excluded)",
            desc: "Your reasoning accurately identified that 4 is the exclusive stop boundary.",
            supported: true
          }
        ],
        keepWorking: "You have mastered the foundational boundary rule of Python's range().",
        relearnNote: "Ready for multi-step counterfactual transfer check."
      };
    }
  }

  // Fallback for general attempts
  return {
    label: "provisional_analysis",
    title: "Preliminary reasoning analysis",
    subtitle: "We compared your prediction against our synthetic misconception taxonomy.",
    confidence: 0.82,
    hypotheses: [
      {
        title: "Sequence boundary calibration",
        badge: "Hypothesis",
        badgeClass: "badge-purple",
        calc: `Submitted: ${ans}`,
        desc: "The reasoning pattern shows divergence in step boundaries.",
        supported: true
      }
    ],
    keepWorking: "Your effort to trace execution step by step is a great foundation.",
    relearnNote: "Focus on sequence invariants."
  };
}
