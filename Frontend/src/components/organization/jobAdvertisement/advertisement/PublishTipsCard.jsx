import React from "react";

/** Icon + title + description bullet list. Reused for both sidebar tip cards. */
export default function PublishTipsCard({ title, subtitle, tips = [] }) {
  return (
    <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-slate-900 text-base font-semibold leading-6">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs leading-4">{subtitle}</p>}
      </div>

      <ul className="flex flex-col gap-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <li key={tip.id} className="flex items-start gap-3">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  tip.iconBgClass ?? "bg-primary-50"
                } ${tip.iconColorClass ?? "text-primary-800"}`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
              </span>
              <div className="flex flex-col">
                <span className="text-slate-900 text-sm font-medium leading-5">{tip.title}</span>
                <span className="text-gray-500 text-xs leading-4">{tip.description}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}