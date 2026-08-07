import React from "react";
import { scheduleCalendarMonth } from "./data";

function formatDayLabel(day, year, monthIndex) {
  if (!day) return "";
  return new Date(year, monthIndex, day).toLocaleDateString("default", { month: "short", day: "numeric" });
}

/** List of interview agenda items for the day selected on ScheduleCalendar. */
export default function DaySchedulePanel({
  day,
  agenda = [],
  year = scheduleCalendarMonth.year,
  monthIndex = scheduleCalendarMonth.monthIndex,
}) {
  return (
    <div className="p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-3">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-600">
        Schedule — {formatDayLabel(day, year, monthIndex)}
      </span>

      {agenda.length > 0 ? (
        <div className="flex flex-col gap-3">
          {agenda.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <span className="w-16 shrink-0 text-[10px] font-mono font-bold text-zinc-600 mt-0.5">
                {item.time}
              </span>
              <div className="flex-1 pl-3 border-l-2 border-primary-700">
                <h5 className="text-slate-900 text-xs font-semibold leading-tight">{item.title}</h5>
                <span className="text-zinc-600 text-[11px]">{item.details}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-600 text-xs py-1">No interviews scheduled for this day.</p>
      )}
    </div>
  );
}
