// src/components/LandingPage/Workflow/icons.jsx
//
// Small, self-contained line icons so this folder doesn't need a new icon
// dependency. Every icon takes a `className` for sizing/color, same as the
// icons already used in Navbar (see ../../icons.jsx).

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const MegaphoneIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 11v2a2 2 0 0 0 2 2h1l3.5 5v-16L6 9H5a2 2 0 0 0-2 2Z" />
    <path d="M14.5 6a5 5 0 0 1 0 12" />
    <path d="M17.5 3.5a9 9 0 0 1 0 17" />
  </svg>
);

export const SparkleIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    <circle cx="12" cy="12" r="3.25" />
  </svg>
);

export const CalendarIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    <path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
  </svg>
);

export const VideoIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
    <path d="m15.5 10.5 6-3.25v9.5l-6-3.25" />
  </svg>
);

export const FileTextIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M7 2.75h7.25L18.5 7v13.25a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z" />
    <path d="M14 2.75V7h4.25" />
    <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4.5" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...base} strokeWidth={2.25} {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const PlayIcon = (props) => (
  <svg {...base} fill="currentColor" stroke="none" {...props}>
    <path d="M7.5 4.75a.9.9 0 0 1 1.37-.77l11 6.75a.9.9 0 0 1 0 1.54l-11 6.75a.9.9 0 0 1-1.37-.77Z" />
  </svg>
);

export const ArrowRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
);

export const ShieldCheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.25 4.75 6v6c0 5 3.1 7.9 7.25 8.75C16.15 19.9 19.25 17 19.25 12V6Z" />
    <path d="m8.75 12.25 2.25 2.25 4.25-4.5" />
  </svg>
);

export const BadgeCheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m12 2.75 2.1 1.4 2.5-.2 1 2.3 2.3 1-.2 2.5 1.4 2.1-1.4 2.1.2 2.5-2.3 1-1 2.3-2.5-.2L12 21.25l-2.1-1.4-2.5.2-1-2.3-2.3-1 .2-2.5-1.4-2.1 1.4-2.1-.2-2.5 2.3-1 1-2.3 2.5.2Z" />
    <path d="m8.75 12.25 2.25 2.25 4.25-4.5" />
  </svg>
);