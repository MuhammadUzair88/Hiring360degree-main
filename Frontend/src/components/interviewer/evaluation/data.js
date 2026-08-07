import { ClipboardList, Hourglass, CheckCircle2 } from "lucide-react";

/**
 * evaluation/data.js
 * ------------------------------------------------------------------
 * Single source of truth for every piece of dummy data rendered on
 * the Evaluation page. Nothing in the component files below hardcodes
 * copy or numbers — they receive it as props, defaulting to the
 * matching export here. Swap these exports for real API responses
 * later and no component needs to change.
 *
 * Organization/interviewer identity for the shared header lives in
 * ../shared/data.js, not here — see EvaluationOverview.jsx.
 * ------------------------------------------------------------------
 */

/** Candidates whose interviews have finished and are awaiting/have feedback. */
export const evaluationCandidates = [
  {
    scheduleId: "sch-3",
    candidateName: "Bilal Ahmed",
    candidateEmail: "bilal.ahmed@example.com",
    jobTitle: "Finance Manager",
    roundName: "HR Round",
    evaluationStatus: "Pending",
  },
  {
    scheduleId: "sch-5",
    candidateName: "Sara Malik",
    candidateEmail: "sara.malik@example.com",
    jobTitle: "HR Executive",
    roundName: "Culture Round",
    evaluationStatus: "Completed",
  },
  {
    scheduleId: "sch-7",
    candidateName: "Sumit Sharma",
    candidateEmail: "sumit8444061@gmail.com",
    jobTitle: "Senior Frontend Developer",
    roundName: "Technical Round",
    evaluationStatus: "Completed",
  },
  {
    scheduleId: "sch-4",
    candidateName: "Hamza Riaz",
    candidateEmail: "hamza.riaz@example.com",
    jobTitle: "QA Engineer",
    roundName: "Technical Round",
    evaluationStatus: "Pending",
  },
];

/**
 * The 3 top-line KPI cards. Values are derived directly from
 * evaluationCandidates above (not hardcoded separately) so the counts
 * can never drift out of sync with the table — same "single source of
 * truth" pattern the dashboard's scheduleByDay uses.
 */
export const evaluationStats = [
  {
    id: "total-finished",
    label: "Total Finished Interviews",
    value: evaluationCandidates.length,
    icon: ClipboardList,
    tone: "soft",
    helperText: "Post-Interview Data",
  },
  {
    id: "pending-feedback",
    label: "Pending HR Feedback",
    value: evaluationCandidates.filter((c) => c.evaluationStatus !== "Completed").length,
    icon: Hourglass,
    tone: "subtle",
    helperText: "Post-Interview Data",
  },
  {
    id: "submitted-scorecards",
    label: "Submitted Scorecards",
    value: evaluationCandidates.filter((c) => c.evaluationStatus === "Completed").length,
    icon: CheckCircle2,
    tone: "strong",
    helperText: "Post-Interview Data",
  },
];
