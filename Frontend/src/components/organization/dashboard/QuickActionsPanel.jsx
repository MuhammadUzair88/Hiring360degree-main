import React from "react";
import QuickActionButton from "./QuickActionButton";
import { quickActions } from "./data";

/** Card of shortcut actions (new job posting, add interviewer, etc). */
export default function QuickActionsPanel({ actions = quickActions }) {
  return (
    <div className="flex-1 p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-4">
      <h2 className="text-slate-900 text-lg font-semibold leading-6">Quick Actions</h2>

      <div className="self-stretch flex flex-col gap-2">
        {actions.map((action) => (
          <QuickActionButton key={action.id} {...action} />
        ))}
      </div>
    </div>
  );
}
