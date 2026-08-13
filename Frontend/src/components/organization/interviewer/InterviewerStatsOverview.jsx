// // InterviewerStatsOverview.jsx
// import React from "react";
// import InterviewerStatCard from "./InterviewerStatCard";
// import { interviewerStatMeta } from "./interviewerdata";

// /**
//  * Responsive grid of interviewer KPI cards — 1 col below 600px, 2 cols
//  * from 600px, 3 cols from 840px. Mirrors the dashboard's breakpoint
//  * pattern for a consistent feel across the app.
//  */
// export default function InterviewerStatsOverview({ interviewers = [] }) {
//   const values = {
//     total: interviewers.length,
//     technical: interviewers.filter((i) => i.round === "Technical").length,
//     hr: interviewers.filter((i) => i.round === "HR").length,
//   };

//   return (
//     <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {interviewerStatMeta.map((meta) => (
//         <InterviewerStatCard key={meta.id} {...meta} value={values[meta.id]} />
//       ))}
//     </div>
//   );
// }


import React, { useMemo } from "react";
import InterviewerStatCard from "./InterviewerStatCard";
import { interviewerStatMeta } from "./interviewerdata";

function isCurrentMonth(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function InterviewerStatsOverview({ interviewers = [] }) {
  const stats = useMemo(() => {
    const panelTypes = Array.from(
      new Set(
        interviewers
          .map((interviewer) => String(interviewer.round || "").trim())
          .filter(Boolean)
          .map((value) => value.toLowerCase())
      )
    );

    const values = {
      total: interviewers.length,
      addedThisMonth: interviewers.filter((interviewer) => isCurrentMonth(interviewer.createdAt)).length,
      panelTypes: panelTypes.length,
    };

    const helper = {
      total: "Live organization roster",
      addedThisMonth: "Created during the current month",
      panelTypes: panelTypes.length === 1 ? "1 assigned interviewer type" : `${panelTypes.length} assigned interviewer types`,
    };

    return interviewerStatMeta.map((meta) => ({
      ...meta,
      value: values[meta.id] ?? 0,
      helperText: helper[meta.id] || "Live backend data",
    }));
  }, [interviewers]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <InterviewerStatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
