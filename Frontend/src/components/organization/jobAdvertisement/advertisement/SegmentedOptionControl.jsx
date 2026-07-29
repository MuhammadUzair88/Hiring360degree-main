import React from "react";

/**
 * Generic single-select pill group. Reused for both "Experience Level"
 * (3 options) and "Internship Paid?" (2 options) so the same visual
 * control and interaction pattern serves both fields.
 */
export default function SegmentedOptionControl({ name, options = [], value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors outline outline-1 outline-offset-[-1px] ${
              isActive
                ? "bg-primary-50 outline-primary-800 text-primary-800"
                : "outline-secondary-300 text-slate-900 hover:bg-secondary-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}