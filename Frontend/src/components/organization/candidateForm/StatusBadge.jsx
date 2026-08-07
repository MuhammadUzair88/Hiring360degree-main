import React from "react";

/**
 * Pill badge showing whether a job is still accepting applications.
 * Colors come entirely from the success/danger design tokens so they
 * stay in sync with the rest of the app (see index.css).
 */
export default function StatusBadge({ isClosed }) {
  const bgClass = isClosed ? "bg-primary-100" : "bg-primary-100";
  const dotClass = isClosed ? "bg-primary-500" : "bg-primary-500 animate-pulse";
  const textClass = isClosed ? "text-primary-700" : "text-primary-700";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${textClass}`}>
        {isClosed ? "Applications Closed" : "Accepting Applications"}
      </span>
    </div>
  );
}