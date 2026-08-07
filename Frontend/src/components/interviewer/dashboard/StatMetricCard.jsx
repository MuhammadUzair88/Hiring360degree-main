import React from "react";
import { Link } from "react-router-dom";

/**
 * A single KPI card, e.g. "Upcoming — 4 — Schedules pending start".
 * Fully prop-driven so it has no knowledge of dashboard/data.js —
 * StatMetricsOverview is the one that maps data.js entries onto this.
 * Renders as a Link when `to` is provided, a plain card otherwise.
 */
export default function StatMetricCard({
  label,
  value,
  icon: Icon,
  badgeClass = "bg-primary-50 text-primary-800",
  helperText,
  to,
}) {
  const className =
    "h-32 p-4 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col justify-between items-start transition-all hover:outline-primary-400 hover:shadow-sm";

  const content = (
    <>
      <div className="self-stretch flex justify-between items-start">
        <span className="text-zinc-600 text-xs font-bold uppercase leading-4 tracking-wide">
          {label}
        </span>
        {Icon && (
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${badgeClass}`}>
            <Icon className="w-4 h-4" strokeWidth={2.25} />
          </span>
        )}
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <span className="text-slate-900 text-3xl font-semibold leading-8">{value}</span>
        {helperText && (
          <span className="text-zinc-600 text-xs font-semibold leading-4 tracking-tight">
            {helperText}
          </span>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${className} cursor-pointer`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
