
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
export const DEFAULT_ROUND_NAMES = ["Round 1", "Round 2"];
