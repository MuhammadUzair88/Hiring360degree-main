/**
 * data.js — Platform section content.
 *
 * Single source of truth for the "Platform" feature cards. Components
 * under this folder stay presentational — they only read from `props`
 * — so updating copy, ordering, or adding a new card never requires
 * touching PlatformOverview.jsx or FeatureCard.jsx, only this file.
 *
 * `icon` is a string key (not a component reference) so this file stays
 * plain data. FeatureCard resolves the key to the actual icon component
 * via the ICONS map in ./icons.jsx.
 *
 * `accent` uses the app's real theme tokens (--color-primary-*, defined
 * in index.css) instead of one-off oklch() values, so the cards follow
 * the brand palette and stay in sync if the theme is ever retuned.
 */

export const platformEyebrow = "The platform";

export const platformHeading = {
  prefix: "One intelligence layer for",
  highlight: "every hiring decision.",
};

export const platformSubheading =
  "Hiring360° unifies sourcing, screening, scheduling, and offers into a " +
  "single cinematic system — orchestrated by AI, controlled by you.";

export const platformTrustLine =
  "Trusted by talent teams at hyper-growth companies worldwide";

export const platformFeatures = [
  {
    id: "ai-resume-scoring",
    title: "AI Resume Scoring",
    desc: "Multi-signal models rank every applicant against your role rubric in milliseconds — bias-free, consistent, explainable.",
    icon: "score",
    accent: "var(--color-primary-500)",
  },
  {
    id: "candidate-pipeline",
    title: "Candidate Pipeline",
    desc: "Drag-and-drop stages with automated handoffs, SLA alerts, and intelligent routing between hiring teams.",
    icon: "pipeline",
    accent: "var(--color-primary-600)",
  },
  {
    id: "automated-decisioning",
    title: "Automated Decisioning",
    desc: "Smart triggers advance, reject, or escalate candidates based on your custom policy — zero manual triage.",
    icon: "auto",
    accent: "var(--color-primary-700)",
  },
  {
    id: "interview-scheduling",
    title: "Interview Scheduling",
    desc: "Self-serve booking that respects panel availability, time zones, and interviewer load balancing.",
    icon: "calendar",
    accent: "var(--color-primary-800)",
  },
  {
    id: "hiring-analytics",
    title: "Hiring Analytics",
    desc: "Funnel health, source quality, DEI metrics, and forecast models — refreshed the moment data changes.",
    icon: "chart",
    accent: "var(--color-primary-500)",
  },
  {
    id: "workflow-automations",
    title: "Workflow Automations",
    desc: "Compose offers, sync your ATS, dispatch updates. Replace busywork with one elegant automation graph.",
    icon: "bolt",
    accent: "var(--color-primary-600)",
  },
];