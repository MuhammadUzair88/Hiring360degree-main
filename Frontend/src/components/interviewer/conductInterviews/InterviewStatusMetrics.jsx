// src/components/interviewerDashboard/conductInterview/InterviewStatusMetrics.jsx

import React from "react";
import InterviewMetricCard from "./InterviewMetricCard";
import { STATUS_TONE, TOTAL_TONE } from "./StatusTone";
import { STATUS } from "./data";

/**
 * The 4-tile row at the top of the page: Upcoming / Ongoing / Completed /
 * Total Dossiers. Clicking any status tile (not Total) opens the matching
 * drawer via `onSelectStatus` — ConductInterviewOverview owns which
 * drawer is currently open, this component just reports the click.
 */
export default function InterviewStatusMetrics({ counts, onSelectStatus }) {
  const upcomingTone = STATUS_TONE[STATUS.UPCOMING];
  const ongoingTone = STATUS_TONE[STATUS.ONGOING];
  const completedTone = STATUS_TONE[STATUS.COMPLETED];

  return (
    <div className="self-stretch grid grid-cols-2 lg:grid-cols-4 gap-4">
      <InterviewMetricCard
        label="Upcoming"
        value={counts.upcoming}
        icon={upcomingTone.icon}
        iconBadgeClass={upcomingTone.iconBadge}
        helperText="Click to view details"
        onClick={() => onSelectStatus(STATUS.UPCOMING)}
      />
      <InterviewMetricCard
        label="Ongoing"
        value={counts.ongoing}
        icon={ongoingTone.icon}
        iconBadgeClass={ongoingTone.iconBadge}
        helperText="Click to view details"
        onClick={() => onSelectStatus(STATUS.ONGOING)}
      />
      <InterviewMetricCard
        label="Completed"
        value={counts.completed}
        icon={completedTone.icon}
        iconBadgeClass={completedTone.iconBadge}
        helperText="Click to view details"
        onClick={() => onSelectStatus(STATUS.COMPLETED)}
      />
      <InterviewMetricCard
        label={TOTAL_TONE.label}
        value={counts.total}
        icon={TOTAL_TONE.icon}
        iconBadgeClass={TOTAL_TONE.iconBadge}
        helperText="All assigned dossiers"
      />
    </div>
  );
}