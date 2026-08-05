/**
 * dashboard/statusTone.js
 * ------------------------------------------------------------------
 * Single mapping from a semantic "tone" (success / warning / danger /
 * info / neutral) to the badge classes and hex values that represent
 * it, built directly on top of the success/warning/danger/info tokens
 * defined in index.css ("THE source of truth for every good / needs
 * attention / bad / saved signal"). Any chart or badge that needs to
 * show a status — offer activity, AI score, application status —
 * reads from here instead of picking its own color, so a verdict
 * always means the same color everywhere on the dashboard.
 * ------------------------------------------------------------------
 */

/** Tailwind classes for a status pill/badge (light bg, dark text). */
export const TONE_BADGE_CLASS = {
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
  info: "bg-info-100 text-info-700",
  neutral: "bg-secondary-200 text-zinc-700",
};

/** Solid hex (via CSS var) for chart fills, dots, and rings. */
export const TONE_HEX = {
  success: "var(--color-success-500)",
  warning: "var(--color-warning-500)",
  danger: "var(--color-danger-500)",
  info: "var(--color-info-500)",
  neutral: "var(--color-secondary-400)",
};