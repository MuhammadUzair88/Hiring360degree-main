import React from "react";
import StatMetricCard from "./StatMetricCard";
import { dashboardStats } from "./data";
import { TONE_BADGE_CLASS } from "./statusTone";

/**
 * Responsive grid of top-line KPI cards.
 * - below 640px: 1 column (stacked)
 * - 640px+: 2 columns
 * - 1024px+: all 4 in a row
 */
export default function StatMetricsOverview({ stats = dashboardStats }) {
  return (
    <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatMetricCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          helperText={stat.helperText}
          to={stat.to}
          badgeClass={TONE_BADGE_CLASS[stat.tone] || TONE_BADGE_CLASS.neutral}
        />
      ))}
    </div>
  );
}
