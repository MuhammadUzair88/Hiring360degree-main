import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Hourglass, CheckCircle2 } from "lucide-react";
import InterviewerHeader from "../dashboard/InterviewerHeader";
import { useAuth } from "../../../context/AuthContext";
import EvaluationStatsOverview from "./EvaluationStatsOverview";
import EvaluationTable from "./EvaluationTable";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

function toStats(stats) {
  if (!stats) return undefined;
  return [
    {
      id: "total-finished",
      label: "Total Finished Interviews",
      value: stats.totalFinishedInterviews,
      icon: ClipboardList,
      tone: "soft",
      helperText: "Post-Interview Data",
    },
    {
      id: "pending-feedback",
      label: "Pending HR Feedback",
      value: stats.pendingHrFeedback,
      icon: Hourglass,
      tone: "subtle",
      helperText: "Post-Interview Data",
    },
    {
      id: "submitted-scorecards",
      label: "Submitted Scorecards",
      value: stats.submittedScorecards,
      icon: CheckCircle2,
      tone: "soft",
      helperText: "Post-Interview Data",
    },
  ];
}

/**
 * Evaluation Overview — the single place every evaluation component
 * gets composed. Loads real data from
 * GET /api/interviewer/dash/evaluations.
 */
export default function EvaluationOverview() {
  const navigate = useNavigate();
  const { interviewer } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [orgData, evaluationsData] = await Promise.all([
          interviewerDashboardService.getOrganization(),
          interviewerDashboardService.getAllEvaluations(),
        ]);
        if (!isActive) return;
        setOrganization(orgData.organization);
        setStats(evaluationsData.stats);
        setCandidates(evaluationsData.evaluations || []);
      } catch (err) {
        if (isActive) setError(extractErrorMessage(err, "Failed to load evaluations."));
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const handleSelectCandidate = (candidate) => {
    navigate(`/interviewers/evaluation/${candidate.scheduleId}`, {
      state: { candidate },
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <InterviewerHeader
        organization={organization || {}}
        interviewer={{ name: interviewer?.name || "Interviewer" }}
      />

      <EvaluationStatsOverview stats={toStats(stats)} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : (
        <EvaluationTable
          candidates={isLoading ? [] : candidates}
          onSelectCandidate={handleSelectCandidate}
          selectedId={null}
        />
      )}
    </div>
  );
}
