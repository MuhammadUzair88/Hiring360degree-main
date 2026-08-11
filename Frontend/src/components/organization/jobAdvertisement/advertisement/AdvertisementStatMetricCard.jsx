
import React from "react";

export default function AdvertisementStatMetricCard({
  label,
  value,
  icon: Icon,
  badgeClass = "bg-primary-50 text-primary-700",
}) {
  return (
    <div className="min-h-[118px] rounded-xl border border-secondary-300 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex h-full items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
            {label}
          </p>

          <p className="mt-5 text-2xl font-semibold leading-none text-slate-950">
            {value}
          </p>
        </div>

        {Icon ? (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${badgeClass}`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
