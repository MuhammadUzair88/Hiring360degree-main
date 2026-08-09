import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";


/**
 * Monochromatic primary-shade ramp plus one neutral, darkest-first —
 * keeps this donut in the brand palette instead of borrowing the
 * success/warning/danger/info tokens, which are reserved for status
 * meaning elsewhere in the app (see index.css).
 */
const SLICE_COLORS = [
  "var(--color-primary-900)",
  "var(--color-primary-700)",
  "var(--color-primary-500)",
  "var(--color-primary-300)",
  "var(--color-secondary-400)",
];

/** Donut of open pipeline share by department, with a legend list. */
export default function JobCategoryDistributionChart({
  categories = [],
  title = "Job Category Distribution",
  subtitle = "Share of open pipeline by department",
}) {
  const total = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-slate-900 text-lg font-semibold leading-6">{title}</h2>
        <p className="text-zinc-600 text-xs font-medium leading-4">{subtitle}</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-36 h-36 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip formatLabel={(item) => item.name} />} wrapperStyle={{ zIndex: 50 }} />
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
              >
                {categories.map((entry, index) => (
                  <Cell key={entry.id || `${entry.name}-${index}`} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-semibold text-slate-900 leading-tight">{total}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-600">Total</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {categories.map((cat, index) => (
            <div key={cat.id || `${cat.name}-${index}`} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length] }}
                />
                <span className="text-slate-700 text-xs font-medium truncate">{cat.name}</span>
              </span>
              <span className="text-slate-900 text-xs font-bold font-mono shrink-0">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}