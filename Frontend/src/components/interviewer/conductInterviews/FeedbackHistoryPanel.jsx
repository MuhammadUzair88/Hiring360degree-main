// src/components/interviewerDashboard/conductInterview/FeedbackHistoryPanel.jsx

import React from "react";
import { MessageSquare, Target, Users } from "lucide-react";

// Recommendation tone: this is a real hire/no-hire signal, so it
// legitimately uses the theme's success/warning/danger tokens rather
// than primary — same reasoning as FeedbackActionCard.
function toneForRecommendation(recommendation) {
  if (recommendation === "Strong Hire" || recommendation === "Hire") {
    return "bg-success-50 text-success-700";
  }
  if (recommendation === "No Hire") {
    return "bg-danger-50 text-danger-600";
  }
  return "bg-warning-50 text-warning-700";
}

export default function FeedbackHistoryPanel({ feedbacks = [] }) {
  if (feedbacks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-12">
        <MessageSquare size={32} className="text-black/20" />
        <div className="text-center">
          <p className="text-black/50 text-sm font-medium">No prior feedback</p>
          <p className="text-black/40 text-xs mt-1">This is the first interview round.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 bg-secondary-100 overflow-y-auto flex flex-col gap-4">
      {feedbacks.map((fb, index) => (
        <div key={index} className="bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneForRecommendation(fb.recommendation)}`}>
                <Target size={14} />
              </span>
              <div>
                <p className="text-slate-900 text-sm font-bold">{fb.round}</p>
                <p className="text-black/50 text-[10px] flex items-center gap-1">
                  <Users size={10} /> {fb.interviewer}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-primary-800 text-lg font-black">{fb.rating}</span>
              {fb.recommendation && (
                <p className="text-[10px] font-bold uppercase text-black/60">{fb.recommendation}</p>
              )}
            </div>
          </div>
          <div className="bg-secondary-100 rounded-lg p-3">
            <p className="text-black/60 text-xs italic leading-relaxed">&ldquo;{fb.remarks}&rdquo;</p>
          </div>
        </div>
      ))}
    </div>
  );
}