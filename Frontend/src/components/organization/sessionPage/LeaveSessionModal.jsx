import React from "react";
import { PhoneOff } from "lucide-react";

/**
 * "Leave interview?" confirmation. Same copy and same two actions
 * (Stay / Leave) as the original screen.
 */
export default function LeaveSessionModal({ onCancel, onConfirm }) {
  return (
    <div className="app-drawer-backdrop flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
        <div className="w-14 h-14 rounded-full bg-danger-50 flex items-center justify-center mb-4">
          <PhoneOff size={26} className="text-danger-600" />
        </div>
        <h3 className="text-h6 font-semibold text-slate-900 mb-2">Leave Interview?</h3>
        <p className="text-sm text-neutral-600 mb-6">You can rejoin if the interview is still ongoing.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-slate-900 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-danger-600 hover:bg-danger-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}