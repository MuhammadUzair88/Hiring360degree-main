// src/components/interviewerDashboard/evaluation/FinalRecommendationCard.jsx

import React from "react";
import { ShieldCheck, SendHorizontal, Loader2 } from "lucide-react";

export default function FinalRecommendationCard({
  options,
  recommendation,
  onRecommendationChange,
  finalComments,
  onFinalCommentsChange,
  readOnly,
  submitting,
  onSubmit,
}) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
      <h3 className="text-xl font-semibold text-slate-900">Final Recommendation</h3>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = recommendation === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={readOnly}
              onClick={() => onRecommendationChange(option.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold border transition-colors ${
                readOnly ? "cursor-not-allowed opacity-80" : "cursor-pointer"
              } ${
                isSelected
                  ? "bg-primary-50 border-primary-800 text-primary-800"
                  : "bg-white border-slate-300 text-slate-900 hover:border-primary-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base font-semibold text-slate-900">Final Comments</label>
        <textarea
          rows={4}
          disabled={readOnly}
          value={finalComments}
          onChange={(e) => onFinalCommentsChange(e.target.value)}
          placeholder="Provide a summary of your decision and any next steps recommended for the hiring committee."
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-primary-800 focus:ring-1 focus:ring-primary-800 transition-colors resize-none disabled:bg-slate-50 disabled:opacity-80 disabled:cursor-not-allowed"
        />
      </div>

      {readOnly ? (
        <div className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-600 font-semibold rounded-xl text-center text-sm flex items-center justify-center gap-2">
          <ShieldCheck size={16} /> Submitted to HR Records
        </div>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="w-full py-3.5 bg-primary-800 hover:bg-primary-900 disabled:bg-primary-800/50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <SendHorizontal size={16} /> Submit Finalized Evaluation
            </>
          )}
        </button>
      )}
    </div>
  );
}
