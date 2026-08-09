import React from "react";

function StatCard({ label, value, helperText, accentTextClass }) {
  return (
    <div className="p-4 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm flex flex-col gap-1">
      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-semibold leading-8 ${accentTextClass}`}>{value}</span>
      {helperText && <span className="text-gray-400 text-[11px]">{helperText}</span>}
    </div>
  );
}

/** Top-of-page KPI row: total / pending / bookmarked / shortlisted. */
export default function CandidateIntakeStats({ total, pending, bookmarked, shortlisted }) {
  const stats = [
    { key: "total", label: "Total Candidates", value: total, helperText: "applications received", accentTextClass: "text-slate-900" },
    { key: "pending", label: "Pending Review", value: pending, helperText: "needs review", accentTextClass: "text-warning-600" },
    { key: "bookmarked", label: "Bookmarked", value: bookmarked, helperText: "saved for later", accentTextClass: "text-info-600" },
    { key: "shortlisted", label: "Shortlisted", value: shortlisted, helperText: "ready for next stage", accentTextClass: "text-success-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
 
        <StatCard key={stat.key} {...stat} />
      ))}
    </div>
  );
}