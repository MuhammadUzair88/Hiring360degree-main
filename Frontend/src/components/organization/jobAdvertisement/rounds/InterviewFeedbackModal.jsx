import React from "react";
import { X, User, Star, CheckCircle2, XCircle, ThumbsDown, ArrowRight, FastForward } from "lucide-react";

const RATING_ROWS = [
  { key: "technicalSkills", label: "Technical Skills" },
  { key: "problemSolving", label: "Problem Solving" },
  { key: "communication", label: "Communication" },
  { key: "behavioralSkills", label: "Behavioral Skills" },
  { key: "culturalFit", label: "Cultural Fit" },
];

function recommendationClass(recommendation) {
  if (recommendation === "Strong Hire" || recommendation === "Hire") return "bg-success-50 text-success-700";
  if (recommendation === "No Hire") return "bg-danger-50 text-danger-700";
  return "bg-warning-50 text-warning-700";
}

export default function InterviewFeedbackModal({ schedule, isLastRound, onClose, onAccept, onReject, onDirectOffer }) {
  if (!schedule) return null;

  const hasFeedback = Boolean(schedule.feedback?.ratings);
  const isDecided = schedule.passed !== null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-secondary-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-secondary-300">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-800/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-800" />
            </span>
            <div>
              <h3 className="text-slate-900 text-base font-semibold">Interviewer Feedback</h3>
              <p className="text-gray-500 text-xs">{schedule.candidateName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-secondary-200 hover:text-slate-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!hasFeedback ? (
            <div className="text-center py-12">
              <Star className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
              <p className="text-sm text-gray-700 font-semibold">No feedback submitted yet</p>
              <p className="text-xs text-gray-400 mt-1">The interviewer hasn't submitted their evaluation.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 p-4 bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300">
                <span className="w-9 h-9 rounded-full bg-primary-800/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-800" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{schedule.interviewerName}</p>
                  <p className="text-xs text-gray-500">Interviewer</p>
                </div>
              </div>

              <div className="bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-3">Performance Ratings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RATING_ROWS.map((row) => {
                    const value = schedule.feedback.ratings[row.key] || 0;
                    return (
                      <div key={row.key} className="flex items-center justify-between bg-secondary-50 rounded-lg px-3 py-2.5 outline outline-1 outline-offset-[-1px] outline-secondary-300">
                        <span className="text-xs text-gray-500">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3 h-3 ${star <= value ? "text-warning-500 fill-current" : "text-secondary-300"}`} />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-primary-800 w-6 text-right">{value}/5</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {schedule.feedback.coreStrengths && (
                <div>
                  <h4 className="text-[10px] font-bold text-success-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Strengths
                  </h4>
                  <div className="bg-success-50 outline outline-1 outline-offset-[-1px] outline-success-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{schedule.feedback.coreStrengths}</p>
                  </div>
                </div>
              )}

              {schedule.feedback.areasForImprovement && (
                <div>
                  <h4 className="text-[10px] font-bold text-warning-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <XCircle className="w-3 h-3" /> Areas for Improvement
                  </h4>
                  <div className="bg-warning-50 outline outline-1 outline-offset-[-1px] outline-warning-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{schedule.feedback.areasForImprovement}</p>
                  </div>
                </div>
              )}

              {schedule.feedback.recommendation && (
                <div className="flex items-center justify-between bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-4">
                  <span className="text-xs font-bold text-gray-500 uppercase">Interviewer's Recommendation</span>
                  <span className={`text-sm font-bold uppercase px-3 py-1 rounded-lg ${recommendationClass(schedule.feedback.recommendation)}`}>
                    {schedule.feedback.recommendation}
                  </span>
                </div>
              )}

              {schedule.feedback.finalComments && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Additional Comments</h4>
                  <div className="bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{schedule.feedback.finalComments}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {hasFeedback && !isDecided && (
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch gap-2.5 px-6 py-4 border-t border-secondary-300">
            <button
              type="button"
              onClick={() => onReject(schedule.id)}
              className="flex-1 py-3 bg-danger-50 hover:bg-danger-600 hover:text-white text-danger-600 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> Reject
            </button>
            <button
              type="button"
              onClick={() => onDirectOffer(schedule.id)}
              className="flex-1 py-3 bg-info-50 hover:bg-info-600 hover:text-white text-info-700 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" /> Direct Offer Letter
            </button>
            <button
              type="button"
              onClick={() => onAccept(schedule.id)}
              className="flex-1 py-3 bg-success-500 hover:bg-success-600 text-white rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              {isLastRound ? "Accept & Send Offer" : "Accept & Continue"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isDecided && (
          <div className="shrink-0 px-6 py-4 border-t border-secondary-300">
            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold ${schedule.passed ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"}`}>
              {schedule.passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Candidate Moved Forward
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Candidate Rejected
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}