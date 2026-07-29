import React from "react";

/**
 * Label + required-asterisk + optional helper text, wrapped around
 * whatever input control is passed as children. Keeps every field in
 * JobForm visually identical without repeating label markup per field.
 */
export default function FormField({ label, required = false, htmlFor, helperText, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={htmlFor} className="text-zinc-600 text-xs font-bold uppercase leading-4 tracking-wide">
          {label} {required && <span className="text-red-700">*</span>}
        </label>
      )}
      {children}
      {helperText && <p className="text-gray-500 text-xs leading-4">{helperText}</p>}
    </div>
  );
}