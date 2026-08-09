import React from "react";
import { experienceLevelOptions } from "./createadvertisementdata";

const has = (value) => Boolean(value) && (!Array.isArray(value) || value.length > 0);

const experienceLabel = (value) =>
  experienceLevelOptions.find((option) => option.value === value)?.label || value;

function deriveJobDisplay(job) {
  const employmentTypeDisplay =
    job?.employmentType === "Internship" && job?.internshipPaid
      ? `${job.internshipPaid} Internship`
      : job?.employmentType || "";

  const compensationDisplay =
    job?.employmentType === "Internship" && job?.internshipPaid === "Unpaid" ? "Unpaid" : job?.salary || "";

  return { employmentTypeDisplay, compensationDisplay };
}

function buildMetaItems(job, employmentTypeDisplay, compensationDisplay) {
  return [
    has(job.location) && { label: "Location", value: job.location },
    has(job.experience) && { label: "Experience", value: experienceLabel(job.experience) },
    has(employmentTypeDisplay) && { label: "Type", value: employmentTypeDisplay },
    has(job.workMode) && { label: "Mode", value: job.workMode },
    has(compensationDisplay) && { label: "Compensation", value: compensationDisplay },
    has(job.deadline) && { label: "Apply By", value: job.deadline },
  ].filter(Boolean);
}


