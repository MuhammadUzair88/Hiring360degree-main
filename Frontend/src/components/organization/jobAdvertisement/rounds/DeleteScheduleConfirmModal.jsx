import React from "react";
import { AlertCircle } from "lucide-react";

export default function DeleteScheduleConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-secondary-50 rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-danger-600" />
        </div>
        <h3 className="text-slate-900 text-base font-semibold mb-2">Delete this schedule?</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">This can't be undone — you'll need to schedule this candidate again from scratch.</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-semibold text-gray-700 hover:bg-secondary-100 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger-50 text-danger-600 text-sm font-semibold hover:bg-danger-600 hover:text-white transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}