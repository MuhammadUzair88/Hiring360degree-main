import { Building2, Minus, Newspaper, Cpu, Palette, Moon, Flame } from "lucide-react";

export const pamphletHeader = {
  title: "AI Pamphlet Customizer",
  subtitle: "Adjust your advertisement's visual parameters to match your brand's tone.",
};

/**
 * One entry per theme JobPamphletTemplates.jsx actually renders — all 7
 * themes now (corporate, minimal, newspaper, tech, gradient, dark, bold),
 * not just the original 4. `group` is the category label the theme
 * picker shows above each cluster of options (Professional / Modern /
 * Creative), matching the design.
 */
export const pamphletThemeOptions = [
  { value: "corporate", label: "Corporate", icon: Building2, group: "Professional" },
  { value: "minimal", label: "Minimal", icon: Minus, group: "Professional" },
  { value: "newspaper", label: "Newspaper", icon: Newspaper, group: "Professional" },
  { value: "tech", label: "Tech", icon: Cpu, group: "Modern" },
  { value: "gradient", label: "Gradient", icon: Palette, group: "Modern" },
  { value: "dark", label: "Dark", icon: Moon, group: "Modern" },
  { value: "bold", label: "Bold", icon: Flame, group: "Creative" },
];

export const pamphletBrandingOptions = [
  { value: "logo-only", label: "Logo Only" },
  { value: "name-only", label: "Name Only" },
  { value: "logo-name", label: "Logo + Name" },
];

/**
 * Keys match exactly what JobPamphletTemplates reads off `colors` —
 * primary / accent / bg / text — so this list can drive the palette
 * editor with no key translation.
 */
export const pamphletPaletteFields = [
  { key: "primary", label: "Primary Color" },
  { key: "accent", label: "Accent Color" },
  { key: "bg", label: "Background Color" },
  { key: "text", label: "Text Color" },
];

/**
 * Starting palette for every theme in pamphletThemeOptions above.
 * corporate / minimal / newspaper / tech are unchanged from before —
 * gradient / dark / bold are the three new entries added to match
 * JobPamphletTemplates.jsx now supporting all 7 themes.
 */
export const pamphletThemeDefaultColors = {
  corporate: { primary: "#6B38D4", accent: "#8B5CF6", bg: "#FFFFFF", text: "#1D1A23" },
  minimal: { primary: "#111827", accent: "#4B5563", bg: "#FFFFFF", text: "#111827" },
  newspaper: { primary: "#292524", accent: "#B45309", bg: "#FDF6E9", text: "#1C1917" },
  tech: { primary: "#7C3AED", accent: "#22D3EE", bg: "#0B0B12", text: "#E5E7EB" },
  gradient: { primary: "#7C3AED", accent: "#EC4899", bg: "#FFFFFF", text: "#FFFFFF" },
  dark: { primary: "#8B5CF6", accent: "#22D3EE", bg: "#0A0A0B", text: "#F1F5F9" },
  bold: { primary: "#E11D48", accent: "#0F172A", bg: "#FFFFFF", text: "#0F172A" },
};

/** Shape held in the CreateAdvertisement layout route's pamphletSettings state. */
export const initialPamphletSettings = {
  theme: "corporate",
  branding: "logo-name",
  logoSize: 100,
  headingSize: 100,
  colors: pamphletThemeDefaultColors,
};