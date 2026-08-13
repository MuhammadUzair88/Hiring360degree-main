
// src/pages/interviewer/conductInterviews/CandidateDetails.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import CandidateDetailOverview from "../../../components/interviewer/conductInterviews/CandidateDetailOverview";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";

const ROSTER_PATH = "/interviewers/conduct-interviews";
const REFRESH_INTERVAL_MS = 15000;

function normalizeResume(rawResume) {
  if (!rawResume) return null;

  if (typeof rawResume === "string") {
    return {
      fileUrl: rawResume,
      url: rawResume,
      type: "",
    };
  }

  const fileUrl = rawResume.fileUrl || rawResume.url || "";
  if (!fileUrl) return null;

  return {
    ...rawResume,
    fileUrl,
    url: fileUrl,
    type: rawResume.type || rawResume.mimeType || "",
  };
}

function normalizeCandidate(raw = {}) {
  return {
    ...raw,
    candidateName: raw.candidateName || raw.name || "Candidate",
    resume: normalizeResume(raw.resume),
  };
}

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInterviewerLogin } = useAuth();
  const mountedRef = useRef(true);

  const [candidate, setCandidate] = useState(undefined);
  const [error, setError] = useState(null);

  const loadCandidate = useCallback(
    async ({ initial = false } = {}) => {
      if (initial) setCandidate(undefined);
      setError(null);

      try {
        const data = await interviewerDashboardService.getCandidateById(id);
        if (!mountedRef.current) return;
        setCandidate(normalizeCandidate(data.candidate));
      } catch (requestError) {
        if (!mountedRef.current) return;
        if (initial) setCandidate(null);
        setError(
          extractErrorMessage(requestError, "Failed to load this candidate.")
        );
      }
    },
    [id]
  );

  useEffect(() => {
    mountedRef.current = true;
    loadCandidate({ initial: true });

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadCandidate();
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [loadCandidate]);

  const handleJoinInterview = () => {
    if (!candidate) return;

    // Candidate detail pages are normally behind InterviewerRoute, but keep
    // this guard here as well so a stale/expired session can never silently
    // enter the room as a candidate.
    if (!isInterviewerLogin) {
      navigate("/interviewers/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        },
      });
      return;
    }

    if (candidate.callId) {
      navigate(`/interview/${candidate.callId}?role=interviewer`);
      return;
    }

    if (candidate.meetingLink) {
      // Legacy records may already contain the complete interviewer link.
      const url = new URL(candidate.meetingLink, window.location.origin);
      url.searchParams.set("role", "interviewer");
      window.location.assign(url.toString());
    }
  };

  const handleSubmitFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  const handleViewFeedback = () => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  if (candidate === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-100 p-4 text-sm text-gray-500">
        Loading candidate…
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-100 p-4">
        <div className="max-w-md rounded-2xl bg-secondary-50 p-8 text-center shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-danger-500" />
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Candidate Not Found
          </h3>
          <p className="mb-6 text-sm text-black/50">
            {error ||
              "This interview schedule doesn't exist or may have been removed."}
          </p>
          <Link
            to={ROSTER_PATH}
            className="inline-block rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-secondary-50 transition-colors hover:bg-primary-800"
          >
            ← Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:mx-6">
          Live refresh failed: {error}. Showing the last loaded data.
        </div>
      )}

      <CandidateDetailOverview
        candidate={candidate}
        backTo={ROSTER_PATH}
        onJoinInterview={handleJoinInterview}
        onSubmitFeedback={handleSubmitFeedback}
        onViewFeedback={handleViewFeedback}
      />
    </>
  );
}
