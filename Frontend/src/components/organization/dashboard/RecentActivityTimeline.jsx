import React from "react";
import ActivityTimelineItem from "./ActivityTimelineItem";
import { recentActivity } from "./data";

/** Card with a vertical timeline of recent hiring activity. */
export default function RecentActivityTimeline({
  activity = recentActivity,
  onLoadMore,
}) {
  return (
    <div className="self-stretch p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <h2 className="text-slate-900 text-xl font-semibold leading-7">Recent Activity</h2>

      <div className="self-stretch relative flex flex-col">
        <span className="w-px absolute left-3 top-2 bottom-2 bg-secondary-300" aria-hidden="true" />

        {activity.map((entry, index) => (
          <ActivityTimelineItem
            key={entry.id}
            {...entry}
            isLast={index === activity.length - 1}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onLoadMore}
        className="self-stretch py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 text-xs font-bold leading-4 tracking-tight hover:bg-secondary-200 transition-colors"
      >
        Load More Activity
      </button>
    </div>
  );
}
