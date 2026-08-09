import React from "react";
import UpcomingScheduleItem from "./UpcomingScheduleItem";

/** Compact list of upcoming interviews for the day selected on ScheduleCalendar. */
export default function UpcomingInterviewsPanel({ interviews = [] }) {
  return (
    <div className="p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-600">Upcoming</span>

      {interviews.length > 0 ? (
        <div className="flex flex-col divide-y divide-secondary-300/60">
          {interviews.map((item) => (
            <UpcomingScheduleItem key={item.id || item.callId || `${item.candidateName}-${item.time}`} {...item} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-600 text-xs py-1">No upcoming interviews.</p>
      )}
    </div>
  );
}