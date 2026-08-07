// src/components/interviewerDashboard/conductInterview/InterviewStatusDrawer.jsx

import React from "react";
import { Link } from "react-router-dom";
import { X, Clock, Video, CheckCircle2, MessageSquare } from "lucide-react";
import { STATUS } from "./data";

const DRAWER_CONFIG = {
  [STATUS.UPCOMING]: {
    title: "Upcoming Schedules",
    description: "Assigned sessions awaiting stream activation.",
    icon: Clock,
    iconBadge: "bg-primary-50 text-primary-700",
    emptyMessage: "No upcoming sessions found.",
  },
  [STATUS.ONGOING]: {
    title: "Live Interviews",
    description: "Interviews currently in progress.",
    icon: Video,
    iconBadge: "bg-primary-800 text-secondary-50",
    emptyMessage: "No live sessions right now.",
  },
  [STATUS.COMPLETED]: {
    title: "Completed History",
    description: "Finished sessions waiting on scorecard evaluation.",
    icon: CheckCircle2,
    iconBadge: "bg-primary-100 text-primary-800",
    emptyMessage: "No completed sessions logged.",
  },
};

function formatDateTime(dateStr, timeStr) {
  const date = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "N/A";
  if (!timeStr) return date;
  if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
    return `${date} • ${timeStr}`;
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes || 0).padStart(2, "0");
  return `${date} • ${displayHours}:${displayMinutes} ${period}`;
}

/**
 * A single drawer component that renders the Upcoming / Ongoing /
 * Completed table view depending on `type`. This replaces the old
 * pattern of one bespoke modal per status — add a new status by
 * extending DRAWER_CONFIG, not by writing a new file.
 */
export default function InterviewStatusDrawer({ type, interviews, onClose, onJoinInterview }) {
  const config = DRAWER_CONFIG[type] || DRAWER_CONFIG[STATUS.UPCOMING];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0px_20px_40px_-8px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="p-5 border-b border-secondary-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.iconBadge}`}>
              <Icon size={16} />
            </span>
            <div>
              <h3 className="text-slate-900 text-lg font-semibold leading-tight">{config.title}</h3>
              <p className="text-black/50 text-xs font-medium">{config.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-black/50 hover:text-slate-900 hover:bg-secondary-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-secondary-300 text-black/50 uppercase text-[10px] font-semibold tracking-wide">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Round &amp; Position</th>
                <th className="pb-3">
                  {type === STATUS.COMPLETED ? "Feedback" : "Timing"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-300/60">
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-black/50 italic">
                    {config.emptyMessage}
                  </td>
                </tr>
              ) : (
                interviews.map((item) => (
                  <tr key={item.scheduleId} className="text-slate-900 hover:bg-secondary-100 transition-colors">
                    <td className="py-3.5 font-semibold">
                      <Link to={`/interviewers/conduct-interviews/${item.scheduleId}`} state={{ interview: item }} className="hover:text-primary-800">
                        {item.candidateName}
                      </Link>
                    </td>
                    <td className="py-3.5 text-black/60 font-medium">
                      <div>{item.jobTitle}</div>
                      <span className="text-[10px] font-semibold text-primary-800 block mt-0.5">
                        {item.assignedStage}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {type === STATUS.UPCOMING && (
                        <span className="flex items-center gap-1.5 font-medium text-black/60">
                          <Clock size={13} /> {formatDateTime(item.interviewDate, item.interviewTime)}
                        </span>
                      )}

                      {type === STATUS.ONGOING && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary-800 text-secondary-50">
                            <span className="w-1.5 h-1.5 bg-secondary-50 rounded-full animate-pulse" />
                            In Progress
                          </span>
                          {onJoinInterview && (
                            <button
                              type="button"
                              onClick={() => onJoinInterview(item)}
                              className="px-2 py-0.5 bg-primary-700 text-secondary-50 rounded text-[10px] font-semibold uppercase hover:bg-primary-800 transition-colors"
                            >
                              Join
                            </button>
                          )}
                        </div>
                      )}

                      {type === STATUS.COMPLETED && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide outline outline-1 outline-offset-[-1px] ${
                            item.evaluationStatus === "Completed"
                              ? "bg-primary-100 text-primary-800 outline-primary-300"
                              : "bg-secondary-200 text-black/60 outline-secondary-300"
                          }`}
                        >
                          {item.evaluationStatus === "Completed" ? (
                            <>
                              <CheckCircle2 size={11} /> Feedback Submitted
                            </>
                          ) : (
                            <>
                              <MessageSquare size={11} /> Feedback Pending
                            </>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}