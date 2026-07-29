import React from "react";
import { AlertTriangle, X } from "lucide-react";
import CandidateStatusBadge from "./CandidateStatusBadge";

export default function RejectCandidateModal({ candidate, isSubmitting, onClose, onConfirm }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-secondary-50 rounded-2xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="w-14 h-14 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </span>
          <div>
            <h3 className="text-slate-900 text-lg font-semibold">Reject candidate?</h3>
            <p className="text-gray-500 text-sm mt-1">This removes them from every stage of the pipeline.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-slate-900 text-sm font-semibold truncate">{candidate.name}</p>
            <p className="text-gray-500 text-xs truncate">{candidate.email}</p>
          </div>
          <CandidateStatusBadge status={candidate.status} />
        </div>

        <p className="text-danger-600/80 text-xs text-center">This action cannot be undone.</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 text-sm font-medium hover:bg-secondary-100 transition-colors"
          >
            Keep Candidate
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-danger-600 text-white text-sm font-medium hover:bg-danger-700 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {isSubmitting ? "Rejecting…" : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}