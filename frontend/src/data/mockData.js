// Re:Learn Complete Mock Data Store
// Source of truth matching the Figma screens precisely

export const initialLearner = {
  name: "Maya Chen",
  avatar: "MC",
  role: "Demo learner",
  enrolledCourse: "Python foundations",
  completedUnits: 2,
  totalUnits: 6,
  conceptsDemonstrated: 6,
  totalConcepts: 12,
  learningMinutesThisWeek: 42,
  hasCompletedAttempt03: false
};

export const continueLearningCardData = {
  unitLabel: "Unit 03 · Lesson 03 of 04",
  title: "Loops & the range() function",
  description: "Learn which values a loop visits, then explain what your code prints.",
  duration: "8 min",
  format: "Visual + code + practice",
  rangeSnippet: "range(1, 4)",
  values: [
    { num: 1, label: "start · included" },
    { num: 2, label: "included" },
    { num: 3, label: "last value" },
    { num: 4, label: "stop · excluded", excluded: true }
  ],
  caption: "Start here. Stop before 4.",
  footerNotice: "Your next check adapts to your reasoning."
};

export const goodNextStepData = {
  title: "A good next step",
  recommendation: "Look closer at loop boundaries",
  description: "In your last check, you included the stop value. Let's explore the pattern, not just fix the answer.",
  snippet: "list(range(0, 4))",
  expected: "You expected [0, 1, 2, 3, 4]",
  footerNote: "A clue to investigate, not a label about you."
};

export const pythonLearningPath = [
  {
    id: "variables",
    title: "Variables",
    subtitle: "Names & values",
    status: "Completed",
    isCompleted: true
  },
  {
    id: "conditionals",
    title: "Conditionals",
    subtitle: "Making decisions",
    status: "Completed",
    isCompleted: true
  },
  {
    id: "loops",
    title: "Loops",
    subtitle: "Repeat with purpose",
    status: "In progress",
    isInProgress: true
  }
];

export const recentLearningItems = [
  {
    title: "Range boundary check",
    subtitle: "A pattern to explore · Today",
    type: "explore"
  },
  {
    title: "Conditional logic",
    subtitle: "Understanding demonstrated · Yesterday",
    type: "completed"
  },
  {
    title: "Variables & assignment",
    subtitle: "Unit completed · 1 Oct",
    type: "completed"
  }
];

export const courseOutline = [
  { id: "u01", num: "01", title: "Variables & types", completed: true },
  { id: "u02", num: "02", title: "Conditionals", completed: true },
  {
    id: "u03",
    num: "03",
    title: "Loops & iteration",
    expanded: true,
    lessons: [
      { id: "l01", title: "Why loops?", duration: "4 min", status: "Complete" },
      { id: "l02", title: "Meet the for loop", duration: "6 min", status: "Complete" },
      { id: "l03", title: "Understanding range()", duration: "8 min", status: "Learning now", active: true },
      { id: "l04", title: "Practice & reflection", duration: "6 min", status: "Up next" }
    ]
  },
  { id: "u04", num: "04", title: "Lists & indexing", upcoming: true },
  { id: "u05", num: "05", title: "Functions", upcoming: true },
  { id: "u06", num: "06", title: "Your first project", upcoming: true }
];

export const practiceCatalogData = [
  {
    id: "loops",
    title: "Loops & range boundaries",
    unit: "Unit 03",
    questionCount: 6,
    difficulty: "Medium",
    revisitCount: 2,
    snippet: "for n in range(1, 4): ...",
    status: "Current focus"
  },
  {
    id: "variables",
    title: "Variables & reassignment",
    unit: "Unit 01",
    questionCount: 8,
    difficulty: "Easy",
    revisitCount: 0,
    snippet: "x = 5; x = x + 2",
    status: "Mastered"
  },
  {
    id: "conditionals",
    title: "Conditional branching",
    unit: "Unit 02",
    questionCount: 10,
    difficulty: "Easy - Medium",
    revisitCount: 0,
    snippet: "if score > 50: ...",
    status: "Mastered"
  },
  {
    id: "lists",
    title: "Lists & slice indexing",
    unit: "Unit 04",
    questionCount: 8,
    difficulty: "Medium",
    revisitCount: 0,
    snippet: "items[1:3]",
    status: "Up next"
  },
  {
    id: "functions",
    title: "Function parameters & returns",
    unit: "Unit 05",
    questionCount: 6,
    difficulty: "Medium - Hard",
    revisitCount: 0,
    snippet: "def calculate(a, b): ...",
    status: "Upcoming"
  }
];

export const evaluationDataset = [
  {
    id: "RL-018",
    output: "10",
    reasoning: "1, 2, 3 and 4 are included.",
    label: "Range endpoint",
    badgeType: "purple",
    status: "Reviewed",
    split: "Train"
  },
  {
    id: "RL-019",
    output: "10",
    reasoning: "I start at 4, then add 1, 2, 3.",
    label: "Accumulator initialization",
    badgeType: "gray",
    status: "Reviewed",
    split: "Train"
  },
  {
    id: "RL-020",
    output: "6",
    reasoning: "Stop is excluded: 1 + 2 + 3.",
    label: "No misconception evidenced",
    badgeType: "green",
    status: "Reviewed",
    split: "Train"
  },
  {
    id: "RL-021",
    output: "6",
    reasoning: "I guessed. I'm not sure why.",
    label: "Insufficient evidence",
    badgeType: "gray",
    status: "Needs review",
    split: "Train"
  }
];

export const unseenTestCases = [
  {
    id: "TEST-007",
    unseenReasoning: "Stop at 8, so I also add 8.",
    humanLabel: "Range endpoint",
    modelPrediction: "Range endpoint",
    review: "Match",
    isMatch: true
  },
  {
    id: "TEST-016",
    unseenReasoning: "Start total at 5; then add the loop values.",
    humanLabel: "Accumulator initialization",
    modelPrediction: "Range endpoint",
    review: "Confused",
    isMatch: false
  },
  {
    id: "TEST-031",
    unseenReasoning: "The answer is 9. I guessed.",
    humanLabel: "Insufficient evidence",
    modelPrediction: "Abstain / ask a question",
    review: "Needs review",
    isMatch: null
  }
];
