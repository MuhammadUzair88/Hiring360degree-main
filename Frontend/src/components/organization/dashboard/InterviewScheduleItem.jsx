import React from "react";

/** One candidate row inside UpcomingInterviewsPanel. */
export default function InterviewScheduleItem({
  candidateName,
  roleLabel,
  stageLabel,
  avatarUrl,
  time,
  mode,
}) {
  return (
    <div className="self-stretch p-4 bg-secondary-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-4">
      

      <div className="flex-1 min-w-0 flex flex-col">
        <span className="text-slate-900 text-base leading-6 truncate">{candidateName}</span>
        <span className="text-zinc-600 text-xs font-medium leading-4 tracking-tight truncate">
          {roleLabel} • {stageLabel}
        </span>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-slate-900 text-sm font-bold leading-5 whitespace-nowrap">{time}</span>
        <span className="text-zinc-600 text-xs font-semibold leading-4 tracking-tight whitespace-nowrap">
          {mode}
        </span>
      </div>
    </div>
  );
}
