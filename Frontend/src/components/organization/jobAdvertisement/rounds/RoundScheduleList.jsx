import React from "react";
import { Mail, Edit3, Trash2, FileText, Loader2, Eye, Lightbulb } from "lucide-react";
import { formatTimeDisplay } from "./utils";

function UpcomingCard({ item, isSending, onNotify, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs font-mono border-b border-secondary-300 pb-2">
        <span className="text-gray-500 font-semibold">
          {item.date} • {formatTimeDisplay(item.time)}
        </span>
        {item.notified ? (
          <span className="text-success-700 font-semibold text-[10px] bg-success-50 px-2 py-1 rounded-md">Sent</span>
        ) : (
          <span className="text-warning-700 font-semibold text-[10px] bg-warning-50 px-2 py-1 rounded-md">Pending</span>
        )}
      </div>
      <div className="text-sm">
        <p className="font-semibold text-slate-900 truncate">{item.candidateName}</p>
        <p className="text-gray-500 text-xs truncate mt-0.5">Interviewer: {item.interviewerName}</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onNotify(item.id)}
          disabled={isSending}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            isSending
              ? "bg-secondary-300 text-gray-500 cursor-not-allowed"
              : item.notified
              ? "bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 hover:text-primary-800"
              : "bg-primary-800 text-white hover:bg-primary-700"
          }`}
        >
          {isSending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5" /> {item.notified ? "Resend" : "Notify"}
            </>
          )}
        </button>
        <button type="button" onClick={() => onEdit(item)} disabled={isSending} className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-gray-700 hover:text-primary-800 transition-colors disabled:opacity-50">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onDelete(item.id)} disabled={isSending} className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-600 hover:text-white transition-colors disabled:opacity-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ReviewCard({ item, onOpenFeedback }) {
  const hasFeedback = item.feedbackEvaluation === "Completed";
  const isDecided = item.passed !== null;

  let badgeClass = "bg-warning-500 text-white";
  let badgeLabel = "Awaiting Feedback";
  if (isDecided) {
    badgeClass = item.passed ? "bg-success-500 text-white" : "bg-danger-500 text-white";
    badgeLabel = item.passed ? "Moved Forward" : "Rejected";
  } else if (hasFeedback) {
    badgeClass = "bg-info-500 text-white";
    badgeLabel = "Feedback Ready";
  }

  return (
    <div className="p-4 bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs font-mono border-b border-secondary-300 pb-2">
        <span className="text-gray-500 font-medium">
          {item.date} • {formatTimeDisplay(item.time)}
        </span>
        <span className={`px-2 py-1 rounded-md font-bold text-[10px] uppercase ${badgeClass}`}>{badgeLabel}</span>
      </div>
      <div className="text-sm">
        <p className="font-semibold text-slate-900 truncate">{item.candidateName}</p>
        <p className="text-gray-500 text-xs truncate mt-0.5">Interviewer: {item.interviewerName}</p>
      </div>

      {isDecided ? (
        <div className={`w-full py-2 rounded-lg text-xs font-semibold text-center ${item.passed ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"}`}>
          {item.passed ? "Moved Forward" : "Rejected"}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpenFeedback(item)}
          className={`w-full py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            hasFeedback ? "bg-info-50 hover:bg-info-100 text-info-700" : "bg-warning-50 hover:bg-warning-100 text-warning-700"
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> {hasFeedback ? "View Feedback & Decide" : "Waiting for Feedback"}
        </button>
      )}
    </div>
  );
}

export default function RoundScheduleList({ roundName, activeTab, onTabChange, upcomingInterviews, reviewInterviews, sendingEmailIds, onNotify, onEdit, onDelete, onOpenFeedback }) {
  return (
    <div className="w-full lg:w-[30%] bg-secondary-50 rounded-2xl p-6 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5 max-h-[36rem] lg:max-h-none">
      <div className="border-b border-secondary-300 pb-4">
        <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">{roundName} Schedule</h3>
        <div className="grid grid-cols-2 mt-3 p-1 bg-secondary-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => onTabChange("upcoming")}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === "upcoming" ? "bg-secondary-50 shadow-sm text-primary-800" : "text-gray-500 hover:text-gray-700"}`}
          >
            Upcoming
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "upcoming" ? "bg-primary-800 text-white" : "bg-secondary-200"}`}>{upcomingInterviews.length}</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("review")}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === "review" ? "bg-secondary-50 shadow-sm text-primary-800" : "text-gray-500 hover:text-gray-700"}`}
          >
            Review
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "review" ? "bg-primary-800 text-white" : "bg-secondary-200"}`}>{reviewInterviews.length}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {activeTab === "upcoming" &&
          (upcomingInterviews.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 italic border border-dashed border-secondary-300 rounded-xl h-32 flex items-center justify-center">
              No upcoming interviews scheduled.
            </div>
          ) : (
            upcomingInterviews.map((item) => (
              <UpcomingCard key={item.id} item={item} isSending={sendingEmailIds.has(item.id)} onNotify={onNotify} onEdit={onEdit} onDelete={onDelete} />
            ))
          ))}

        {activeTab === "review" &&
          (reviewInterviews.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 italic border border-dashed border-secondary-300 rounded-xl h-32 flex flex-col items-center justify-center gap-2">
              <FileText className="w-5 h-5 opacity-40" />
              No completed interviews yet.
            </div>
          ) : (
            reviewInterviews.map((item) => <ReviewCard key={item.id} item={item} onOpenFeedback={onOpenFeedback} />)
          ))}
      </div>

      <div className="p-4 bg-primary-800 rounded-xl flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-white shrink-0 mt-0.5" />
        <p className="text-white/90 text-xs leading-5">
          Tuesday and Wednesday mornings tend to get the fastest interviewer responses — worth keeping in mind
          when picking a slot.
        </p>
      </div>
    </div>
  );
}