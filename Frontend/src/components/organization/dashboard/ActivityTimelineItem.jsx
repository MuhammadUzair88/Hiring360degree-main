import React from "react";

/** One event row inside RecentActivityTimeline, with its connector dot. */
export default function ActivityTimelineItem({
  message,
  timestamp,
  location,
  icon: Icon,
  iconBgClass = "bg-primary-100",
  iconColorClass = "text-primary-800",
  isLast = false,
}) {
  return (
    <div className={`self-stretch pl-10 relative flex flex-col gap-1 ${isLast ? "" : "pb-8"}`}>
      <span
        className={`w-6 h-6 left-0 top-0 absolute rounded-full outline outline-4 outline-offset-[-4px] outline-secondary-50 flex items-center justify-center ${iconBgClass}`}
      >
        {Icon && <Icon className={`w-3 h-3 ${iconColorClass}`} strokeWidth={2.5} />}
      </span>

      <p className="text-slate-900 text-sm font-bold leading-5">{message}</p>
      <p className="text-zinc-600 text-xs font-semibold leading-4 tracking-tight">
        {timestamp} • {location}
      </p>
    </div>
  );
}
