import React, { useMemo, useState } from "react";
import {
  hiringFunnelStages,
  hiringFunnelFilters,
  hiringFunnelDepartments,
  hiringFunnelByDepartment,
} from "./data";

/**
 * Fill intensity per stage, darkest at the bottom of the funnel.
 * Kept as a literal array (not a template string) so Tailwind's
 * class scanner can find every class at build time.
 */
const FILL_CLASSES = [
  "bg-primary-800/15",
  "bg-primary-800/30",
  "bg-primary-800/50",
  "bg-primary-800/70",
  "bg-primary-800",
];

/**
 * Derives each stage's conversion rate from raw values instead of
 * trusting a hand-typed `percentage` field. This is what makes the
 * "By Department" filter safe to add datasets to — drop in any array
 * of { id, label, value } and the rates are always correct, with no
 * risk of a stored percentage drifting out of sync.
 */
function withConversionRates(rawStages) {
  return rawStages.map((stage, index) => {
    if (index === 0) return { ...stage, percentage: 100 };
    const prevValue = rawStages[index - 1]?.value ?? 0;
    const percentage = prevValue > 0 ? Math.round((stage.value / prevValue) * 100) : 0;
    return { ...stage, percentage };
  });
}

export default function HiringFunnelChart({
  stages = hiringFunnelStages,
  filters = hiringFunnelFilters,
  departments = hiringFunnelDepartments,
  departmentStages = hiringFunnelByDepartment,
  title = "Hiring Funnel",
  subtitle = "Global aggregate conversion metrics",
}) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [activeDepartment, setActiveDepartment] = useState(departments[0]);

  const isByDepartment = activeFilter === "By Department";

  const activeStages = useMemo(() => {
    const rawStages = isByDepartment ? departmentStages[activeDepartment] ?? [] : stages;
    return withConversionRates(rawStages);
  }, [isByDepartment, activeDepartment, departmentStages, stages]);

  const maxValue = Math.max(...activeStages.map((s) => s.value), 1);

  return (
    <div className="self-stretch p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-primary-900 text-xl font-semibold leading-7">{title}</h2>
          <p className="text-black text-sm leading-5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-medium leading-4 tracking-tight transition-colors ${
                activeFilter === filter
                  ? "bg-primary-100 text-primary-800"
                  : "text-black hover:bg-secondary-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isByDepartment && (
        <div className="flex flex-wrap items-center gap-2 -mt-2">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setActiveDepartment(dept)}
              className={`px-3 py-1 rounded-full text-xs font-medium leading-4 tracking-tight border transition-colors ${
                activeDepartment === dept
                  ? "bg-primary-800 text-secondary-50 border-primary-800"
                  : "text-black bg-secondary-50 border-secondary-300 hover:bg-secondary-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      <div className="self-stretch flex flex-col gap-4">
        {activeStages.map((stage, index) => {
          const widthPercent = Math.max((stage.value / maxValue) * 100, 6);
          const fillClass = FILL_CLASSES[index] ?? FILL_CLASSES[FILL_CLASSES.length - 1];
          const isFirst = index === 0;

          return (
            <div
              key={stage.id}
              className="grid grid-cols-[minmax(84px,auto)_1fr_auto] sm:grid-cols-[140px_1fr_56px] items-center gap-3 sm:gap-4"
            >
              <div className="flex flex-col">
                <span className="text-primary-900 text-xs font-bold uppercase tracking-tight">
                  {stage.label}
                </span>
                <span className="text-primary-900 text-lg font-semibold leading-6">
                  {stage.value}
                </span>
              </div>

              <div className="h-8 sm:h-9 rounded-lg bg-primary-50 overflow-hidden">
                <div
                  className={`h-full rounded-lg ${fillClass} transition-[width] duration-500 ease-out`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <span
                className="justify-self-end text-primary-900 text-[11px] font-bold bg-secondary-50 rounded px-2 py-1 outline outline-1 outline-offset-[-1px] outline-secondary-300 whitespace-nowrap"
                title={isFirst ? "Baseline" : "Conversion from previous stage"}
              >
                {stage.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}