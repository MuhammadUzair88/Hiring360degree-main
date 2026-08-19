/**
 * icons.jsx — stroke-style icon set used on the platform feature cards.
 *
 * FeatureCard receives an `icon` *string* from data.js (e.g. "score") and
 * looks it up in ICONS here to get the actual component. Keeping the map
 * in one place means data.js never imports React/JSX and stays pure data.
 */

function IconBase({ size = 24, color = "currentColor", style, children }) {
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
      aria-hidden
      style={style}
    >
      {children}
    </svg>
  );
}

function ScoreIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

function PipelineIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 6h6M4 12h10M4 18h6" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </IconBase>
  );
}

function AutoIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="4" />
    </IconBase>
  );
}

function CalendarIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </IconBase>
  );
}

function ChartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15l3-4 3 3 4-6" />
    </IconBase>
  );
}

function BoltIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
    </IconBase>
  );
}

/** Maps the string keys used in data.js to their icon components. */
export const ICONS = {
  score: ScoreIcon,
  pipeline: PipelineIcon,
  auto: AutoIcon,
  calendar: CalendarIcon,
  chart: ChartIcon,
  bolt: BoltIcon,
};