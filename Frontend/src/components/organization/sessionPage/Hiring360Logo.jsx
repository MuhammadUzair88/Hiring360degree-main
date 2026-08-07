import React from "react";

/**
 * Placeholder Hiring360 mark (an "H" paired with a small orbit/clock glyph
 * for the "360"), drawn as inline SVG so it stays crisp at any size and
 * inherits color via `currentColor`.
 *
 * Swap this out once real brand files exist - e.g.
 *   <img src="/brand/hiring360-logo.svg" alt="Hiring360" className={className} />
 * Nothing else needs to change, since every place that shows the Hiring360
 * identity (currently the AI Assistant card) renders this one component.
 */
export default function Hiring360Logo({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Hiring360"
    >
      <path
        d="M4 4v16M4 12h9M13 4v16"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 5.4v1.7l1.3 0.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}