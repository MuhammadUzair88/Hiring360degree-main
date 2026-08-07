import React from "react";
import StatMetricCard from "../dashboard/StatMetricCard";
import { TONE_BADGE_CLASS } from "../dashboard/statusTone";
import { evaluationStats } from "./data";

/**
 * Responsive grid of the 3 evaluation KPI cards.
 * - below 640px: 1 column (stacked)
 * - 640px+: all 3 in a row
 */
export default function EvaluationStatsOverview({ stats = evaluationStats }) {
  return (
    <div className="self-stretch grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <StatMetricCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          helperText={stat.helperText}
          badgeClass={TONE_BADGE_CLASS[stat.tone] || TONE_BADGE_CLASS.soft}
        />
      ))}
    </div>
  );
}
