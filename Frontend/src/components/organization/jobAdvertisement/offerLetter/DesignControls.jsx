import React, { useRef } from "react";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { THEME_LIST } from "./Theme";

/* Theme Selector */
function ThemeSelector({ theme, setTheme }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Theme
        </span>
        <span className="text-[10px] text-gray-500/50">{theme}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => scroll('left')}
          className="p-1 rounded-lg hover:bg-secondary-100 text-gray-500/50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={14} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
        >
          {THEME_LIST.map(({ key, label }) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? "bg-primary-800 text-white border-primary-800 shadow-sm"
                    : "bg-secondary-100 text-gray-500 border-secondary-300 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className="p-1 rounded-lg hover:bg-secondary-100 text-gray-500/50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* Branding Selector */
function BrandingSelector({ brandingPreference, setBrandingPreference }) {
  const options = [
    { value: "logo-only", label: "Logo" },
    { value: "name-only", label: "Name" },
    { value: "logo-name", label: "Both" },
  ];

  return (
    <div>
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-3">
        Branding
      </span>
      <div className="flex bg-secondary-100 rounded-lg p-0.5 border border-secondary-300">
        {options.map((option) => {
          const isActive = brandingPreference === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setBrandingPreference(option.value)}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-secondary-50 text-slate-900 shadow-sm border border-secondary-300"
                  : "text-gray-500/60 hover:text-gray-500"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Slider Control */
function SliderControl({ label, value, onChange, min = 50, max = 200, step = 1, defaultValue = 100 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="text-[10px] text-gray-500/30 hover:text-gray-500/60 transition-colors cursor-pointer"
          >
            reset
          </button>
          <span className="text-[11px] font-semibold text-slate-900 tabular-nums w-9 text-right">
            {value}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-secondary-300 rounded-full appearance-none cursor-pointer accent-primary-800"
      />
    </div>
  );
}

/* Color Picker */
function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-5 h-5 rounded-full border-0 cursor-pointer p-0 bg-transparent"
          style={{ WebkitAppearance: 'none' }}
        />
        <span className="text-[10px] text-gray-500/50 font-mono uppercase w-14 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}

/* Main DesignControls */
export default function DesignControls({
  theme,
  setTheme,
  brandingPreference,
  setBrandingPreference,
  logoSize,
  setLogoSize,
  headingSize,
  setHeadingSize,
  bodyFontSize,
  setBodyFontSize,
  signatureSize,
  setSignatureSize,
  spacing,
  setSpacing,
  colors,
  onColorChange,
  onResetColors,
}) {
  const safeColors = {
    primary: colors?.primary || "#5B21B6",
    secondary: colors?.secondary || "#6B7280",
    text: colors?.text || "#1F2937",
    background: colors?.background || "#FFFFFF",
    accent: colors?.accent || "#8B5CF6",
  };

  return (
    <div className="divide-y divide-secondary-300/40">
      {/* Theme */}
      <div className="pb-4">
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </div>

      {/* Branding */}
      <div className="py-4">
        <BrandingSelector
          brandingPreference={brandingPreference}
          setBrandingPreference={setBrandingPreference}
        />
      </div>

      {/* Sizing */}
      <div className="py-4 space-y-3">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
          Sizing
        </span>

        {(brandingPreference === "logo-only" || brandingPreference === "logo-name") && (
          <SliderControl label="Logo" value={logoSize} onChange={setLogoSize} defaultValue={145} />
        )}
        <SliderControl label="Heading" value={headingSize} onChange={setHeadingSize} defaultValue={145} />
        <SliderControl label="Body" value={bodyFontSize} onChange={setBodyFontSize} defaultValue={150} />
        <SliderControl label="Signature" value={signatureSize} onChange={setSignatureSize} defaultValue={120} />
        <SliderControl label="Spacing" value={spacing} onChange={setSpacing} min={70} max={150} defaultValue={100} />
      </div>

      {/* Colors */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Colors
          </span>
          <button
            type="button"
            onClick={onResetColors}
            className="flex items-center gap-1 text-[10px] text-gray-500/40 hover:text-primary-800 transition-colors cursor-pointer"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        </div>

        <div className="space-y-0">
          <ColorRow label="Primary" value={safeColors.primary} onChange={(v) => onColorChange("primary", v)} />
          <ColorRow label="Secondary" value={safeColors.secondary} onChange={(v) => onColorChange("secondary", v)} />
          <ColorRow label="Text" value={safeColors.text} onChange={(v) => onColorChange("text", v)} />
          <ColorRow label="Background" value={safeColors.background} onChange={(v) => onColorChange("background", v)} />
          <ColorRow label="Accent" value={safeColors.accent} onChange={(v) => onColorChange("accent", v)} />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border-radius: 50%; border: 1px solid #e5e7eb; }
      `}</style>
    </div>
  );
}