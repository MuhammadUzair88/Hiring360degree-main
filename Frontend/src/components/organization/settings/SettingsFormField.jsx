import React from "react";

/**
 * One labeled input inside CompanyInformationCard (or any settings form).
 * Fully controlled — the parent owns the value and receives changes via
 * onChange(id, nextValue), the same shape CompanyInformationCard already
 * expects.
 */
export default function SettingsFormField({
  id,
  label,
  value,
  icon: Icon,
  type = "text",
  disabled = false,
  onChange = () => {},
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="w-4 h-4 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2}
          />
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(id, e.target.value)}
          className="w-full h-12 pl-11 pr-4 py-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-400 text-gray-900 text-base font-normal leading-6 transition-colors focus:outline-2 focus:outline-primary-600 disabled:bg-secondary-100 disabled:text-neutral-600"
        />
      </div>
    </div>
  );
}