import React from "react";
import { pamphletPaletteFields } from "./pamphletdata";

/**
 * Four outlined rows — label, hex code, color swatch. `colors` is the
 * *current theme's* slice only; `onChange(colorKey, nextHex)` is
 * routed by PamphletOverview into
 * handlePamphletColorChange(theme, colorKey, value).
 *
 * This is a different component from PamphletThemeSelector — it has
 * no icons, just label + hex + swatch. If "Theme Palette" is showing
 * the same Corporate/Minimal/Newspaper/Tech icons as "Select Theme",
 * this file had PamphletThemeSelector's content pasted into it by
 * mistake instead of this.
 */
export default function PamphletColorPalette({ colors = {}, onChange, fields = pamphletPaletteFields }) {
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => {
        const value = colors[field.key] || "#000000";

        return (
          <div
            key={field.key}
            className="p-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-between"
          >
            <span className="text-slate-900 text-sm font-medium">{field.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-semibold font-mono uppercase">{value}</span>
              <label className="w-7 h-7 rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] outline-secondary-300 cursor-pointer block">
                <input
                  type="color"
                  value={value}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  className="w-full h-full cursor-pointer border-0 p-0"
                  aria-label={field.label}
                />
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}