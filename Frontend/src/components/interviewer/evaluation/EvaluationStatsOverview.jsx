
import React from "react";
import StatMetricCard from "../dashboard/StatMetricCard";
import { TONE_BADGE_CLASS } from "../dashboard/statusTone";

export default function EvaluationStatsOverview({ stats = [], loading = false }) {
  if (loading) {
    return (
      <div className="self-stretch grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

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
