import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CalendarPlus,
  AlertCircle,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import InterviewerHeader from "./InterviewerHeader";
import StatMetricsOverview from "./StatMetricsOverview";
import InterviewSessionsChart from "./InterviewSessionsChart";
import ScheduleCalendar from "./ScheduleCalendar";
import DaySchedulePanel from "./DaySchedulePanel";
import RecentInterviewsTable from "./RecentInterviewsTable";
import LiveChannelsCard from "./LiveChannelsCard";
import { useAuth } from "../../../context/AuthContext";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

const REFRESH_INTERVAL_MS = 15000;
const EMPTY_DAY = { agenda: [] };

function toStats(stats) {
  if (!stats) return [];

  return [
    {
      id: "upcoming",
      label: "Upcoming",
      value: stats.upcoming ?? 0,
      icon: Clock,
      tone: "subtle",
      helperText: "Scheduled interviews",
      to: "/interviewers/conduct-interviews",
    },
    {
      id: "new-interviews",
      label: "New Interviews",
      value: stats.newInterviews ?? 0,
      icon: CalendarPlus,
      tone: "soft",
      helperText: "Assigned in the last 7 days",
      to: "/interviewers/conduct-interviews",
    },
    {
      id: "missing",
      label: "No-Shows",
      value: stats.missing ?? 0,
      icon: AlertCircle,
      tone: "warning",
      helperText: "Recorded no-shows",
      to: "/interviewers/conduct-interviews",
    },
    {
      id: "feedback-awaiting",
      label: "Feedback Awaiting",
      value: stats.feedbackAwaiting ?? 0,
      icon: MessageSquare,
      tone: "alert",
      helperText: "Completed interviews awaiting evaluation",
      to: "/interviewers/evaluation",
    },
  ];
}

function toChartData(chart) {
  return {
    Weekly: (chart?.weeks || []).map((week) => ({
      name: week.week,
      scheduled: week.assignedSessions ?? 0,
      completed: week.currentCycle ?? 0,
    })),
  };
}

function dateOnlyKey(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function selectedDateKey(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

export default function InterviewerDashboardOverview() {
  const navigate = useNavigate();
  const { interviewer } = useAuth();
  const mountedRef = useRef(true);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [organization, setOrganization] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [liveInterviews, setLiveInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async ({ initial = false } = {}) => {
    if (initial) setLoading(true);
    else setRefreshing(true);

    try {
      const now = new Date();

      const [profileData, organizationData, statsData, chartData, recentData, liveData] =
        await Promise.all([
          interviewerDashboardService.getProfile(),
          interviewerDashboardService.getOrganization(),
          interviewerDashboardService.getStats(),
          interviewerDashboardService.getChart({
            year: now.getFullYear(),
            month: now.getMonth() + 1,
          }),
          interviewerDashboardService.getRecentInterviews({
            page: 1,
            limit: 100,
          }),
          interviewerDashboardService.getLiveInterviews(),
        ]);

      if (!mountedRef.current) return;

      setProfile(profileData?.interviewer || null);
      setOrganization(organizationData?.organization || null);
      setStats(statsData?.stats || null);
      setChart(chartData || null);
      setRecentInterviews(recentData?.recentInterviews || []);
      setLiveInterviews(liveData?.liveInterviews || []);
      setError("");
    } catch (requestError) {
      if (mountedRef.current) {
        setError(
          extractErrorMessage(
            requestError,
            "Failed to refresh the interviewer dashboard."
          )
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadDashboard({ initial: true });

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    }, REFRESH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadDashboard]);

  const markedDates = useMemo(
    () =>
      [...new Set(recentInterviews.map((item) => dateOnlyKey(item.interviewDate)).filter(Boolean))],
    [recentInterviews]
  );

  const daySchedule = useMemo(() => {
    const key = selectedDateKey(selectedDate);

    const agenda = recentInterviews
      .filter((item) => dateOnlyKey(item.interviewDate) === key)
      .sort((left, right) =>
        String(left.interviewTime || "").localeCompare(String(right.interviewTime || ""))
      )
      .map((item) => ({
        id: item.scheduleId,
        time: item.interviewTime,
        title: item.roundName,
        details: `${item.candidateName} · ${item.jobTitle}`,
      }));

    return agenda.length ? { agenda } : EMPTY_DAY;
  }, [recentInterviews, selectedDate]);

  const handleViewDetails = (interviewItem) => {
    navigate(`/interviewers/conduct-interviews/${interviewItem.scheduleId}`);
  };

  const handleJoinLive = (interviewItem) => {
    if (interviewItem.callId) {
      navigate(`/interview/${interviewItem.callId}`);
      return;
    }

    if (interviewItem.joinLink) {
      window.open(interviewItem.joinLink, "_blank", "noopener,noreferrer");
    }
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
            onClick={() => loadDashboard()}
            disabled={refreshing}
            className="p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 hover:bg-secondary-200 transition-colors disabled:opacity-50"
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadDashboard()}
            className="shrink-0 font-semibold hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <StatMetricsOverview stats={toStats(stats)} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <InterviewSessionsChart
            data={toChartData(chart)}
            filters={["Weekly"]}
            completionRate={chart?.completionRate || 0}
            loading={loading}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ScheduleCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            markedDates={markedDates}
            initialYear={selectedDate.getFullYear()}
            initialMonthIndex={selectedDate.getMonth()}
          />

          <DaySchedulePanel
            day={selectedDate.getDate()}
            year={selectedDate.getFullYear()}
            monthIndex={selectedDate.getMonth()}
            agenda={loading ? [] : daySchedule.agenda}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RecentInterviewsTable
            interviews={recentInterviews}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        </div>

        <div>
          <LiveChannelsCard
            interviews={liveInterviews}
            onJoin={handleJoinLive}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
