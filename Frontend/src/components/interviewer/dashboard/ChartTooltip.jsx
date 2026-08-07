import React from "react";

/**
 * Shared tooltip for every recharts graph on the dashboard. Themed
 * with the same card language as the rest of the app (secondary-50
 * surface, secondary-300 outline) so hovering any graph feels like
 * the same product.
 *
 * `formatLabel` lets a chart rename a series key (e.g. "scheduled" →
 * "Scheduled") without needing its own tooltip component.
 */
export default function ChartTooltip({ active, payload, label, formatLabel }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="min-w-[140px] bg-secondary-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-lg px-3 py-2 flex flex-col gap-1">
      {label && (
        <span className="text-zinc-600 text-[11px] font-bold uppercase tracking-wide">{label}</span>
      )}
      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color || item.fill || item.stroke }}
            />
            {formatLabel ? formatLabel(item) : item.name}
          </span>
          <span className="text-slate-900 font-bold font-mono">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
