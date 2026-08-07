// src/components/interviewerDashboard/conductInterview/FeedbackActionCard.jsx

import React from "react";
import { AlertCircle, CheckCircle2, MessageSquare, Eye } from "lucide-react";

/**
 * Two variants of the same card:
 *  - Pending: matches the Figma amber "Feedback Pending" card, using
 *    our warning-* tokens (that family is the theme's real "needs
 *    attention" signal, so this isn't a random color pick).
 *  - Submitted: same shape, success-* tokens, with a "view" action
 *    instead of "submit".
 * Only rendered once the interview is Completed — nothing to
 * evaluate before then.
 */
export default function FeedbackActionCard({ isSubmitted, onSubmitFeedback, onViewFeedback }) {
  if (isSubmitted) {
    return (
      <div className="self-stretch p-5 bg-success-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-success-200 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-success-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-success-700 text-base font-semibold leading-6">Feedback Submitted</p>
            <p className="text-success-700/80 text-sm leading-5">Your evaluation for this round has been recorded.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewFeedback}
          className="self-stretch py-2.5 bg-success-600 hover:bg-success-700 rounded-lg flex items-center justify-center gap-2 text-secondary-50 text-sm font-medium transition-colors"
        >
          <Eye size={15} /> View Submitted Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="self-stretch p-5 bg-warning-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-warning-200 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-warning-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-warning-700 text-base font-semibold leading-6">Feedback Pending</p>
          <p className="text-warning-700/80 text-sm leading-5">
            Action required: Feedback has not been submitted for this round.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSubmitFeedback}
        className="self-stretch py-2.5 bg-warning-600 hover:bg-warning-700 rounded-lg flex items-center justify-center gap-2 text-secondary-50 text-sm font-medium transition-colors"
      >
        <MessageSquare size={15} /> Submit Evaluation Now
      </button>
    </div>
  );
}