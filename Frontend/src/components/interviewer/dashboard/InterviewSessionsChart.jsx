import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { sessionsChartData, sessionsChartFilters, sessionsCompletionRate } from "./data";

/** Bar chart of scheduled vs. completed interview sessions, with a period tab switcher. */
export default function InterviewSessionsChart({
  data = sessionsChartData,
  filters = sessionsChartFilters,
  completionRate = sessionsCompletionRate,
  title = "Interview Activity",
  subtitle = "Scheduled vs. completed sessions over time",
}) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const activeData = data[activeFilter] ?? [];

  return (
    <div className="h-full p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-slate-900 text-lg font-semibold leading-6">{title}</h2>
          <p className="text-zinc-600 text-xs font-medium leading-4">{subtitle}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-primary-700" /> Scheduled
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-primary-300" /> Completed
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wide">Completion Rate</p>
            <p className="text-2xl font-semibold text-slate-900">{completionRate}%</p>
          </div>
          <div className="flex items-center gap-1 p-0.5 bg-secondary-200/60 rounded-lg">
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
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-secondary-300)" strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="name" stroke="var(--color-secondary-400)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--color-secondary-400)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-secondary-200)", opacity: 0.4 }} />
            <Bar dataKey="scheduled" name="Scheduled" fill="var(--color-primary-700)" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="completed" name="Completed" fill="var(--color-primary-300)" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
