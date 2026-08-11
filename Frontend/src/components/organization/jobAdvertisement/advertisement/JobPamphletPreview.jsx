// import React from "react";
// import { experienceLevelOptions } from "./createadvertisementdata";

// const has = (value) => Boolean(value) && (!Array.isArray(value) || value.length > 0);

// const experienceLabel = (value) =>
//   experienceLevelOptions.find((option) => option.value === value)?.label || value;

// function deriveJobDisplay(job) {
//   const employmentTypeDisplay =
//     job?.employmentType === "Internship" && job?.internshipPaid
//       ? `${job.internshipPaid} Internship`
//       : job?.employmentType || "";

//   const compensationDisplay =
//     job?.employmentType === "Internship" && job?.internshipPaid === "Unpaid" ? "Unpaid" : job?.salary || "";

//   return { employmentTypeDisplay, compensationDisplay };
// }

// function buildMetaItems(job, employmentTypeDisplay, compensationDisplay) {
//   return [
//     has(job.location) && { label: "Location", value: job.location },
//     has(job.experience) && { label: "Experience", value: experienceLabel(job.experience) },
//     has(employmentTypeDisplay) && { label: "Type", value: employmentTypeDisplay },
//     has(job.workMode) && { label: "Mode", value: job.workMode },
//     has(compensationDisplay) && { label: "Compensation", value: compensationDisplay },
//     has(job.deadline) && { label: "Apply By", value: job.deadline },
//   ].filter(Boolean);
// }


// export default function JobPamphletPreview({
//   theme = "corporate",
//   job = {},
//   colors = {},
//   branding = "logo-name",
//   logoSize = 100,
//   headingSize = 100,
//   organizationName = "Your Company",
//   organizationLogoUrl = null,
// }) {
  
//   const { employmentTypeDisplay, compensationDisplay } = deriveJobDisplay(job);
//   const skills = Array.isArray(job.skills) ? job.skills : [];
//   const metaItems = buildMetaItems(job, employmentTypeDisplay, compensationDisplay);
//   console.log(organizationLogoUrl)
//   const scaleLogo = (Number(logoSize) || 100) / 100;
//   const scaleHeading = (Number(headingSize) || 100) / 100;
//   const headingStyle = { fontSize: `${3 * scaleHeading}rem`, lineHeight: 1.15, maxHeight: `${120 * scaleHeading}px` };
//   const logoPx = 56 * scaleLogo;
//   const wrapperStyle = { width: "1200px", height: "630px", backgroundColor: colors.bg };

//   const Logo = () =>
//     organizationLogoUrl ? (
//       <img
//         src={organizationLogoUrl}
//         alt={`${organizationName} logo`}
//         className="rounded-lg object-contain shrink-0"
//         style={{ width: logoPx, height: logoPx }}
//       />
//     ) : (
//       <div
//         className="rounded-lg flex items-center justify-center font-bold text-white shrink-0"
//         style={{ width: logoPx, height: logoPx, backgroundColor: colors.primary, fontSize: `${1.5 * scaleLogo}rem` }}
//       >
//         {organizationName.charAt(0)}
//       </div>
//     );

//   const Name = () => (
//     <h3 className="font-bold" style={{ color: colors.text, fontSize: `${1.1 * scaleLogo}rem` }}>
//       {organizationName}
//     </h3>
//   );

//   const Branding = () => (
//     <div className="flex items-center gap-3">
//       {(branding === "logo-only" || branding === "logo-name") && <Logo />}
//       {(branding === "name-only" || branding === "logo-name") && <Name />}
//     </div>
//   );

//   if (theme === "minimal") {
//     return (
//       <div className="flex font-sans overflow-hidden shrink-0" style={wrapperStyle}>
//         <div className="flex-1 p-16 flex flex-col justify-center">
//           <div className="mb-6">
//             <Branding />
//           </div>
//           {has(job.department) && (
//             <p className="text-sm uppercase tracking-[0.3em] font-light mb-3" style={{ color: colors.accent }}>
//               {job.department}
//             </p>
//           )}
//           <h1 className="font-light mb-4" style={{ color: colors.text, ...headingStyle }}>
//             {job.jobTitle || "Job Title"}
//           </h1>
//           <div className="h-px w-20 my-6" style={{ backgroundColor: colors.primary }} />
//           <div className="flex gap-8 flex-wrap text-base font-light" style={{ color: `${colors.text}99` }}>
//             {metaItems.map((item) => (
//               <span key={item.label}>{item.value}</span>
//             ))}
//           </div>
//           <div className="flex gap-2 flex-wrap mt-8">
//             {skills.slice(0, 5).map((skill) => (
//               <span
//                 key={skill}
//                 className="px-4 py-2 text-sm font-light border"
//                 style={{ borderColor: `${colors.text}30`, color: colors.text }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//         <div
//           className="w-96 flex flex-col items-center justify-center text-white text-center px-10"
//           style={{ backgroundColor: colors.primary }}
//         >
//           <div className="text-7xl font-thin mb-4">+</div>
//           <p className="text-2xl font-light">Join Us</p>
//         </div>
//       </div>
//     );
//   }

