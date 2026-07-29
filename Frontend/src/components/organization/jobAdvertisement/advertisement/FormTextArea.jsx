import React from "react";

/** Multi-line textarea with an optional character counter (used by Job Description). */
export default function FormTextarea({ maxLength, value = "", className = "", ...textareaProps }) {
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        {...textareaProps}
        value={value}
        maxLength={maxLength}
        className={`w-full min-h-40 px-4 py-3 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors resize-y ${className}`}
      />
      {maxLength && (
        <span className="self-end text-gray-400 text-xs leading-4">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}