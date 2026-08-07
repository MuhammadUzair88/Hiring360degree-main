// src/data/candidateEvaluationData.js
//
// Front-end only mock data for the Candidate Evaluation screen.
// This is what a GET /api/interviewer/dash/evaluations/:id response would
// look like — every component downstream only cares about this shape, so
// swapping this file out for a real fetch later is a one-line change in
// the page component, nothing in the component tree needs to move.

const candidateEvaluationData = {
  candidate: {
    id: "cand_1029",
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    email: "sarah.chen@example.com",
    avatarUrl: "",
    status: "In Progress", // "In Progress" | "Submitted"
    assignedRole: "Lead UI Dev",
    interviewDate: "Oct 24, 2023",
    duration: "60 Minutes",
  },

  interviewFocus: [
    "React & Modern Frameworks",
    "UI/UX Engineering Systems",
    "Team Leadership Mentality",
  ],

  // Drives every row rendered inside <CompetencyAssessment />.
  // `rating` is only used to pre-fill the form when an evaluation was
  // already submitted (isSubmitted: true below) — otherwise the form
  // starts blank and the interviewer rates live.
  competencyCategories: [
    {
      id: "technicalSkills",
      label: "Technical Skills",
      description: "Knowledge of React, CSS, and Tooling",
      rating: 4,
    },
    {
      id: "problemSolving",
      label: "Problem Solving",
      description: "Algorithmic thinking and debug efficiency",
      rating: 5,
    },
    {
      id: "communication",
      label: "Communication",
      description: "Clarity and technical articulation",
      rating: 3,
    },
    {
      id: "behavioralSkills",
      label: "Behavioral Skills",
      description: "Leadership and conflict management",
      rating: 4,
    },
    {
      id: "culturalFit",
      label: "Cultural Fit",
      description: "Alignment with core company values",
      rating: 5,
    },
  ],

  recommendationOptions: [
    { id: "Strong Hire", label: "Strong Hire" },
    { id: "Hire", label: "Hire" },
    { id: "Hold", label: "Hold" },
    { id: "No Hire", label: "No Hire" },
  ],

  // Pre-existing evaluation state. Flip isSubmitted to true to preview the
  // read-only / "submitted" rendering of the whole form.
  evaluation: {
    strengths: "",
    improvements: "",
    recommendation: "Hire",
    finalComments: "",
    isSubmitted: false,
  },
};

export default candidateEvaluationData;
