// src/components/interviewerDashboard/conductInterview/CandidateDetailTopBar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Bell, Settings, Video, User } from "lucide-react";

// Header badge tones. Deliberately distinct from the roster's
// primary-only STATUS_TONE: this badge answers "is it safe to join
// right now", so Ongoing genuinely borrows the theme's success tokens
// (the "good / live" signal the CSS reserves for exactly this),
// instead of a primary shade that wouldn't read as urgent.
const HEADER_STATUS_TONE = {
  Upcoming: "bg-primary-50 text-primary-700 outline-primary-200",
  Ongoing: "bg-success-100 text-success-700 outline-success-200",
  Completed: "bg-primary-100 text-primary-800 outline-primary-300",
  "No Show": "bg-secondary-200 text-black/60 outline-secondary-300",
};

export default function CandidateDetailTopBar({ candidate, roundLabel, canJoin, onJoinInterview, backTo }) {
  const [search, setSearch] = useState("");
  const badgeTone = HEADER_STATUS_TONE[candidate.status] || HEADER_STATUS_TONE.Upcoming;

  return (
    <div className="self-stretch h-16 px-4 sm:px-6 bg-secondary-50 border-b border-secondary-300 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          to={backTo}
          aria-label="Back to interviews"
          className="p-2 -ml-1 rounded-full text-slate-900 hover:bg-secondary-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2 shrink-0"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center shrink-0">
            <User size={16} className="text-primary-800" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-slate-900 text-lg font-semibold leading-4 truncate">{candidate.candidateName}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide outline outline-1 outline-offset-[-1px] shrink-0 ${badgeTone}`}>
                {candidate.status}
              </span>
            </div>
            <p className="text-gray-700 text-xs font-medium tracking-tight truncate">{roundLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources..."
            className="w-56 lg:w-64 pl-10 pr-4 py-2 bg-secondary-50 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
          />
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button type="button" aria-label="Notifications" className="text-gray-700 hover:text-primary-800 transition-colors">
            <Bell size={18} />
          </button>
          <button type="button" aria-label="Settings" className="text-gray-700 hover:text-primary-800 transition-colors">
            <Settings size={18} />
          </button>
        </div>

        {canJoin && (
          <button
            type="button"
            onClick={onJoinInterview}
            className="px-4 sm:px-5 py-2 bg-primary-700 hover:bg-primary-800 rounded-lg flex items-center gap-2 transition-colors shrink-0"
          >
            <Video size={16} className="text-secondary-50" />
            <span className="text-secondary-50 text-sm font-medium leading-6 hidden sm:inline">Join Interview Room</span>
          </button>
        )}
      </div>
    </div>
  );
}