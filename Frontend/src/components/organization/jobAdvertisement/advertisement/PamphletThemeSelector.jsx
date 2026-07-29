import React from "react";
import { pamphletThemeOptions } from "./pamphletdata";

/** Grid theme picker for the pamphlet sidebar. Purely controlled. */
export default function PamphletThemeSelector({ value, onChange, options = pamphletThemeOptions }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select pamphlet theme">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`px-4 py-4 rounded-xl flex flex-col items-center gap-2 text-center transition-colors ${
              isActive
                ? "bg-primary-50 outline outline-2 outline-offset-[-2px] outline-primary-800"
                : "outline outline-1 outline-offset-[-1px] outline-secondary-300 hover:bg-secondary-100"
            }`}
          >
            {Icon && <Icon className={`w-5 h-5 ${isActive ? "text-primary-800" : "text-gray-500"}`} />}
            <span className={`text-sm font-medium ${isActive ? "text-primary-800" : "text-slate-900"}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}