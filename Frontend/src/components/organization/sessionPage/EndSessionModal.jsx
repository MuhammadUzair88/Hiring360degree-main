import React from "react";
import { LogOut, Loader2 } from "lucide-react";

/**
 * "End interview session?" confirmation - host only. Same copy, same
 * pending/loading state on the confirm button as the original screen.
 */
export default function EndSessionModal({ isEndingSession, onCancel, onConfirm }) {
  return (
    <div className="app-drawer-backdrop flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <LogOut size={30} className="text-danger-600" />
        </div>
        <h3 className="text-h6 font-semibold text-slate-900 mb-2">End Interview Session?</h3>
        <p className="text-sm text-neutral-600 mb-1">This will end the interview for both you and the candidate.</p>
        <p className="text-xs text-neutral-500 mb-6">Both participants will be redirected to the home page.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isEndingSession}
            className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-slate-900 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isEndingSession}
            className="flex-1 bg-danger-600 hover:bg-danger-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isEndingSession ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Ending...
              </>
            ) : (
              "End Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}