export default function JobPamphletPreview({
  theme = "corporate",
  job = {},
  colors = {},
  branding = "logo-name",
  logoSize = 100,
  headingSize = 100,
  organizationName = "Your Company",
  organizationLogoUrl = null,
}) {
  
  const { employmentTypeDisplay, compensationDisplay } = deriveJobDisplay(job);
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const metaItems = buildMetaItems(job, employmentTypeDisplay, compensationDisplay);
  console.log(organizationLogoUrl)
  const scaleLogo = (Number(logoSize) || 100) / 100;
  const scaleHeading = (Number(headingSize) || 100) / 100;
  const headingStyle = { fontSize: `${3 * scaleHeading}rem`, lineHeight: 1.15, maxHeight: `${120 * scaleHeading}px` };
  const logoPx = 56 * scaleLogo;
  const wrapperStyle = { width: "1200px", height: "630px", backgroundColor: colors.bg };

  const Logo = () =>
    organizationLogoUrl ? (
      <img
        src={organizationLogoUrl}
        alt={`${organizationName} logo`}
        className="rounded-lg object-contain shrink-0"
        style={{ width: logoPx, height: logoPx }}
      />
    ) : (
      <div
        className="rounded-lg flex items-center justify-center font-bold text-white shrink-0"
        style={{ width: logoPx, height: logoPx, backgroundColor: colors.primary, fontSize: `${1.5 * scaleLogo}rem` }}
      >
        {organizationName.charAt(0)}
      </div>
    );

  const Name = () => (
    <h3 className="font-bold" style={{ color: colors.text, fontSize: `${1.1 * scaleLogo}rem` }}>
      {organizationName}
    </h3>
  );

  const Branding = () => (
    <div className="flex items-center gap-3">
      {(branding === "logo-only" || branding === "logo-name") && <Logo />}
      {(branding === "name-only" || branding === "logo-name") && <Name />}
    </div>
  );

  if (theme === "minimal") {
    return (
      <div className="flex font-sans overflow-hidden shrink-0" style={wrapperStyle}>
        <div className="flex-1 p-16 flex flex-col justify-center">
          <div className="mb-6">
            <Branding />
          </div>
          {has(job.department) && (
            <p className="text-sm uppercase tracking-[0.3em] font-light mb-3" style={{ color: colors.accent }}>
              {job.department}
            </p>
          )}
          <h1 className="font-light mb-4" style={{ color: colors.text, ...headingStyle }}>
            {job.jobTitle || "Job Title"}
          </h1>
          <div className="h-px w-20 my-6" style={{ backgroundColor: colors.primary }} />
          <div className="flex gap-8 flex-wrap text-base font-light" style={{ color: `${colors.text}99` }}>
            {metaItems.map((item) => (
              <span key={item.label}>{item.value}</span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap mt-8">
            {skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-light border"
                style={{ borderColor: `${colors.text}30`, color: colors.text }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div
          className="w-96 flex flex-col items-center justify-center text-white text-center px-10"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="text-7xl font-thin mb-4">+</div>
          <p className="text-2xl font-light">Join Us</p>
        </div>
      </div>
    );
  }

  if (theme === "newspaper") {
    return (
      <div className="font-serif overflow-hidden shrink-0" style={wrapperStyle}>
        <div className="h-full flex flex-col">
          <div
            className="border-b-2 px-12 py-6 flex items-center justify-between"
            style={{ borderColor: colors.primary }}
          >
            <Branding />
            <p className="text-lg font-bold" style={{ color: colors.primary }}>
              CAREERS
            </p>
          </div>
          <div className="flex-1 px-12 py-8">
            <div className="border-b pb-6 mb-6" style={{ borderColor: `${colors.text}20` }}>
              <h1 className="font-black leading-tight mb-2" style={{ color: colors.text, ...headingStyle }}>
                {job.jobTitle || "Job Title"}
              </h1>
              {has(employmentTypeDisplay) && (
                <p className="text-lg italic" style={{ color: `${colors.text}77` }}>
                  {employmentTypeDisplay}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {metaItems.slice(0, 6).map((item) => (
                <div key={item.label}>
                  <span className="text-xs uppercase tracking-wider font-bold" style={{ color: colors.primary }}>
                    {item.label}
                  </span>
                  <p className="text-base" style={{ color: colors.text }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 border text-xs font-bold uppercase"
                  style={{ borderColor: `${colors.text}30`, color: colors.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme === "tech") {
    return (
      <div className="font-mono overflow-hidden relative p-14 flex flex-col justify-between shrink-0" style={wrapperStyle}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${colors.accent} 1px, transparent 1px), linear-gradient(90deg, ${colors.accent} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex justify-between items-start">
          <Branding />
          <div
            className="px-4 py-2 border rounded text-xs font-semibold"
            style={{ borderColor: `${colors.primary}50`, color: colors.primary }}
          >
            ACTIVE
          </div>
        </div>
        <div className="relative z-10">
          {has(job.department) && (
            <p className="text-base mb-2" style={{ color: colors.accent }}>
              # {job.department}
            </p>
          )}
          <h1 className="font-bold mb-6 text-white" style={headingStyle}>
            {job.jobTitle || "Job Title"}
          </h1>
          <div className="flex gap-10 flex-wrap mb-8">
            {metaItems.map((item) => (
              <div key={item.label}>
                <span className="block text-xs uppercase tracking-wider mb-1" style={{ color: colors.accent }}>
                  {item.label}
                </span>
                <span className="text-white font-semibold text-lg">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 border text-sm rounded"
                style={{ borderColor: colors.accent, color: colors.text }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex justify-end">
          <div className="px-6 py-3 rounded text-lg font-bold" style={{ backgroundColor: colors.primary, color: colors.bg }}>
            Apply Now
          </div>
        </div>
      </div>
    );
  }

  // Default: corporate
  return (
    <div className="flex font-sans overflow-hidden relative shrink-0" style={wrapperStyle}>
      <div className="w-2/3 p-14 flex flex-col justify-between h-full z-10">
        <div>
          <div className="mb-5">
            <Branding />
          </div>
          {has(job.department) && (
            <span
              className="inline-block px-4 py-1.5 font-bold rounded-full text-xs mb-5"
              style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
            >
              {job.department}
            </span>
          )}
          <h1 className="font-extrabold mb-6" style={{ color: colors.text, ...headingStyle }}>
            {job.jobTitle || "Job Title"}
          </h1>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
            {metaItems.map((item) => (
              <div key={item.label} className="text-base font-medium" style={{ color: `${colors.text}aa` }}>
                <span className="font-semibold mr-1" style={{ color: colors.accent }}>
                  {item.label}:
                </span>
                {item.value}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span key={skill} className="px-4 py-2 font-semibold text-sm rounded-md bg-gray-100 text-gray-800">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xl font-bold pt-6" style={{ color: colors.primary }}>
          Apply Now!
        </p>
      </div>
      <div
        className="w-1/3 absolute right-0 top-0 bottom-0 flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="transform -rotate-90 text-7xl font-black tracking-tighter text-white opacity-15 uppercase whitespace-nowrap">
          JOIN TEAM
        </div>
      </div>
    </div>
  );
}