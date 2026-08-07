import React from "react";

export default function FormField({ id, label, icon: Icon, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="pl-1 text-xs font-semibold uppercase tracking-wider text-slate-900"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
        )}
        <input
          id={id}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-gray-400 bg-secondary-50 outline-none transition-colors focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 ${
            error ? "border-danger-500" : "border-secondary-300"
          }`}
          {...inputProps}
        />
      </div>

      {error && <span className="pl-1 text-xs text-danger-600">{error}</span>}
    </div>
  );
}