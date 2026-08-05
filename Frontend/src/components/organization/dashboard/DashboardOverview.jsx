import React, { useMemo, useState } from "react";
import DashboardGreetingBanner from "./DashboardGreetingBanner";
import StatMetricsOverview from "./StatMetricsOverview";
import ApplicationsTrendChart from "./ApplicationsTrendChart";
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
import { scheduleByDay, scheduleDefaultDay } from "./data";

const EMPTY_DAY = { agenda: [], live: null, upcoming: [] };

export default function DashboardOverview() {
  const [selectedDay, setSelectedDay] = useState(scheduleDefaultDay);

  const daySchedule = scheduleByDay[selectedDay] ?? EMPTY_DAY;
  const markedDays = useMemo(() => Object.keys(scheduleByDay).map(Number), []);

  return (
    <div className="w-full flex flex-col gap-6">

      <DashboardGreetingBanner />

      <StatMetricsOverview />

      {/* Applications Trend + Job Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3">
          <ApplicationsTrendChart />
        </div>
        <div className="lg:col-span-2">
          <JobCategoryDistributionChart />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

        {/* ── Main column (75%) ── */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          <HiringPerformanceChart />

          <RecentApplications />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PanelistWorkloadCard />
            <QuickActionsPanel />
          </div>

        </div>

        {/* ── Calendar sidebar (25%) ── */}
        <div className="xl:col-span-1 flex flex-col gap-6">

          <ScheduleCalendar
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            markedDays={markedDays}
          />

          <DaySchedulePanel day={selectedDay} agenda={daySchedule.agenda} />

          <OngoingInterviewsPanel live={daySchedule.live} />

          <UpcomingInterviewsPanel interviews={daySchedule.upcoming} />

          <OfferLetterActivityChart />

        </div>

      </div>

    </div>
  );
}