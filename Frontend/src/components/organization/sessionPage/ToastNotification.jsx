import React from "react";

/**
 * Small floating toast, shown for a few seconds at a time by SessionOverview.
 */
export default function ToastNotification({ message }) {
  if (!message) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl border border-slate-700">
      <span className="text-sm">{message}</span>
    </div>
  );
}