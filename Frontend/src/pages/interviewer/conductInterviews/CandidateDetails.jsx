// src/pages/interviewer/conductInterviews/CandidateDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import CandidateDetailOverview from "../../../components/interviewer/conductInterviews/CandidateDetailOverview";
import interviewerDashboardService from "../../../services/interviewerDashboardService";

const ROSTER_PATH = "/interviewers/conduct-interviews";

/**
 * Route: /interviewers/conduct-interviews/:id
 *
 * Note on the resume section: the backend only stores the candidate's
 * uploaded resume as a file URL (`application.resume.url`), not a
 * structured/parsed resume (experience, projects, education, etc).
 * `ResumeDocumentPreview` was built to render that richer structure —
 * without a resume-parsing endpoint to populate it, only the
 * file-level actions (view/download/print) are wired to something
 * real; the structured sections simply don't render, which the
 * component already handles gracefully via optional chaining.
 */
export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setCandidate(undefined);
    interviewerDashboardService
      .getCandidateById(id)
      .then((data) => {
        if (!isActive) return;
        const raw = data.candidate;
        setCandidate({
          ...raw,
          candidateName: raw.name,
          resume: raw.resume ? { fileUrl: raw.resume } : null,
        });
      })
      .catch((err) => {
        if (isActive) {
          setCandidate(null);
          setError(err.response?.data?.message || "Failed to load this candidate.");
        }
      });
    return () => {
      isActive = false;
    };
  }, [id]);

  const handleJoinInterview = () => {
    if (candidate?.callId) navigate(`/interview/${candidate.callId}`);
    else if (candidate?.meetingLink) window.open(candidate.meetingLink, "_blank", "noopener,noreferrer");
  };

  const handleSubmitFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  const handleViewFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  if (candidate === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-100 p-4 text-sm text-gray-500">
        Loading candidate…
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-100 p-4">
        <div className="bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h3 className="text-slate-900 text-lg font-semibold mb-2">Candidate Not Found</h3>
          <p className="text-black/50 text-sm mb-6">
            {error || "This interview schedule doesn't exist or may have been removed."}
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
