// InterviewerStatCard.jsx
import React from "react";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

const TREND_ICONS = {
  up: ArrowUp,
  down: ArrowDown,
  alert: AlertTriangle,
};

/**
 * A single interviewer KPI card, e.g. "Total Interviewers — 24 — +4 this month".
 * Mirrors the dashboard's StatMetricCard 1:1 so KPI cards look identical
 * everywhere in the app. Fully prop-driven — InterviewerStatsOverview maps
 * interviewerStatMeta onto this, same pattern as the dashboard.
 */
export default function InterviewerStatCard({
  label,
  value,
  icon: Icon,
  badgeClass = "bg-primary-50 text-primary-800",
  helperText,
  trend,
}) {
  const TrendIcon = trend ? TREND_ICONS[trend.direction] : null;

  return (
    <div className="h-32 p-4 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col justify-between items-start">
      <div className="self-stretch flex justify-between items-start">
        <span className="text-zinc-600 text-xs font-semibold uppercase leading-4 tracking-wide">
          {label}
        </span>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${badgeClass}`}>
            <Icon className="w-4 h-4" strokeWidth={2.25} />
          </span>
        )}
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <span className="text-slate-900 text-2xl font-semibold leading-8">{value}</span>

        {trend ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold leading-4 tracking-tight ${trend.toneClass}`}>
            {TrendIcon && <TrendIcon className="w-3 h-3" strokeWidth={3} />}
            {trend.label}
          </span>
        ) : helperText ? (
          <span className="text-zinc-600 text-xs font-semibold leading-4 tracking-tight">
            {helperText}
          </span>
        ) : null}
      </div>
    </div>
  );
}