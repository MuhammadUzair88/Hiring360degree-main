/**
 * organization/jobAdvertisement/candidateIntake/data.js
 * ------------------------------------------------------------------
 * Dummy applicant records + status constants for the Candidate Intake
 * board. Field names mirror what the backend's application/AI-scoring
 * endpoints already return — `id` is the application id used in every
 * PUT route referenced from CandidateIntakeOverview.jsx (bookmark,
 * shortlist, move, reject). Swap getCandidatesByJobId for a real
 * GET /api/application/job/:jobId call once that route exists; every
 * component in this folder only ever reads off the `candidate` shape
 * below, never off this array directly.
 * ------------------------------------------------------------------
 */

export const CANDIDATE_STATUS = {
  PENDING: "Pending",
  BOOKMARKED: "Bookmarked",
  SHORTLISTED: "Shortlisted",
};

// All dummy candidates below are attached to this one sample job id.
// If the job id in your URL doesn't match this, getCandidatesByJobId
// falls back to returning every dummy candidate anyway (see below) so
// you can still see the board populated while wiring things up.
// const SAMPLE_JOB_ID = "6a6505edf4f0af318b5084d0";


/**
 * Simulates GET /api/application/job/:jobId against the dummy list above.
 *
 * DEV-ONLY FALLBACK: if the requested jobId has no matching candidates
 * (e.g. your job records use different ids than SAMPLE_JOB_ID above),
 * this returns every dummy candidate instead of an empty board, purely
 * so the Candidate Intake UI is visible while you're testing layout.
 * Delete the fallback once this is wired to a real backend — a real
 * empty result should render the empty-state columns, not dummy data.
 */
// export function getCandidatesByJobId(jobId) {
//   const matches = candidateIntakeList.filter((candidate) => candidate.jobId === jobId);
//   if (matches.length > 0) return matches;
//   return candidateIntakeList;
// }