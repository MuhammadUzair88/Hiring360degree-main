import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Full-screen connection-failed state. Same two recovery actions as the
 * original screen: Retry (reloads) and Back (navigates away).
 */
export default function ConnectionErrorScreen({ message, onRetry, onBack }) {
  return (
    <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-danger-600" />
        </div>
        <h2 className="text-h6 font-semibold text-slate-900 mb-2">Connection Failed</h2>
        <p className="text-sm text-neutral-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 bg-primary-700 hover:bg-primary-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-slate-900 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}