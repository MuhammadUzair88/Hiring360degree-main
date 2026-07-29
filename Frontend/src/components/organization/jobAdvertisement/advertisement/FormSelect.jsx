import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Native <select> styled to match FormTextInput, with a leading icon
 * and a trailing chevron. Options can be plain strings (value===label)
 * or { value, label } objects — Employment Type/Work Mode use the
 * former, Experience Level uses the latter via SegmentedOptionControl
 * instead, so this only ever needs the plain-string case in practice.
 */
export default function FormSelect({ icon: Icon, options = [], placeholder, value, ...selectProps }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
      )}
      <select
        {...selectProps}
        value={value}
        className={`w-full appearance-none ${Icon ? "pl-10" : "pl-4"} pr-10 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors ${
          value ? "text-slate-900" : "text-gray-500"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}