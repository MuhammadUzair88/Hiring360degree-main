/**
 * src/components/landingPageComponents/platform/PlatformIcons.jsx
 *
 * Stroke-style icon set for the Platform feature cards. Each icon is a
 * thin wrapper around the shared <IconBase />, so stroke width, size, and
 * color all stay consistent without repeating the same <svg> attributes
 * six times. Add a new feature to data.js? Add its icon here and import
 * it from there — nothing else needs to change.
 */

function IconBase({ size = 20, color = "currentColor", style, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {children}
    </svg>
  );
}

export function ScoreIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function PipelineIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 6h6M4 12h10M4 18h6" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </IconBase>
  );
}

export function AutoIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="4" />
    </IconBase>
  );
}

export function CalendarIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </IconBase>
  );
}

export function ChartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15l3-4 3 3 4-6" />
    </IconBase>
  );
}

export function BoltIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
    </IconBase>
  );
}