/**
 * shared/statusTone.js
 * ------------------------------------------------------------------
 * Single mapping from a semantic "weight" (subtle / soft / medium /
 * strong) to the badge classes that represent it. The app uses one
 * brand color — primary — everywhere; differentiation between states
 * (e.g. "Scheduled" vs. "Ongoing") comes from how strong that single
 * color reads (a light tint vs. a solid fill), never from switching
 * hue. Every status badge or KPI icon on any interviewer page should
 * read its class from here instead of picking one locally, so a given
 * weight always looks the same everywhere.
 * ------------------------------------------------------------------
 */

/** Tailwind classes for a status pill/badge or KPI icon chip — primary shades only. */
export const TONE_BADGE_CLASS = {
  subtle: "bg-primary-50 text-primary-700",
  soft: "bg-primary-100 text-primary-800",
  medium: "bg-primary-200 text-primary-900",
  strong: "bg-primary-800 text-secondary-50",
};

/** Interview status → weight. Extend this as new statuses are introduced. */
const STATUS_TONE_MAP = {
  Scheduled: "subtle",
  Upcoming: "subtle",
  Ongoing: "strong",
  Completed: "soft",
  "No Show": "medium",
};

/** Resolves any interview/candidate status string to a tone key. */
export function toneForStatus(status) {
  return STATUS_TONE_MAP[status] || "soft";
}
