// InterviewerStatsOverview.jsx
import React from "react";
import InterviewerStatCard from "./InterviewerStatCard";
import { interviewerStatMeta } from "./interviewerdata";

/**
 * Responsive grid of interviewer KPI cards — 1 col below 600px, 2 cols
 * from 600px, 3 cols from 840px. Mirrors the dashboard's breakpoint
 * pattern for a consistent feel across the app.
 */
export default function InterviewerStatsOverview({ interviewers = [] }) {
  const values = {
    total: interviewers.length,
    technical: interviewers.filter((i) => i.round === "Technical").length,
    hr: interviewers.filter((i) => i.round === "HR").length,
  };

  return (
    <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {interviewerStatMeta.map((meta) => (
        <InterviewerStatCard key={meta.id} {...meta} value={values[meta.id]} />
      ))}
    </div>
  );
}