import React from "react";
import StatMetricCard from "./StatMetricCard";
import { TONE_BADGE_CLASS } from "./statusTone";

export default function StatMetricsOverview({ stats = [], loading = false }) {
  if (loading) {
    return (
      <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

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
