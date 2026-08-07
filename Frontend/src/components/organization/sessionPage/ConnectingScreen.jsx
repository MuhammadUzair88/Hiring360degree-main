import React from "react";
import { Radio, ShieldCheck } from "lucide-react";

/**
 * Full-screen "joining session" state. Carries the same information as the
 * original loading screen (who's joining, that a retry may be happening) -
 * just restyled to match the app's light card + progress motif.
 */
export default function ConnectingScreen({ name, retryAttempt = 0, maxRetries = 0 }) {
  return (
    <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 rounded-full bg-primary-700/10 flex items-center justify-center mb-6">
            <Radio size={32} className="text-primary-700 animate-pulse" />
            <span className="absolute inset-0 rounded-full border-2 border-primary-700/20" />
          </div>

          <p className="text-slate-900 font-semibold mb-1">Joining session...</p>
          <p className="text-sm text-neutral-600 mb-6">
            Setting up a secure interview environment for {name}. This won&apos;t take long.
          </p>

          <div className="w-full h-2 rounded-full bg-info-100 overflow-hidden mb-3">
            <div className="h-full w-1/3 rounded-full bg-primary-700 animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-widest text-primary-700 font-semibold">
            Connecting to server
          </span>

          {retryAttempt > 0 && (
            <p className="text-xs text-warning-600 mt-3">
              Retrying connection ({retryAttempt}/{maxRetries})...
            </p>
          )}

          <div className="w-full pt-4 mt-4 border-t border-secondary-300 flex items-center justify-center gap-2 text-neutral-600">
            <ShieldCheck size={16} />
            <span className="text-xs">End-to-end encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}