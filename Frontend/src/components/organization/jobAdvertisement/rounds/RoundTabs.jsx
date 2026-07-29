import React from "react";

/**
 * One tab per configured round (e.g. "Technical Round", "HR Round").
 * `counts[i]` is shown as a small badge so HR can see at a glance how
 * many candidates are currently waiting in each round.
 */
export default function RoundTabs({ rounds, activeIndex, counts = [], onSelect }) {
  return (
    <div className="border-b border-secondary-300 flex items-center gap-6 overflow-x-auto">
      {rounds.map((name, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={`${name}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`shrink-0 pb-3 pt-1 flex items-center gap-2 border-b-2 text-base transition-colors ${
              isActive
                ? "border-primary-800 text-primary-800 font-semibold"
                : "border-transparent text-gray-700 font-normal hover:text-primary-800"
            }`}
          >
            {name}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
                isActive ? "bg-primary-800 text-white" : "bg-secondary-200 text-gray-600"
              }`}
            >
              {counts[index] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}