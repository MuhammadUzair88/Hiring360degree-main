// src/components/interviewerDashboard/conductInterview/InterviewFilterBar.jsx

import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { STATUS } from "./data";

const STATUS_OPTIONS = ["All", STATUS.UPCOMING, STATUS.ONGOING, STATUS.COMPLETED];

/**
 * Search input + status dropdown for the interview roster below.
 * Fully controlled — ConductInterviewOverview owns `search` /
 * `statusFilter` state and passes values + setters down, so this
 * component has no idea how filtering is actually applied.
 */
export default function InterviewFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div className="self-stretch p-4 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex-1 min-w-0 sm:min-w-60 relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search assigned candidates or roles..."
          className="w-full pl-10 pr-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
        />
      </div>

      <div className="relative shrink-0">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          aria-label="Filter by status"
          className="w-full sm:w-44 appearance-none pl-4 pr-10 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-xs font-semibold uppercase tracking-wide text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Statuses" : status}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}