//   if (theme === "newspaper") {
//     return (
//       <div className="font-serif overflow-hidden shrink-0" style={wrapperStyle}>
//         <div className="h-full flex flex-col">
//           <div
//             className="border-b-2 px-12 py-6 flex items-center justify-between"
//             style={{ borderColor: colors.primary }}
//           >
//             <Branding />
//             <p className="text-lg font-bold" style={{ color: colors.primary }}>
//               CAREERS
//             </p>
//           </div>
//           <div className="flex-1 px-12 py-8">
//             <div className="border-b pb-6 mb-6" style={{ borderColor: `${colors.text}20` }}>
//               <h1 className="font-black leading-tight mb-2" style={{ color: colors.text, ...headingStyle }}>
//                 {job.jobTitle || "Job Title"}
//               </h1>
//               {has(employmentTypeDisplay) && (
//                 <p className="text-lg italic" style={{ color: `${colors.text}77` }}>
//                   {employmentTypeDisplay}
//                 </p>
//               )}
//             </div>
//             <div className="grid grid-cols-3 gap-6 mb-6">
//               {metaItems.slice(0, 6).map((item) => (
//                 <div key={item.label}>
//                   <span className="text-xs uppercase tracking-wider font-bold" style={{ color: colors.primary }}>
//                     {item.label}
//                   </span>
//                   <p className="text-base" style={{ color: colors.text }}>
//                     {item.value}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {skills.slice(0, 6).map((skill) => (
//                 <span
//                   key={skill}
//                   className="px-3 py-1.5 border text-xs font-bold uppercase"
//                   style={{ borderColor: `${colors.text}30`, color: colors.primary }}
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (theme === "tech") {
//     return (
//       <div className="font-mono overflow-hidden relative p-14 flex flex-col justify-between shrink-0" style={wrapperStyle}>
//         <div
//           className="absolute inset-0 opacity-20 pointer-events-none"
//           style={{
//             backgroundImage: `linear-gradient(${colors.accent} 1px, transparent 1px), linear-gradient(90deg, ${colors.accent} 1px, transparent 1px)`,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="relative z-10 flex justify-between items-start">
//           <Branding />
//           <div
//             className="px-4 py-2 border rounded text-xs font-semibold"
//             style={{ borderColor: `${colors.primary}50`, color: colors.primary }}
//           >
//             ACTIVE
//           </div>
//         </div>
//         <div className="relative z-10">
//           {has(job.department) && (
//             <p className="text-base mb-2" style={{ color: colors.accent }}>
//               # {job.department}
//             </p>
//           )}
//           <h1 className="font-bold mb-6 text-white" style={headingStyle}>
//             {job.jobTitle || "Job Title"}
//           </h1>
//           <div className="flex gap-10 flex-wrap mb-8">
//             {metaItems.map((item) => (
//               <div key={item.label}>
//                 <span className="block text-xs uppercase tracking-wider mb-1" style={{ color: colors.accent }}>
//                   {item.label}
//                 </span>
//                 <span className="text-white font-semibold text-lg">{item.value}</span>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {skills.slice(0, 6).map((skill) => (
//               <span
//                 key={skill}
//                 className="px-4 py-2 border text-sm rounded"
//                 style={{ borderColor: colors.accent, color: colors.text }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//         <div className="relative z-10 flex justify-end">
//           <div className="px-6 py-3 rounded text-lg font-bold" style={{ backgroundColor: colors.primary, color: colors.bg }}>
//             Apply Now
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Default: corporate
//   return (
//     <div className="flex font-sans overflow-hidden relative shrink-0" style={wrapperStyle}>
//       <div className="w-2/3 p-14 flex flex-col justify-between h-full z-10">
//         <div>
//           <div className="mb-5">
//             <Branding />
//           </div>
//           {has(job.department) && (
//             <span
//               className="inline-block px-4 py-1.5 font-bold rounded-full text-xs mb-5"
//               style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
//             >
//               {job.department}
//             </span>
//           )}
//           <h1 className="font-extrabold mb-6" style={{ color: colors.text, ...headingStyle }}>
//             {job.jobTitle || "Job Title"}
//           </h1>
//           <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
//             {metaItems.map((item) => (
//               <div key={item.label} className="text-base font-medium" style={{ color: `${colors.text}aa` }}>
//                 <span className="font-semibold mr-1" style={{ color: colors.accent }}>
//                   {item.label}:
//                 </span>
//                 {item.value}
//               </div>
//             ))}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {skills.slice(0, 6).map((skill) => (
//               <span key={skill} className="px-4 py-2 font-semibold text-sm rounded-md bg-gray-100 text-gray-800">
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//         <p className="text-xl font-bold pt-6" style={{ color: colors.primary }}>
//           Apply Now!
//         </p>
//       </div>
//       <div
//         className="w-1/3 absolute right-0 top-0 bottom-0 flex items-center justify-center"
//         style={{ backgroundColor: colors.primary }}
//       >
//         <div className="transform -rotate-90 text-7xl font-black tracking-tighter text-white opacity-15 uppercase whitespace-nowrap">
//           JOIN TEAM
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { experienceLevelOptions } from "./createadvertisementdata";

/**
 * Hiring360 job pamphlet renderer.
 *
 * Layout guarantees:
 * - Fixed export size: 1200 × 630
 * - No description field is rendered
 * - Title/logo controls are clamped so layouts never break
 * - Every theme uses fixed regions instead of content-driven height
 * - Long values are safely truncated instead of pushing other blocks out
 */
export const PAMPHLET_THEME_META = [
  { key: "corporate", label: "Corporate", description: "Executive recruitment brief." },
  { key: "bold", label: "Bold", description: "Large headline recruitment poster." },
  { key: "gradient", label: "Gradient", description: "Modern vibrant showcase." },
  { key: "dark", label: "Dark", description: "Premium dark hiring poster." },
  { key: "minimal", label: "Minimal", description: "Swiss editorial layout." },
  { key: "newspaper", label: "Newspaper", description: "Print-style career announcement." },
  { key: "tech", label: "Tech", description: "Technology system-style poster." },
];

const DEFAULT_COLORS = {
  primary: "#5B21B6",
  accent: "#8B5CF6",
  text: "#111827",
  bg: "#FFFFFF",
  muted: "#6B7280",
};

const has = (value) =>
  Boolean(value) && (!Array.isArray(value) || value.length > 0);

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number(value) || min));

