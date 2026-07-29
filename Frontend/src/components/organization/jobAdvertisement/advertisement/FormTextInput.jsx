import React from "react";

/**
 * Single-line text/date input with an optional leading icon.
 * Purely presentational and controlled — pass any native <input>
 * prop (value, onChange, type, required, placeholder, id...) straight
 * through via `inputProps`.
 */
export default function FormTextInput({ icon: Icon, className = "", ...inputProps }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      )}
      <input
        {...inputProps}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors ${className}`}
      />
    </div>
  );
}