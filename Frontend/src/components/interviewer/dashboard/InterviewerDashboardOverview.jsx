import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CalendarPlus, AlertCircle, MessageSquare } from "lucide-react";
import InterviewerHeader from "./InterviewerHeader";
import StatMetricsOverview from "./StatMetricsOverview";
import InterviewSessionsChart from "./InterviewSessionsChart";
import ScheduleCalendar from "./ScheduleCalendar";
import DaySchedulePanel from "./DaySchedulePanel";
import RecentInterviewsTable from "./RecentInterviewsTable";
import LiveChannelsCard from "./LiveChannelsCard";
import { useAuth } from "../../../context/AuthContext";
import { useAsync } from "../../../hooks/useAsync";
import interviewerDashboardService from "../../../services/interviewerDashboardService";

const EMPTY_DAY = { agenda: [] };

function toStats(stats) {
  if (!stats) return undefined;
  return [
    {
      id: "upcoming",
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      tone: "subtle",
      helperText: "Schedules pending start",
      to: "/interviewers/conduct-interviews",
    },
    {
      id: "new-interviews",
      label: "New Interviews",
      value: stats.newInterviews,
      icon: CalendarPlus,
      tone: "soft",
      helperText: "Added in the last 7 days",
      to: "/interviewers/conduct-interviews",
    },
    {
      id: "missing",
      label: "No-Shows",
      value: stats.missing,
      icon: AlertCircle,
      tone: "warning",
      helperText: "Candidates who didn't join",
    },
    {
      id: "feedback-awaiting",
      label: "Feedback Awaiting",
      value: stats.feedbackAwaiting,
      icon: MessageSquare,
      tone: "alert",
      helperText: "Completed, not yet scored",
      to: "/interviewers/evaluation",
    },
  ];
}

function toChartData(chart) {
  if (!chart?.weeks) return undefined;
  return {
    Weekly: chart.weeks.map((week) => ({
      name: week.week,
      scheduled: week.assignedSessions,
      completed: week.currentCycle,
    })),
  };
}

function scheduleDateKey(interview) {
  return new Date(interview.interviewDate).toDateString();
}

/**
 * Interviewer Dashboard Overview. Loads everything the backend already
 * exposes at /api/interviewer/dash/* in parallel, then hands each
 * child component the same shape its own data.js mock used, so none
 * of the presentational components needed to change.
 */
export default function InterviewerDashboardOverview() {
  const navigate = useNavigate();
  const { interviewer } = useAuth();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [organization, setOrganization] = useState(null);

  const { data: statsData, isLoading: isStatsLoading } = useAsync(
    () => interviewerDashboardService.getStats(),
    []
  );
  const { data: chartData, isLoading: isChartLoading } = useAsync(
    () => interviewerDashboardService.getChart(),
    []
  );
  // Pull a generous page of recent interviews so the calendar sidebar can
  // group them by day client-side — the backend doesn't expose a
  // dedicated "schedule for this date" endpoint for interviewers today.
  const { data: recentData, isLoading: isRecentLoading } = useAsync(
    () => interviewerDashboardService.getRecentInterviews({ page: 1, limit: 100 }),
    []
  );
  const { data: liveData } = useAsync(() => interviewerDashboardService.getLiveInterviews(), []);

  useEffect(() => {
    interviewerDashboardService
      .getOrganization()
      .then((data) => setOrganization(data.organization))
      .catch(() => {});
  }, []);

  const allInterviews = recentData?.recentInterviews || [];

  const markedDays = useMemo(() => {
    const today = new Date();
    return allInterviews
      .filter((item) => {
        const date = new Date(item.interviewDate);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      })
      .map((item) => new Date(item.interviewDate).getDate());
  }, [allInterviews]);

  const daySchedule = useMemo(() => {
    const key = selectedDate.toDateString();
    const agenda = allInterviews
      .filter((item) => scheduleDateKey(item) === key)
      .map((item) => ({
        id: item.scheduleId,
        time: item.interviewTime,
        title: item.roundName,
        details: `${item.candidateName} · ${item.jobTitle}`,
      }));
    return agenda.length ? { agenda } : EMPTY_DAY;
  }, [allInterviews, selectedDate]);

  const handleViewDetails = (interview) => {
    navigate(`/interviewers/conduct-interviews/${interview.scheduleId}`, { state: { interview } });
  };

  const handleJoinLive = (interview) => {
    if (interview.callId) navigate(`/interview/${interview.callId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <InterviewerHeader
        organization={organization || { name: "Your Organization" }}
        interviewer={{ name: interviewer?.name || "Interviewer" }}
      />

      <StatMetricsOverview stats={isStatsLoading ? undefined : toStats(statsData?.stats)} />

      {/* Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <InterviewSessionsChart
            data={isChartLoading ? undefined : toChartData(chartData)}
            filters={["Weekly"]}
            completionRate={chartData?.completionRate}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ScheduleCalendar
            selectedDay={selectedDate.getDate()}
            onSelectDate={setSelectedDate}
            markedDays={markedDays}
            initialYear={selectedDate.getFullYear()}
            initialMonthIndex={selectedDate.getMonth()}
          />
          <DaySchedulePanel
            day={selectedDate.getDate()}
            year={selectedDate.getFullYear()}
            monthIndex={selectedDate.getMonth()}
            agenda={isRecentLoading ? [] : daySchedule.agenda}
          />
        </div>
      </div>

      {/* Recent schedule table + live channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RecentInterviewsTable
            interviews={isRecentLoading ? [] : allInterviews}
            onViewDetails={handleViewDetails}
          />
        </div>

        <div>
          <LiveChannelsCard interviews={liveData?.liveInterviews || []} onJoin={handleJoinLive} />
        </div>
      </div>
    </div>
  );
}
