import React from "react";

/**
 * Slider row: label left, live pixel readout right, thin track below.
 * `value` is a 50–200 percentage; `basePx` converts it into the pixel
 * figure shown next to the label (matches the real px math used in
 * JobPamphletPreview, so the readout is never just decorative).
 */
export default function PamphletSizeSlider({ label, value, onChange, min = 50, max = 200, basePx }) {
  const pixelValue = basePx ? Math.round((basePx * value) / 100) : value;
  const displayValue = basePx ? `${pixelValue}px` : `${value}%`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-900 text-sm font-medium">{label}</span>
        <span className="text-primary-800 text-xs font-semibold">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-secondary-300 accent-primary-800"
      />
    </div>
  );
}