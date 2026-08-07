// src/components/interviewerDashboard/conductInterview/InterviewMetricCard.jsx

import React from "react";

/**
 * One KPI tile — "Upcoming — 4 — Click to view details".
 * Fully prop-driven, same shape as the dashboard's StatMetricCard, so
 * it slots into the same visual language. Renders as a button when
 * `onClick` is provided (Upcoming / Ongoing / Completed), or a plain
 * static tile otherwise (Total Dossiers has nowhere to drill into).
 */
export default function InterviewMetricCard({
  label,
  value,
  icon: Icon,
  iconBadgeClass = "bg-primary-50 text-primary-800",
  helperText,
  onClick,
}) {
  const baseClass =
    "h-32 p-4 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col justify-between items-start text-left transition-all";

  const content = (
    <>
      <div className="self-stretch flex justify-between items-start">
        <span className="text-black/60 text-xs font-semibold uppercase leading-4 tracking-wide">
          {label}
        </span>
        {Icon && (
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
            <Icon className="w-4 h-4" strokeWidth={2.25} />
          </span>
        )}
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <span className="text-slate-900 text-3xl font-semibold leading-8">{value}</span>
        {helperText && (
          <span className="text-black/50 text-caption font-medium leading-[1.125rem]">
            {helperText}
          </span>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} cursor-pointer hover:outline-primary-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}