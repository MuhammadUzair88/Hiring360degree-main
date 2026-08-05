import React from "react";

/** One compact row inside the sidebar's UpcomingInterviewsPanel. */
export default function UpcomingScheduleItem({ candidateName, roleLabel, time }) {
  const initials = candidateName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2.5 py-2.5">
      <span className="w-7 h-7 shrink-0 rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold flex items-center justify-center">
        {initials}
      </span>
      <div className="flex-1 min-w-0">
        <h5 className="text-slate-900 text-xs font-semibold truncate">{candidateName}</h5>
        <span className="text-zinc-600 text-[11px] truncate block">{roleLabel}</span>
      </div>
      <span className="text-zinc-600 text-[10px] font-mono font-bold shrink-0">{time}</span>
    </div>
  );
}