function normalizePalette(colors = {}) {
  return {
    primary: colors.primary || DEFAULT_COLORS.primary,
    accent: colors.accent || DEFAULT_COLORS.accent,
    text: colors.text || DEFAULT_COLORS.text,
    bg: colors.bg || colors.background || DEFAULT_COLORS.bg,
    muted: colors.muted || colors.secondary || DEFAULT_COLORS.muted,
  };
}

function alpha(color, opacityHex = "20") {
  if (/^#[0-9a-f]{6}$/i.test(color)) return `${color}${opacityHex}`;

  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const expanded =
      "#" +
      color
        .slice(1)
        .split("")
        .map((character) => character + character)
        .join("");

    return `${expanded}${opacityHex}`;
  }

  return color;
}

function readableOn(color, fallback = "#FFFFFF") {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return fallback;

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? "#111827" : "#FFFFFF";
}

function formatDate(value) {
  if (!value) return "";

  const raw = String(value);

  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw;

  const date = new Date(`${raw.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function experienceLabel(value) {
  return (
    experienceLevelOptions.find((option) => option.value === value)?.label ||
    value ||
    ""
  );
}

function deriveJobDisplay(job) {
  const employmentTypeDisplay =
    job?.employmentType === "Internship" && job?.internshipPaid
      ? `${job.internshipPaid} Internship`
      : job?.employmentType || "";

  const compensationDisplay =
    job?.employmentType === "Internship" &&
    job?.internshipPaid === "Unpaid"
      ? "Unpaid"
      : job?.salary || "";

  return {
    employmentTypeDisplay,
    compensationDisplay,
  };
}

function buildMetaItems(job, employmentTypeDisplay, compensationDisplay) {
  return [
    has(job.location) && {
      label: "Location",
      value: job.location,
    },
    has(job.department) && {
      label: "Department",
      value: job.department,
    },
    has(job.experience) && {
      label: "Experience",
      value: experienceLabel(job.experience),
    },
    has(employmentTypeDisplay) && {
      label: "Employment",
      value: employmentTypeDisplay,
    },
    has(job.workMode) && {
      label: "Work mode",
      value: job.workMode,
    },
    has(compensationDisplay) && {
      label: "Compensation",
      value: compensationDisplay,
    },
    has(job.deadline) && {
      label: "Apply by",
      value: formatDate(job.deadline),
    },
  ].filter(Boolean);
}

function getTitleFontSize(title, requestedSize, multiplier = 1) {
  const base = clamp(requestedSize, 42, 82) * multiplier;
  const length = String(title || "").length;

  if (length > 48) return Math.max(38, base * 0.67);
  if (length > 38) return Math.max(40, base * 0.75);
  if (length > 28) return Math.max(42, base * 0.84);
  if (length > 20) return Math.max(44, base * 0.92);

  return base;
}

function Branding({
  branding = "logo-name",
  organizationName = "Your Company",
  organizationLogoUrl = null,
  inverse = false,
  logoSize = 72,
  palette,
  compact = false,
}) {
  // The UI labels this value as px, so use it as px rather than as a percentage.
  const visualLogoPx = clamp(logoSize, 40, compact ? 76 : 96);

  const showLogo =
    branding === "logo-only" || branding === "logo-name";

  const showName =
    branding === "name-only" || branding === "logo-name";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {showLogo && (
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{
            width: visualLogoPx,
            height: visualLogoPx,
            backgroundColor: inverse
              ? "rgba(255,255,255,0.12)"
              : "#FFFFFF",
            border: inverse
              ? "1px solid rgba(255,255,255,0.14)"
              : `1px solid ${alpha(palette.text, "14")}`,
          }}
        >
          {organizationLogoUrl ? (
            <img
              src={organizationLogoUrl}
              alt={`${organizationName} logo`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span
              className="font-bold"
              style={{
                color: inverse ? "#FFFFFF" : palette.primary,
                fontSize: Math.max(16, visualLogoPx * 0.28),
              }}
            >
              {(organizationName || "C").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      {showName && (
        <div className="min-w-0">
          <p
            className="max-w-[210px] truncate font-semibold leading-tight tracking-[-0.02em]"
            style={{
              color: inverse ? "#FFFFFF" : palette.text,
              fontSize: compact ? 15 : 17,
            }}
          >
            {organizationName}
          </p>

          <p
            className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: inverse
                ? "rgba(255,255,255,0.56)"
                : palette.muted,
            }}
          >
            Careers
          </p>
        </div>
      )}
    </div>
  );
}

function MetaItem({
  item,
  palette,
  inverse = false,
  compact = false,
}) {
  return (
    <div className="min-w-0">
      <p
        className="truncate font-semibold uppercase tracking-[0.13em]"
        style={{
          fontSize: compact ? 9 : 10,
          color: inverse
            ? "rgba(255,255,255,0.5)"
            : palette.muted,
        }}
      >
        {item.label}
      </p>

      <p
        className="mt-1 truncate font-semibold"
        title={String(item.value)}
        style={{
          fontSize: compact ? 14 : 16,
          color: inverse ? "#FFFFFF" : palette.text,
        }}
      >
        {item.value}
      </p>
    </div>
  );
}

function MetaGrid({
  items,
  palette,
  columns = 3,
  inverse = false,
  boxed = false,
  compact = false,
}) {
  return (
    <div
      className="grid min-w-0"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: compact ? 10 : 14,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={boxed ? "min-w-0 rounded-xl border" : "min-w-0"}
          style={
            boxed
              ? {
                  padding: compact ? "11px 12px" : "13px 14px",
                  borderColor: inverse
                    ? "rgba(255,255,255,0.10)"
                    : alpha(palette.text, "16"),
                  backgroundColor: inverse
                    ? "rgba(255,255,255,0.035)"
                    : alpha(palette.text, "04"),
                }
              : undefined
          }
        >
          <MetaItem
            item={item}
            palette={palette}
            inverse={inverse}
            compact={compact}
          />
        </div>
      ))}
    </div>
  );
}

function Skills({
  skills = [],
  palette,
  inverse = false,
  max = 7,
  compact = false,
  tech = false,
}) {
  if (!skills.length) return null;

  return (
    <div className="flex max-h-[76px] flex-wrap content-start gap-2 overflow-hidden">
      {skills.slice(0, max).map((skill) => (
        <span
          key={skill}
          className="max-w-[180px] truncate rounded-full border font-medium"
          title={skill}
          style={{
            padding: compact ? "5px 10px" : "7px 12px",
            fontSize: compact ? 10 : 11,
            color: inverse ? "#FFFFFF" : palette.text,
            borderColor: inverse
              ? "rgba(255,255,255,0.18)"
              : alpha(palette.text, "18"),
            backgroundColor: tech
              ? alpha(palette.accent, "10")
              : inverse
                ? "rgba(255,255,255,0.04)"
                : alpha(palette.text, "04"),
          }}
        >
          {tech ? `<${skill} />` : skill}
        </span>
      ))}
    </div>
  );
}

function ThemeTitle({
  children,
  color,
  size,
  maxWidth = "100%",
  lineHeight = 0.98,
  weight = 700,
  className = "",
}) {
  return (
    <h1
      className={`overflow-hidden tracking-[-0.055em] ${className}`}
      style={{
        color,
        fontSize: size,
        lineHeight,
        fontWeight: weight,
        maxWidth,
        maxHeight: size * lineHeight * 2.05,
      }}
    >
      {children}
    </h1>
  );
}

export default function JobPamphletPreview({
  theme = "corporate",
  job = {},
  colors = {},
  branding = "logo-name",
  logoSize = 72,
  headingSize = 60,
  organizationName = "Your Company",
  organizationLogoUrl = null,
}) {
  const palette = normalizePalette(colors);

  const { employmentTypeDisplay, compensationDisplay } =
    deriveJobDisplay(job);

  const title = job?.jobTitle || "Career Opportunity";

  const skills = Array.isArray(job?.skills)
    ? job.skills.filter(Boolean)
    : [];

  const metaItems = buildMetaItems(
    job,
    employmentTypeDisplay,
    compensationDisplay
  );

  const base = {
    width: "1200px",
    height: "630px",
  };

  // ============================================================
  // CORPORATE
  // ============================================================
  if (theme === "corporate") {
    const titleSize = getTitleFontSize(title, headingSize, 1.05);

    return (
      <div
        className="grid overflow-hidden bg-white font-sans shrink-0"
        style={{
          ...base,
          gridTemplateColumns: "310px 1fr",
        }}
      >
        <aside
          className="relative grid overflow-hidden p-9 text-white"
          style={{
            gridTemplateRows: "112px minmax(0, 1fr) 170px",
            backgroundColor: palette.primary,
          }}
        >
          <div
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full"
            style={{ backgroundColor: alpha(palette.accent, "28") }}
          />

          <Branding
            branding={branding}
            organizationName={organizationName}
            organizationLogoUrl={organizationLogoUrl}
            inverse
            logoSize={logoSize}
            palette={palette}
            compact
          />

          <div className="self-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Hiring now
            </p>

            <p className="mt-3 text-[27px] font-semibold leading-[1.08]">
              Your next opportunity starts here.
            </p>
          </div>

          <div className="grid content-end gap-5 overflow-hidden">
            {metaItems.slice(0, 3).map((item) => (
              <MetaItem
                key={item.label}
                item={item}
                palette={palette}
                inverse
                compact
              />
            ))}
          </div>
        </aside>

        <main
          className="grid min-w-0 px-11 py-9"
          style={{
            gridTemplateRows: "70px 180px 1px 160px minmax(0, 1fr)",
            rowGap: 16,
          }}
        >
          <div className="flex min-w-0 items-start justify-between">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: palette.accent }}
              >
                Career opportunity
              </p>

              <p
                className="mt-1 text-[13px]"
                style={{ color: palette.muted }}
              >
                {employmentTypeDisplay || "Professional role"}
                {job.workMode ? ` · ${job.workMode}` : ""}
              </p>
            </div>

            <span
              className="rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em]"
              style={{
                color: palette.primary,
                backgroundColor: alpha(palette.primary, "12"),
              }}
            >
              Open position
            </span>
          </div>

          <div className="flex min-w-0 items-center">
            <ThemeTitle
              color={palette.text}
              size={titleSize}
              maxWidth="760px"
              weight={700}
            >
              {title}
            </ThemeTitle>
          </div>

          <div style={{ backgroundColor: alpha(palette.text, "18") }} />

          <MetaGrid
            items={metaItems.slice(0, 6)}
            palette={palette}
            columns={3}
          />

          <div className="flex min-w-0 items-end justify-between gap-8 overflow-hidden">
            <div className="min-w-0 flex-1">
              <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: palette.muted }}
              >
                Core skills
              </p>

              <Skills
                skills={skills}
                palette={palette}
                max={7}
                compact
              />
            </div>

            <div
              className="shrink-0 rounded-xl px-5 py-4 text-right text-white"
              style={{ backgroundColor: palette.text }}
            >
              <p className="text-[9px] uppercase tracking-[0.14em] opacity-55">
                Interested?
              </p>
              <p className="mt-1 text-[17px] font-semibold">
                Apply now →
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // BOLD
  // ============================================================
  if (theme === "bold") {
    const titleSize = getTitleFontSize(title, headingSize, 1.12);

    return (
      <div
        className="relative overflow-hidden font-sans shrink-0"
        style={{
          ...base,
          backgroundColor: "#FFF8EE",
        }}
      >
        <div
          className="absolute left-0 top-0 h-full w-[88px]"
          style={{ backgroundColor: palette.primary }}
        />

        <div
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ backgroundColor: alpha(palette.primary, "14") }}
        />

        <div
          className="grid h-full pl-[128px] pr-10 py-8"
          style={{
            gridTemplateRows: "82px minmax(0,1fr) 58px",
            rowGap: 16,
          }}
        >
          <div className="flex items-start justify-between">
            <Branding
              branding={branding}
              organizationName={organizationName}
              organizationLogoUrl={organizationLogoUrl}
              logoSize={logoSize}
              palette={palette}
              compact
            />

            <span
              className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{
                backgroundColor: palette.primary,
                color: readableOn(palette.primary),
              }}
            >
              Open role
            </span>
          </div>

          <div
            className="grid min-h-0 gap-8 overflow-hidden"
            style={{
              gridTemplateColumns: "minmax(0,1fr) 360px",
            }}
          >
            <section
              className="grid min-w-0 overflow-hidden"
              style={{
                gridTemplateRows: "32px 150px minmax(0,1fr)",
                rowGap: 14,
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{ color: palette.primary }}
              >
                We are hiring
              </p>

              <ThemeTitle
                color={palette.text}
                size={titleSize}
                maxWidth="650px"
                weight={800}
                lineHeight={0.94}
              >
                {title}
              </ThemeTitle>

              <MetaGrid
                items={metaItems.slice(0, 6)}
                palette={palette}
                columns={2}
                compact
              />
            </section>

            <aside className="grid min-h-0 overflow-hidden rounded-[24px] border bg-white p-5"
              style={{
                gridTemplateRows: "28px minmax(0,1fr) 88px",
                rowGap: 14,
                borderColor: alpha(palette.primary, "18"),
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.17em]"
                style={{ color: palette.primary }}
              >
                Skills required
              </p>

              <Skills
                skills={skills}
                palette={palette}
                max={8}
                compact
              />

              <div
                className="rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: palette.text }}
              >
                <p className="text-[9px] uppercase tracking-[0.13em] text-white/50">
                  Next step
                </p>
                <p className="mt-1 text-[18px] font-bold">
                  Apply & grow with us
                </p>
              </div>
            </aside>
          </div>

          <div className="flex items-center justify-between overflow-hidden">
            <p
              className="truncate text-[11px]"
              style={{ color: palette.muted }}
            >
              {job.location || job.department || "Career opening"}
            </p>

            <p
              className="shrink-0 text-[22px] font-black tracking-[-0.03em]"
              style={{ color: palette.primary }}
            >
              APPLY NOW →
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // GRADIENT
  // ============================================================
  if (theme === "gradient") {
    const titleSize = getTitleFontSize(title, headingSize, 1.08);

    return (
      <div
        className="relative overflow-hidden font-sans text-white shrink-0"
        style={{
          ...base,
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 52%, #0EA5E9 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_5%_95%,rgba(255,255,255,0.15),transparent_25%)]" />

        <div
          className="relative z-10 grid h-full p-8"
          style={{
            gridTemplateRows: "82px minmax(0,1fr) 52px",
            rowGap: 16,
          }}
        >
          <div className="flex items-start justify-between">
            <Branding
              branding={branding}
              organizationName={organizationName}
              organizationLogoUrl={organizationLogoUrl}
              inverse
              logoSize={logoSize}
              palette={palette}
              compact
            />

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
              Hiring announcement
            </span>
          </div>

          <div
            className="grid min-h-0 gap-7 overflow-hidden"
            style={{
              gridTemplateColumns: "minmax(0,1.45fr) 360px",
            }}
          >
            <section
              className="grid min-w-0 overflow-hidden"
              style={{
                gridTemplateRows: "28px 154px minmax(0,1fr)",
                rowGap: 14,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                Join our team
              </p>

              <ThemeTitle
                color="#FFFFFF"
                size={titleSize}
                maxWidth="700px"
                weight={700}
                lineHeight={0.95}
              >
                {title}
              </ThemeTitle>

              <div className="min-h-0 rounded-[22px] border border-white/16 bg-white/10 p-4">
                <MetaGrid
                  items={metaItems.slice(0, 6)}
                  palette={palette}
                  columns={3}
                  inverse
                  compact
                />
              </div>
            </section>

            <aside
              className="grid min-h-0 gap-4 overflow-hidden"
              style={{ gridTemplateRows: "1fr 1fr" }}
            >
              <div className="min-h-0 overflow-hidden rounded-[22px] border border-white/16 bg-white/10 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
                  Highlights
                </p>

                <div className="mt-4 grid gap-3">
                  {metaItems.slice(0, 4).map((item) => (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-center justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="truncate text-[9px] uppercase tracking-[0.12em] text-white/50">
                        {item.label}
                      </span>

                      <span
                        className="max-w-[170px] truncate text-right text-[13px] font-semibold"
                        title={String(item.value)}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-h-0 overflow-hidden rounded-[22px] border border-white/16 bg-white/10 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
                  Skills
                </p>

                <div className="mt-4">
                  <Skills
                    skills={skills}
                    palette={palette}
                    inverse
                    compact
                    max={7}
                  />
                </div>
              </div>
            </aside>
          </div>

          <div className="flex min-w-0 items-center justify-between">
            <p className="truncate text-[11px] text-white/70">
              {job.department || "Career role"}
              {job.workMode ? ` · ${job.workMode}` : ""}
            </p>

            <span
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[12px] font-bold"
              style={{ color: palette.primary }}
            >
              Apply now →
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DARK
  // ============================================================
  if (theme === "dark") {
    const titleSize = getTitleFontSize(title, headingSize, 1.08);

    return (
      <div
        className="relative overflow-hidden bg-[#0B1020] font-sans text-white shrink-0"
        style={base}
      >
        <div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: alpha(palette.primary, "36") }}
        />

        <div
          className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: alpha(palette.accent, "28") }}
        />

        <div
          className="relative z-10 grid h-full"
          style={{
            gridTemplateColumns: "minmax(0,1fr) 360px",
          }}
        >
          <main
            className="grid min-w-0 overflow-hidden px-9 py-8"
            style={{
              gridTemplateRows: "78px 26px 150px 172px minmax(0,1fr)",
              rowGap: 13,
            }}
          >
            <div className="flex items-start justify-between">
              <Branding
                branding={branding}
                organizationName={organizationName}
                organizationLogoUrl={organizationLogoUrl}
                inverse
                logoSize={logoSize}
                palette={palette}
                compact
              />

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/65">
                Open vacancy
              </span>
            </div>

            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: palette.accent }}
            >
              Premium opportunity
            </p>

            <ThemeTitle
              color="#FFFFFF"
              size={titleSize}
              maxWidth="720px"
              weight={700}
              lineHeight={0.95}
            >
              {title}
            </ThemeTitle>

            <MetaGrid
              items={metaItems.slice(0, 6)}
              palette={palette}
              columns={3}
              inverse
              boxed
              compact
            />

            <div className="min-h-0 overflow-hidden">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50">
                Key skills
              </p>

              <Skills
                skills={skills}
                palette={palette}
                inverse
                compact
                max={7}
              />
            </div>
          </main>

          <aside className="grid min-h-0 overflow-hidden border-l border-white/10 px-7 py-8"
            style={{
              gridTemplateRows: "minmax(0,1fr) 176px",
              rowGap: 18,
            }}
          >
            <div className="min-h-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Position snapshot
              </p>

              <div className="mt-4 grid gap-4">
                {metaItems.slice(0, 5).map((item) => (
                  <MetaItem
                    key={item.label}
                    item={item}
                    palette={palette}
                    inverse
                    compact
                  />
                ))}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[24px] p-5"
              style={{
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
              }}
            >
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/60">
                Your next move
              </p>

              <p className="mt-2 text-[25px] font-bold leading-[1.02]">
                Apply for this role
              </p>

              <p className="mt-3 line-clamp-2 text-[11px] leading-4 text-white/70">
                Take the next step with {organizationName}.
              </p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ============================================================
  // MINIMAL
  // ============================================================
  if (theme === "minimal") {
    const titleSize = getTitleFontSize(title, headingSize, 1);

    return (
      <div
        className="relative overflow-hidden bg-white font-sans shrink-0"
        style={base}
      >
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: `linear-gradient(to right, ${palette.text} 1px, transparent 1px), linear-gradient(to bottom, ${palette.text} 1px, transparent 1px)`,
            backgroundSize: "120px 105px",
          }}
        />

        <div
          className="relative z-10 grid h-full"
          style={{ gridTemplateColumns: "150px 1fr" }}
        >
          <aside
            className="grid border-r px-7 py-8"
            style={{
              gridTemplateRows: "120px minmax(0,1fr) 80px",
              borderColor: alpha(palette.text, "18"),
            }}
          >
            <p
              className="text-[78px] font-light leading-none tracking-[-0.08em]"
              style={{ color: alpha(palette.primary, "35") }}
            >
              01
            </p>

            <div className="self-center [writing-mode:vertical-rl] rotate-180">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: palette.muted }}
              >
                {job.department || "Careers"} · open role
              </p>
            </div>

            <p
              className="self-end text-[9px] uppercase tracking-[0.15em]"
              style={{ color: palette.muted }}
            >
              Hiring360
            </p>
          </aside>

          <main
            className="grid min-w-0 overflow-hidden px-10 py-8"
            style={{
              gridTemplateRows: "82px 174px 148px minmax(0,1fr)",
              rowGap: 16,
            }}
          >
            <div className="flex items-start justify-between">
              <Branding
                branding={branding}
                organizationName={organizationName}
                organizationLogoUrl={organizationLogoUrl}
                logoSize={logoSize}
                palette={palette}
                compact
              />

              <p
                className="text-[9px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: palette.muted }}
              >
                {formatDate(job.deadline) || "Open application"}
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_240px] gap-9 overflow-hidden">
              <div className="min-w-0">
                <p
                  className="mb-3 text-[10px] font-medium uppercase tracking-[0.23em]"
                  style={{ color: palette.primary }}
                >
                  We are hiring
                </p>

                <ThemeTitle
                  color={palette.text}
                  size={titleSize}
                  maxWidth="720px"
                  weight={400}
                  lineHeight={0.96}
                >
                  {title}
                </ThemeTitle>
              </div>

              <div
                className="overflow-hidden border-l pl-6"
                style={{ borderColor: alpha(palette.text, "22") }}
              >
                <p
                  className="text-[9px] uppercase tracking-[0.14em]"
                  style={{ color: palette.muted }}
                >
                  Key details
                </p>

                <div className="mt-3 grid gap-3">
                  {metaItems.slice(0, 4).map((item) => (
                    <MetaItem
                      key={item.label}
                      item={item}
                      palette={palette}
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-3 overflow-hidden border-y"
              style={{
                borderColor: alpha(palette.text, "18"),
              }}
            >
              {metaItems.slice(0, 6).map((item, index) => (
                <div
                  key={item.label}
                  className={`min-w-0 px-3 py-3 ${
                    index % 3 !== 0 ? "border-l" : ""
                  } ${index >= 3 ? "border-t" : ""}`}
                  style={{ borderColor: alpha(palette.text, "15") }}
                >
                  <MetaItem
                    item={item}
                    palette={palette}
                    compact
                  />
                </div>
              ))}
            </div>

            <div className="flex min-w-0 items-end justify-between gap-8 overflow-hidden">
              <div className="min-w-0 flex-1">
                <Skills
                  skills={skills}
                  palette={palette}
                  compact
                  max={7}
                />
              </div>

              <p
                className="shrink-0 text-[22px] font-medium"
                style={{ color: palette.primary }}
              >
                Apply →
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ============================================================
  // NEWSPAPER
  // ============================================================
  if (theme === "newspaper") {
    const titleSize = getTitleFontSize(title, headingSize, 0.98);

    return (
      <div
        className="relative overflow-hidden shrink-0"
        style={{
          ...base,
          backgroundColor: "#FFFCF5",
          color: palette.text,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div
          className="grid h-full px-9 py-6"
          style={{
            gridTemplateRows: "82px 145px minmax(0,1fr) 38px",
            rowGap: 10,
          }}
        >
          <header
            className="flex items-end justify-between border-b-[3px] pb-3"
            style={{ borderColor: palette.text }}
          >
            <Branding
              branding={branding}
              organizationName={organizationName}
              organizationLogoUrl={organizationLogoUrl}
              logoSize={logoSize}
              palette={palette}
              compact
            />

            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.25em]">
                Career Gazette
              </p>
              <p
                className="mt-1 text-[9px]"
                style={{ color: palette.muted }}
              >
                Opportunity bulletin
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em]">
                Now hiring
              </p>
              <p
                className="mt-1 text-[9px]"
                style={{ color: palette.muted }}
              >
                {formatDate(job.deadline) || "Applications open"}
              </p>
            </div>
          </header>

          <section
            className="grid place-items-center overflow-hidden border-b pb-3 text-center"
            style={{ borderColor: alpha(palette.text, "25") }}
          >
            <div className="min-w-0">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.22em]"
                style={{ color: palette.primary }}
              >
                Featured vacancy
              </p>

              <ThemeTitle
                color={palette.text}
                size={titleSize}
                maxWidth="1020px"
                weight={800}
                lineHeight={0.94}
                className="mx-auto mt-2"
              >
                {title}
              </ThemeTitle>

              <p
                className="mt-2 text-[12px] italic"
                style={{ color: palette.muted }}
              >
                {employmentTypeDisplay || "Career opportunity"}
                {job.location ? ` · ${job.location}` : ""}
              </p>
            </div>
          </section>

          <main
            className="grid min-h-0 overflow-hidden"
            style={{
              gridTemplateColumns: "1.25fr 1fr 1fr",
            }}
          >
            <section className="min-w-0 overflow-hidden pr-6">
              <p
                className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em]"
                style={{ color: palette.primary }}
              >
                Position focus
              </p>

              <MetaGrid
                items={metaItems.slice(0, 4)}
                palette={palette}
                columns={2}
                compact
              />

              <div
                className="mt-5 border-t pt-3"
                style={{ borderColor: alpha(palette.text, "25") }}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.13em]">
                  Core skills
                </p>

                <Skills
                  skills={skills}
                  palette={palette}
                  compact
                  max={8}
                />
              </div>
            </section>

            <section
              className="min-w-0 overflow-hidden border-l px-6"
              style={{ borderColor: alpha(palette.text, "26") }}
            >
              <p
                className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em]"
                style={{ color: palette.primary }}
              >
                Job details
              </p>

              <div className="grid gap-5">
                {metaItems.slice(4, 7).map((item) => (
                  <MetaItem
                    key={item.label}
                    item={item}
                    palette={palette}
                    compact
                  />
                ))}
              </div>
            </section>

            <section
              className="min-w-0 overflow-hidden border-l pl-6"
              style={{ borderColor: alpha(palette.text, "26") }}
            >
              <p
                className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em]"
                style={{ color: palette.primary }}
              >
                Apply now
              </p>

              <MetaItem
                item={{
                  label: "Organization",
                  value: organizationName,
                }}
                palette={palette}
                compact
              />

              <div className="mt-5">
                <MetaItem
                  item={{
                    label: "Employment",
                    value: employmentTypeDisplay || "Professional",
                  }}
                  palette={palette}
                  compact
                />
              </div>

              <div
                className="mt-6 border-[3px] px-4 py-3 text-center"
                style={{
                  borderColor: palette.primary,
                  color: palette.primary,
                }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                  Applications
                </p>

                <p className="mt-1 text-[18px] font-black">
                  OPEN NOW
                </p>
              </div>
            </section>
          </main>

          <footer
            className="flex min-w-0 items-center justify-between border-t pt-2"
            style={{ borderColor: palette.text }}
          >
            <p className="truncate text-[9px] uppercase tracking-[0.1em]">
              {organizationName} · Equal opportunity employer
            </p>

            <p className="shrink-0 text-[12px] font-bold">
              Apply today →
            </p>
          </footer>
        </div>
      </div>
    );
  }

  // ============================================================
  // TECH
  // ============================================================
  if (theme === "tech") {
    const titleSize = getTitleFontSize(title, headingSize, 1.02);
    const line = "rgba(255,255,255,0.09)";

    return (
      <div
        className="relative overflow-hidden bg-[#080A0F] font-mono text-white shrink-0"
        style={base}
      >
        <div
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: alpha(palette.primary, "42") }}
        />

        <header
          className="relative z-10 flex h-[76px] items-center justify-between border-b px-8"
          style={{ borderColor: line }}
        >
          <Branding
            branding={branding}
            organizationName={organizationName}
            organizationLogoUrl={organizationLogoUrl}
            inverse
            logoSize={logoSize}
            palette={palette}
            compact
          />

          <div className="flex items-center gap-5 text-[9px] uppercase tracking-[0.12em] text-white/40">
            <span>ROLE / ACTIVE</span>
            <span>REQ / {job.department || "CAREERS"}</span>

            <span className="flex items-center gap-2 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Recruiting
            </span>
          </div>
        </header>

        <div
          className="relative z-10 grid h-[554px]"
          style={{
            gridTemplateColumns: "minmax(0,1fr) 360px",
          }}
        >
          <main
            className="grid min-w-0 overflow-hidden px-8 py-6"
            style={{
              gridTemplateRows: "26px 132px 160px minmax(0,1fr)",
              rowGap: 13,
            }}
          >
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: palette.accent }}
            >
              // open_position
            </p>

            <ThemeTitle
              color="#FFFFFF"
              size={titleSize}
              maxWidth="720px"
              weight={700}
              lineHeight={0.94}
            >
              {title}
            </ThemeTitle>

            <MetaGrid
              items={metaItems.slice(0, 6)}
              palette={palette}
              columns={3}
              inverse
              boxed
              compact
            />

            <div className="self-end overflow-hidden">
              <p className="mb-2 text-[8px] uppercase tracking-[0.14em] text-white/32">
                stack / capabilities
              </p>

              <Skills
                skills={skills}
                palette={palette}
                inverse
                tech
                compact
                max={7}
              />
            </div>
          </main>

          <aside
            className="grid min-h-0 overflow-hidden border-l bg-[#11141B] p-6"
            style={{
              gridTemplateRows: "32px minmax(0,1fr) 150px",
              rowGap: 13,
              borderColor: line,
            }}
          >
            <div className="flex items-start justify-between">
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/30">
                opportunity.json
              </p>

              <span
                className="rounded px-2 py-1 text-[8px]"
                style={{
                  color: palette.accent,
                  backgroundColor: alpha(palette.accent, "12"),
                }}
              >
                LIVE
              </span>
            </div>

            <div className="grid content-start gap-4 overflow-hidden text-[11px]">
              {[
                ["team", job.department || "Careers"],
                ["mode", job.workMode || "Flexible"],
                ["type", employmentTypeDisplay || "Professional"],
                ["location", job.location || "See listing"],
                ["deadline", formatDate(job.deadline) || "Open"],
              ].map(([key, value]) => (
                <div key={key} className="min-w-0 truncate">
                  <span style={{ color: palette.accent }}>
                    "{key}"
                  </span>
                  <span className="text-white/30">: </span>
                  <span className="text-white/72">
                    "{value}"
                  </span>
                </div>
              ))}
            </div>

            <div
              className="overflow-hidden rounded-xl border p-4"
              style={{
                borderColor: alpha(palette.primary, "55"),
                background: `linear-gradient(135deg, ${alpha(
                  palette.primary,
                  "25"
                )}, ${alpha(palette.accent, "10")})`,
              }}
            >
              <p className="text-[8px] uppercase tracking-[0.14em] text-white/35">
                ready to ship?
              </p>

              <p className="mt-2 font-sans text-[22px] font-semibold">
                Apply for this role
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] text-white/35">
                  Start application
                </span>

                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full font-sans"
                  style={{
                    backgroundColor: palette.accent,
                    color: readableOn(palette.accent),
                  }}
                >
                  →
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <JobPamphletPreview
      theme="corporate"
      job={job}
      colors={colors}
      branding={branding}
      logoSize={logoSize}
      headingSize={headingSize}
      organizationName={organizationName}
      organizationLogoUrl={organizationLogoUrl}
    />
  );
}