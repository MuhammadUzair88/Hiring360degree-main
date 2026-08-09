import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";


/** Area chart of applications received over time, with a period tab switcher. */
export default function ApplicationsTrendChart({
  data = {},
  filters = ["Daily", "Weekly", "Monthly"],
  title = "Applications Trend",
  subtitle = "New applications received over time",
}) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const activeData = data[activeFilter] ?? [];

  return (
    <div className="h-full p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
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

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="var(--color-secondary-400)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--color-secondary-400)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              content={<ChartTooltip formatLabel={() => "Applications"} />}
              cursor={{ stroke: "var(--color-secondary-300)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              name="Applications"
              stroke="var(--color-primary-700)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#applicationsTrendGradient)"
              activeDot={{ r: 5, strokeWidth: 2, fill: "var(--color-secondary-50)" }}
            />
            <defs>
              <linearGradient id="applicationsTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-700)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-primary-700)" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}