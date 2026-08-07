// src/pages/interviewer/conductInterview/CandidateDetails.jsx

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import CandidateDetailOverview from "../../../components/interviewer/conductInterviews/CandidateDetailOverview";
import { getCandidateDetails } from "../../../components/interviewer/conductInterviews/candidatedetailsdata";

const ROSTER_PATH = "/interviewers/conduct-interviews";

/**
 * Route: /interviewers/conduct-interviews/:id
 *
 * Looks the candidate up from dummy data by id today. When the
 * backend is wired up, replace the `getCandidateDetails` call with
 * `api.get(`/api/interviewer/dash/candidates/${id}`)` behind
 * loading/error state (same pattern as the old CandidateDetailsPage)
 * — CandidateDetailOverview and everything under it stays unchanged,
 * it just receives the same `candidate` shape from a real fetch
 * instead of candidateDetailsData.js.
 */
export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const candidate = getCandidateDetails(id);

  const handleJoinInterview = () => {
    if (candidate?.meetingLink) {
      window.open(candidate.meetingLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmitFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  const handleViewFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-100 p-4">
        <div className="bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h3 className="text-slate-900 text-lg font-semibold mb-2">Candidate Not Found</h3>
          <p className="text-black/50 text-sm mb-6">
            This interview schedule doesn't exist or may have been removed.
          </p>
          <Link
            to={ROSTER_PATH}
            className="inline-block px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-secondary-50 rounded-xl text-sm font-semibold transition-colors"
          >
            ← Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CandidateDetailOverview
      candidate={candidate}
      backTo={ROSTER_PATH}
      onJoinInterview={handleJoinInterview}
      onSubmitFeedback={handleSubmitFeedback}
      onViewFeedback={handleViewFeedback}
    />
  );
}