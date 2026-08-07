import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { hiringPerformanceData, hiringPerformanceFilters } from "./data";

/**
 * Darkest-to-lightest primary ramp, ordered top-of-funnel to
 * bottom-of-funnel: Applications is the widest, most literal stage,
 * so it gets the strongest shade; Hires — the narrowest — gets the
 * lightest.
 */
const SERIES = [
  { key: "applications", name: "Applications", color: "var(--color-primary-900)" },
  { key: "interviews", name: "Interviews", color: "var(--color-primary-600)" },
  { key: "hires", name: "Hires", color: "var(--color-primary-300)" },
];

/** Line chart of applications → interviews → hires, with a period tab switcher. */
export default function HiringPerformanceChart({
  data = hiringPerformanceData,
  filters = hiringPerformanceFilters,
  title = "Hiring Performance",
  subtitle = "Applications, interviews, and hires over time",
}) {
  const [activeFilter, setActiveFilter] = useState(filters[1] ?? filters[0]);
  const activeData = data[activeFilter] ?? [];

  return (
    <div className="self-stretch p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-slate-900 text-lg font-semibold leading-6">{title}</h2>
          <p className="text-zinc-600 text-xs font-medium leading-4">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-secondary-200/60 rounded-lg shrink-0">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-medium leading-4 tracking-tight transition-colors ${
                activeFilter === filter
                  ? "bg-secondary-50 text-primary-800 shadow-sm"
                  : "text-zinc-600 hover:text-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="var(--color-secondary-400)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--color-secondary-400)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-secondary-300)", strokeWidth: 1 }} />
            <Legend
              verticalAlign="top"
              align="right"
              height={32}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, fontWeight: 600, color: "#334155" }}
            />
            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: "var(--color-secondary-50)" }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}