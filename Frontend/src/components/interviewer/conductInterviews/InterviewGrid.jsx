// src/components/interviewerDashboard/conductInterview/InterviewGrid.jsx

import React from "react";
import { Inbox, RefreshCw } from "lucide-react";
import InterviewCard from "./InterviewCard";

/**
 * Responsive card grid for the roster. Presentational only — it
 * receives the already-filtered list and just renders it, so
 * ConductInterviewOverview stays the one place that owns filtering.
 */
export default function InterviewGrid({ interviews, loading, hasActiveFilters, onJoinInterview }) {
  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-primary-700 w-6 h-6" />
        <span className="text-xs font-semibold uppercase tracking-widest text-black/50">
          Loading assigned roster...
        </span>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-12 text-center flex flex-col items-center justify-center gap-2">
        <Inbox size={28} className="text-black/30" />
        <p className="text-slate-900 text-xs font-semibold uppercase tracking-wide">
          No candidates match these filters
        </p>
        <p className="text-black/50 text-[11px]">
          {hasActiveFilters ? "Try adjusting your search or status filter." : "No interviews assigned yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((item) => (
        <InterviewCard key={item.scheduleId} interview={item} onJoinInterview={onJoinInterview} />
      ))}
    </div>
  );
}