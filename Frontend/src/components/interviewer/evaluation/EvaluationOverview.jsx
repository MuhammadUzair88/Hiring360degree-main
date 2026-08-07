import React from "react";
import { useNavigate } from "react-router-dom";
import InterviewerHeader from "../dashboard/InterviewerHeader";
import { organizationProfile, interviewerProfile } from "../dashboard/data";
import EvaluationStatsOverview from "./EvaluationStatsOverview";
import EvaluationTable from "./EvaluationTable";
import { evaluationCandidates } from "./data";

/**
 * Evaluation Overview — the single place every evaluation component
 * gets composed. Runs entirely on the dummy data exported from
 * ./data.js today; when the real API is wired up, only this file
 * (and data.js) needs to change to fetch and pass down live values —
 * every child component below stays exactly the same.
 */
export default function EvaluationOverview() {
  const navigate = useNavigate();

  // Selecting a candidate (row click, or the Evaluate / View Feedback
  // button) redirects into that candidate's evaluation detail page.
  const handleSelectCandidate = (candidate) => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`, {
      state: { candidate },
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <InterviewerHeader organization={organizationProfile} interviewer={interviewerProfile} />

      <EvaluationStatsOverview />

      <EvaluationTable
        candidates={evaluationCandidates}
        onSelectCandidate={handleSelectCandidate}
        selectedId={null}
      />
    </div>
  );
}
