import React from "react";

/** Live-interview status for the day selected on ScheduleCalendar. */
export default function OngoingInterviewsPanel({ live }) {
  return (
    <div className="p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-3">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-600">
        Ongoing Interviews
      </span>

      {live ? (
        <div className="p-3.5 rounded-lg bg-primary-50 outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-primary-800 text-secondary-50 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-50 animate-pulse" />
              LIVE
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-600">{live.elapsed}</span>
          </div>

          <div>
            <h5 className="text-slate-900 text-xs font-semibold">{live.candidateName}</h5>
            <span className="text-zinc-600 text-[11px] block">{live.roleLabel}</span>
          </div>

          <div className="pt-2 border-t border-primary-200 flex items-center justify-between gap-2">
            <span className="text-zinc-600 text-[10px] font-medium truncate">{live.stageLabel}</span>
            <button
              type="button"
              className="shrink-0 px-3 py-1 rounded-md bg-primary-800 text-secondary-50 text-[10px] font-bold hover:bg-primary-900 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-600 text-xs py-1">No active streams today.</p>
      )}
    </div>
  );
}