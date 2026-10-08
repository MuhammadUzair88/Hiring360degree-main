import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ChartTooltip from "./ChartToolTip";


/** Darkest-first primary ramp, same approach as JobCategoryDistributionChart. */
const SLICE_COLORS = [
  "var(--color-primary-800)",
  "var(--color-primary-600)",
  "var(--color-primary-400)",
  "var(--color-primary-200)",
];

/** Donut of offer letters by status (sent / accepted / pending / declined). */
export default function OfferLetterActivityChart({
  activity = [],
  title = "Offer Letters",
  subtitle = "Status of offers sent this month",
}) {
  const total = activity.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-slate-900 text-sm font-semibold leading-6">{title}</h2>
        <p className="text-zinc-600 text-xs font-medium leading-4">{subtitle}</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-24 h-24 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip formatLabel={(item) => item.name} />} wrapperStyle={{ zIndex: 50 }} />
              <Pie
                data={activity}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={40}
                paddingAngle={3}
              >
                {activity.map((entry, index) => (
                  <Cell key={entry.id || `${entry.name}-${index}`} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-base font-semibold text-slate-900">{total}</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {activity.map((item, index) => (
            <div key={item.id || `${item.name}-${index}`} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length] }}
                />
                <span className="text-zinc-600 text-xs font-medium truncate">{item.name}</span>
              </span>
              <span className="text-slate-900 text-xs font-bold font-mono shrink-0">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
