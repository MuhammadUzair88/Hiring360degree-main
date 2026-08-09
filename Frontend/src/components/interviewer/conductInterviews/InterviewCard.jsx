// src/components/interviewerDashboard/conductInterview/InterviewCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, User, Video, MessageSquare } from "lucide-react";
import { getStatusTone } from "./StatusTone";
import { STATUS } from "./data";

/** "14:30" -> "2:30 PM". Falls back to the raw string if parsing fails. */
function formatTime(timeStr) {
  if (!timeStr) return "N/A";
  if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) return timeStr;
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = String(minutes || 0).padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch {
    return timeStr;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * One candidate dossier in the roster grid. The whole card is a link to
 * the interview detail route (`/interviewers/conduct-interviews/:scheduleId`);
 * the "Join" button on a live interview stops that navigation and opens
 * the meeting link instead.
 */
export default function InterviewCard({ interview, onJoinInterview }) {
  const tone = getStatusTone(interview.statusBadge);
  const isOngoing = interview.statusBadge === STATUS.ONGOING;
  const isCompleted = interview.statusBadge === STATUS.COMPLETED;
  const feedbackSubmitted = interview.evaluationStatus === "Completed";

  const handleJoinClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onJoinInterview?.(interview);
  };

  return (
    <Link
      to={`/interviewers/conduct-interviews/${interview.scheduleId}`}
      state={{ interview }}
      className="relative bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 overflow-hidden flex flex-col p-6 gap-4 hover:outline-primary-400 transition-colors group"
    >
      <div className="w-28 h-28 -right-8 -top-14 absolute rounded-bl-full bg-primary-800/5" aria-hidden="true" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center shrink-0">
            <User size={16} className="text-primary-800" />
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-900 text-sm font-semibold group-hover:text-primary-800 transition-colors truncate">
              {interview.candidateName}
            </h3>
            <p className="text-black/50 text-xs font-medium truncate">{interview.jobTitle}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md outline outline-1 outline-offset-[-1px] flex items-center gap-1.5 shrink-0 ${tone.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} ${isOngoing ? "animate-pulse" : ""}`} />
          {tone.label}
        </span>
      </div>

      {/* Details */}
      <div className="relative pt-3 border-t border-secondary-300 space-y-2 text-xs font-medium">
        <div className="flex justify-between items-center">
          <span className="text-black/50">Stage</span>
          <span className="text-primary-800 bg-primary-50 px-2 py-0.5 rounded text-[11px] font-semibold outline outline-1 outline-offset-[-1px] outline-primary-200">
            {interview.assignedStage}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-black/50">Department</span>
          <span className="text-slate-900 truncate max-w-[150px]">{interview.department || "N/A"}</span>
        </div>

        {isCompleted && (
          <div className="flex justify-between items-center">
            <span className="text-black/50">Feedback</span>
            <span className={`text-[11px] font-semibold flex items-center gap-1 ${feedbackSubmitted ? "text-primary-800" : "text-black/50"}`}>
              <MessageSquare size={11} />
              {feedbackSubmitted ? "Submitted" : "Pending"}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative mt-auto pt-3 border-t border-secondary-300 flex items-center justify-between text-[11px] font-semibold text-black/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {formatDate(interview.interviewDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {formatTime(interview.interviewTime)}
          </span>
        </div>

        {isOngoing ? (
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-700 text-secondary-50 rounded-lg text-[10px] font-semibold uppercase hover:bg-primary-800 transition-colors"
          >
            <Video size={11} />
            Join
          </button>
        ) : (
          <div className="text-black/40 group-hover:text-primary-800 group-hover:translate-x-1 transition-all">
            <ArrowRight size={14} />
          </div>
        )}
      </div>
    </Link>
  );
}