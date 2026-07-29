
// Same dummy job used across the Candidate Intake board, so the two
// screens line up while everything is running on dummy data.
export const SAMPLE_JOB_ID = "6a6505edf4f0af318b5084d0";

export const SCHEDULE_STATUS = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
};

export const FEEDBACK_EVALUATION = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

export const RECOMMENDATION = {
  STRONG_HIRE: "Strong Hire",
  HIRE: "Hire",
  NO_HIRE: "No Hire",
  MAYBE: "Maybe",
};

// A candidate's overall standing in the pipeline, derived from
// decisions made across every round — not a single schedule's status.
export const CANDIDATE_OUTCOME = {
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

// Sensible starting point offered inside the setup popup — the HR
// user can rename/remove/add rounds before finalizing.
export const DEFAULT_ROUND_NAMES = ["Technical Round", "HR Round"];

/**
 * Simulates GET /api/round/:jobId (the InterviewPipeline document).
 * Always null here on purpose — every job starts unconfigured so the
 * setup popup shows the first time its Rounds tab is opened. Once
 * finalized, the real config lives in localStorage (see useRoundsLogic)
 * standing in for the saved InterviewPipeline row.
 */
export function getInterviewPipelineByJobId(jobId) {
  return null;
}

// -- Interviewers -------------------------------------------------------
export const interviewerList = [
  { id: "int-01", name: "Elena Rodriguez", email: "elena.rodriguez@hrcore.com", type: "Senior HR Partner" },
  { id: "int-02", name: "David Chen", email: "david.chen@hrcore.com", type: "Engineering Lead" },
  { id: "int-03", name: "Sarah Jenkins", email: "sarah.jenkins@hrcore.com", type: "Core Engineering" },
];

/** Simulates GET /api/interviewer. */
export function getInterviewers() {
  return interviewerList;
}

// -- Shortlisted candidate pool (every round's round-0 starting point) --
// Same shape the Candidate Intake board hands off once an applicant is
// moved to "Shortlisted". `id` is the application id used by every
// schedule/decision call below; `candidateId` is the person themself.
export const shortlistedCandidateList = [
  {
    id: "6b1f0a2c4f0af318b5084e02",
    candidateId: "cand-02",
    jobId: SAMPLE_JOB_ID,
    name: "Sumit Sharma",
    email: "sharma.sumit.6574@gmail.com",
    matchScore: 96,
  },
  {
    id: "6b1f0a2c4f0af318b5084e03",
    candidateId: "cand-03",
    jobId: SAMPLE_JOB_ID,
    name: "Ayesha Khan",
    email: "ayesha.khan.dev@gmail.com",
    matchScore: 84,
  },
  {
    id: "6b1f0a2c4f0af318b5084e05",
    candidateId: "cand-05",
    jobId: SAMPLE_JOB_ID,
    name: "Marcus Vane",
    email: "marcus.vane@gmail.com",
    matchScore: 79,
  },
];

/** Simulates GET /api/application/shortlisted/:jobId. */
export function getShortlistedCandidatesByJobId(jobId) {
  const matches = shortlistedCandidateList.filter((candidate) => candidate.jobId === jobId);
  return matches.length > 0 ? matches : shortlistedCandidateList;
}

// -- Scheduled interviews -------------------------------------------------
// One entry per booked slot. `roundIndex` ties a schedule to a position
// in the pipeline's `rounds` array (not to a round by name), so renaming
// a round later never orphans its schedules.
//
// Three seeded here on purpose, so opening the page shows real content
// in both tabs instead of empty states — and specifically two in
// "Review" with feedback already submitted, so you can open the
// feedback modal right away and see what an interviewer's review
// actually looks like:
//   sch-01 — booked for a future slot        -> lands in "Upcoming"
//   sch-02 — completed, strong feedback in    -> lands in "Review"
//   sch-03 — completed, weak feedback in      -> lands in "Review"
export const scheduledInterviewList = [
  {
    id: "sch-01",
    jobId: SAMPLE_JOB_ID,
    candidateId: "cand-02",
    candidateName: "Sumit Sharma",
    candidateEmail: "sharma.sumit.6574@gmail.com",
    interviewerId: "int-02",
    interviewerName: "David Chen",
    roundIndex: 0,
    date: "2026-07-30",
    time: "14:00",
    status: SCHEDULE_STATUS.SCHEDULED,
    notified: true,
    feedbackEvaluation: FEEDBACK_EVALUATION.PENDING,
    feedback: null,
    passed: null,
  },
  {
    id: "sch-02",
    jobId: SAMPLE_JOB_ID,
    candidateId: "cand-03",
    candidateName: "Ayesha Khan",
    candidateEmail: "ayesha.khan.dev@gmail.com",
    interviewerId: "int-03",
    interviewerName: "Sarah Jenkins",
    roundIndex: 0,
    date: "2026-07-24",
    time: "11:00",
    status: SCHEDULE_STATUS.COMPLETED,
    notified: true,
    feedbackEvaluation: FEEDBACK_EVALUATION.COMPLETED,
    feedback: {
      ratings: { technicalSkills: 4, problemSolving: 4, communication: 5, behavioralSkills: 4, culturalFit: 5 },
      coreStrengths: "Clear communicator with strong ownership of past frontend projects and a good eye for detail.",
      areasForImprovement: "Could use deeper hands-on GraphQL experience before owning API-heavy features.",
      recommendation: RECOMMENDATION.HIRE,
      finalComments: "Solid round overall — paired well with the panel and asked sharp clarifying questions.",
    },
    passed: null,
  },
  {
    id: "sch-03",
    jobId: SAMPLE_JOB_ID,
    candidateId: "cand-05",
    candidateName: "Marcus Vane",
    candidateEmail: "marcus.vane@gmail.com",
    interviewerId: "int-02",
    interviewerName: "David Chen",
    roundIndex: 0,
    date: "2026-07-23",
    time: "16:00",
    status: SCHEDULE_STATUS.COMPLETED,
    notified: true,
    feedbackEvaluation: FEEDBACK_EVALUATION.COMPLETED,
    feedback: {
      ratings: { technicalSkills: 2, problemSolving: 3, communication: 3, behavioralSkills: 3, culturalFit: 3 },
      coreStrengths: "Confident presenter, comfortable talking through past project decisions at a high level.",
      areasForImprovement: "Struggled with the live coding exercise — needs stronger fundamentals before the next round.",
      recommendation: RECOMMENDATION.NO_HIRE,
      finalComments: "Personable, but the technical gap was too wide for this role's day-to-day requirements.",
    },
    passed: null,
  },
];

/** Simulates GET /api/interview/schedule/:jobId. */
export function getScheduledInterviewsByJobId(jobId) {
  const matches = scheduledInterviewList.filter((item) => item.jobId === jobId);
  return matches.length > 0 ? matches : scheduledInterviewList;
}
