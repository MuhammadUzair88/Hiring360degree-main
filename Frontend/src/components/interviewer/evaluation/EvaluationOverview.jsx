import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Hourglass,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import InterviewerHeader from "../dashboard/InterviewerHeader";
import { useAuth } from "../../../context/AuthContext";
import EvaluationStatsOverview from "./EvaluationStatsOverview";
import EvaluationTable from "./EvaluationTable";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

const REFRESH_INTERVAL_MS = 15000;

function toStats(stats) {
  if (!stats) return [];

  return [
    {
      id: "total-finished",
      label: "Total Finished Interviews",
      value: stats.totalFinishedInterviews ?? 0,
      icon: ClipboardList,
      tone: "soft",
      helperText: "Completed interview sessions",
    },
    {
      id: "pending-feedback",
      label: "Pending Feedback",
      value: stats.pendingHrFeedback ?? 0,
      icon: Hourglass,
      tone: "subtle",
      helperText: "Awaiting your scorecard",
    },
    {
      id: "submitted-scorecards",
      label: "Submitted Scorecards",
      value: stats.submittedScorecards ?? 0,
      icon: CheckCircle2,
      tone: "strong",
      helperText: "Evaluations already submitted",
    },
  ];
}

export default function EvaluationOverview() {
  const navigate = useNavigate();
  const { interviewer } = useAuth();
  const mountedRef = useRef(true);

  const [organization, setOrganization] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEvaluations = useCallback(async ({ initial = false } = {}) => {
    if (initial) setIsLoading(true);
    else setRefreshing(true);

    try {
      const [orgData, profileData, evaluationsData] = await Promise.all([
        interviewerDashboardService.getOrganization(),
        interviewerDashboardService.getProfile(),
        interviewerDashboardService.getEvaluations(),
      ]);

      if (!mountedRef.current) return;

      setOrganization(orgData?.organization || null);
      setProfile(profileData?.interviewer || null);
      setStats(evaluationsData?.stats || null);
      setCandidates(evaluationsData?.evaluations || []);
      setError(null);
    } catch (requestError) {
      if (mountedRef.current) {
        setError(
          extractErrorMessage(requestError, "Failed to load evaluations.")
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadEvaluations({ initial: true });

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadEvaluations();
      }
    }, REFRESH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadEvaluations();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadEvaluations]);

  const handleSelectCandidate = (candidate) => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <InterviewerHeader
        organization={organization || {}}
        interviewer={{
          name: profile?.name || interviewer?.name || "Interviewer",
        }}
        actions={
          <button
            type="button"
            onClick={() => loadEvaluations()}
            disabled={refreshing}
            className="p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 hover:bg-secondary-200 transition-colors disabled:opacity-50"
            aria-label="Refresh evaluations"
            title="Refresh evaluations"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        }
      />

      <EvaluationStatsOverview stats={toStats(stats)} loading={isLoading} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => loadEvaluations()}
            className="mt-3 font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <EvaluationTable
          candidates={candidates}
          onSelectCandidate={handleSelectCandidate}
          selectedId={null}
          loading={isLoading}
        />
      )}
    </div>
  );
}
