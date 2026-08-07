import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewerHeader from "./InterviewerHeader";
import StatMetricsOverview from "./StatMetricsOverview";
import InterviewSessionsChart from "./InterviewSessionsChart";
import ScheduleCalendar from "./ScheduleCalendar";
import DaySchedulePanel from "./DaySchedulePanel";
import RecentInterviewsTable from "./RecentInterviewsTable";
import LiveChannelsCard from "./LiveChannelsCard";
import { organizationProfile, interviewerProfile, scheduleByDay, scheduleDefaultDay } from "./data";

const EMPTY_DAY = { agenda: [] };

/**
 * Interviewer Dashboard Overview — the single place every dashboard
 * component gets composed. Runs entirely on the dummy data exported
 * from ./data.js today; when the real API is wired up, only this file
 * (and data.js) needs to change to fetch and pass down live values —
 * every child component below stays exactly the same.
 */
export default function InterviewerDashboardOverview() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(scheduleDefaultDay);

  const markedDays = useMemo(() => Object.keys(scheduleByDay).map(Number), []);
  const daySchedule = scheduleByDay[selectedDay] ?? EMPTY_DAY;

  const handleViewDetails = (interview) => {
    navigate(`/interviewers/conduct/${interview.scheduleId}`, { state: { interview } });
  };

  return (
    <div className="w-full flex flex-col gap-6">

      <InterviewerHeader organization={organizationProfile} interviewer={interviewerProfile} />

      <StatMetricsOverview />

      {/* Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <InterviewSessionsChart />
        </div>

        <div className="flex flex-col gap-6">
          <ScheduleCalendar
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            markedDays={markedDays}
          />
          <DaySchedulePanel day={selectedDay} agenda={daySchedule.agenda} />
        </div>
      </div>

      {/* Recent schedule table + live channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RecentInterviewsTable onViewDetails={handleViewDetails} />
        </div>

        <div>
          <LiveChannelsCard />
        </div>
      </div>

    </div>
  );
}
