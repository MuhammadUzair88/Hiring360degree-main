import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardGreetingBanner from "./DashboardGreetingBanner";
import StatMetricsOverview from "./StatMetricsOverview";
import ApplicationsTrendChart from "./ApplicationStrendChart";
import JobCategoryDistributionChart from "./JobCategoryDistributionChart";
import HiringPerformanceChart from "./HiringPerformanceChart";
import RecentApplications from "./RecentApplications";
import PanelistWorkloadCard from "./PanelistWorkloadCard";
import QuickActionsPanel from "./QuickActionsPanel";
import ScheduleCalendar from "./ScheduleCalendar";
import DaySchedulePanel from "./DaySchedulePanel";
import OngoingInterviewsPanel from "./OngoingInterviewsPanel";
import UpcomingInterviewsPanel from "./UpcomingInterviewsPanel";
import OfferLetterActivityChart from "./OfferLetterActivityChart";
import { useAuth } from "../../../context/AuthContext";
import { useAsync } from "../../../hooks/useAsync";
import orgDashboardService from "../../../services/orgDashboardService";
import {
  mapKpiCardsToStats,
  mapApplicationsTrend,
  mapPerformanceData,
  mapJobDistribution,
  mapRecentApplications,
  mapOfferLetterActivity,
  mapDaySchedule,
  mapInterviewerMetricsToWorkload,
} from "../../../utils/adapters";

const EMPTY_DAY = { agenda: [], live: null, upcoming: [] };

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardOverview() {
  const { organization } = useAuth();
  const today = useMemo(() => new Date(), []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [daySchedule, setDaySchedule] = useState(EMPTY_DAY);
  const [isDayLoading, setIsDayLoading] = useState(true);

  const { data, isLoading, error, refetch } = useAsync(
    () => orgDashboardService.getDashboardData(),
    []
  );
  const {
    data: interviewerMetricsResponse,
    refetch: refetchInterviewerMetrics,
  } = useAsync(() => orgDashboardService.getInterviewerMetrics(), []);

  const dashboard = data?.data || {};
  const interviewerMetrics = interviewerMetricsResponse?.data || [];

  const loadDaySchedule = useCallback(async (date) => {
    setIsDayLoading(true);
    try {
      const result = await orgDashboardService.getScheduleByDate(toIsoDate(date));
      setDaySchedule(mapDaySchedule(result.data || EMPTY_DAY));
    } catch (error) {
      setDaySchedule(EMPTY_DAY);
    } finally {
      setIsDayLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDaySchedule(selectedDate);
  }, [selectedDate, loadDaySchedule]);

  // Keep operational dashboard data fresh without changing the UI.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetch().catch(() => {});
      refetchInterviewerMetrics().catch(() => {});
      loadDaySchedule(selectedDate);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [refetch, refetchInterviewerMetrics, loadDaySchedule, selectedDate]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="h-12 w-64 animate-pulse rounded-lg bg-secondary-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <DashboardGreetingBanner orgName={organization?.name} />

      <StatMetricsOverview stats={mapKpiCardsToStats(dashboard?.kpiCards)} />

      {/* Applications Trend + Job Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3">
          <ApplicationsTrendChart data={mapApplicationsTrend(dashboard.applicationsTrend)} />
        </div>
        <div className="lg:col-span-2">
          <JobCategoryDistributionChart categories={mapJobDistribution(dashboard.jobDistribution)} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* ── Main column (75%) ── */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <HiringPerformanceChart data={mapPerformanceData(dashboard.performanceData)} />

          <RecentApplications applications={mapRecentApplications(dashboard.recentApplications)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PanelistWorkloadCard workload={mapInterviewerMetricsToWorkload(interviewerMetrics)} />
            <QuickActionsPanel />
          </div>
        </div>

        {/* ── Calendar sidebar (25%) ── */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <ScheduleCalendar
            selectedDay={selectedDate.getDate()}
            onSelectDate={setSelectedDate}
            markedDays={[]}
            initialYear={today.getFullYear()}
            initialMonthIndex={today.getMonth()}
          />

          <DaySchedulePanel
            day={selectedDate.getDate()}
            year={selectedDate.getFullYear()}
            monthIndex={selectedDate.getMonth()}
            agenda={isDayLoading ? [] : daySchedule.agenda}
          />

          <OngoingInterviewsPanel live={daySchedule.live} />

          <UpcomingInterviewsPanel interviews={daySchedule.upcoming} />

          <OfferLetterActivityChart activity={mapOfferLetterActivity(dashboard.offerLetterStats)} />
        </div>
      </div>
    </div>
  );
}
