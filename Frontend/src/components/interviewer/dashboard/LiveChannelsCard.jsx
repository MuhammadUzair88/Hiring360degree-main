import React from "react";
import { ExternalLink, Radio } from "lucide-react";
import { liveInterviews as defaultLiveInterviews } from "./data";

/** Sidebar card listing interviews that are live right now, with a one-click join. */
export default function LiveChannelsCard({ interviews = defaultLiveInterviews, onJoin }) {
  const handleJoin = (interview) => {
    if (onJoin) {
      onJoin(interview);
    } else if (interview.joinLink) {
      window.open(interview.joinLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-secondary-300/60 flex items-center justify-between shrink-0">
        <h3 className="text-slate-900 text-sm font-semibold">Live Active Channels</h3>
        {interviews.length > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-800 text-secondary-50 text-[10px] font-bold">
            <Radio size={10} className="animate-pulse" /> LIVE
          </span>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {interviews.length > 0 ? (
          interviews.map((item) => (
            <div
              key={item.scheduleId}
              className="p-3.5 rounded-lg bg-primary-50 outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col gap-2.5"
            >
              <div>
                <h4 className="text-slate-900 text-xs font-semibold">{item.candidateName}</h4>
                <p className="text-primary-800 text-[11px] font-semibold">{item.jobTitle}</p>
                <p className="text-zinc-600 text-[10px] font-medium mt-1">
                  {item.interviewTime} • {item.roundName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleJoin(item)}
                className="w-full py-2 bg-primary-800 hover:bg-primary-900 text-secondary-50 text-[11px] font-bold rounded-lg uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Join Interview <ExternalLink size={12} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <p className="text-zinc-600 text-xs italic">No live active interview channels detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
