import React from "react";
import { Link } from "react-router-dom";
import { MapPin, MoreHorizontal } from "lucide-react";

const MAX_VISIBLE_TAGS = 3;

export default function AdvertisementCard({
  id,
  departmentLabel,
  accentTextClass = "text-primary-800",
  accentBgClass = "bg-primary-800/10",
  typeLabel,
  title,
  company,
  location,
  salary,
  postedDate,
  endDate,
  tags = [],
  applicantsCount,
}) {
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = Math.max(tags.length - MAX_VISIBLE_TAGS, 0);
  const formattedSalary = typeof salary === "number" ? salary.toLocaleString() : salary;
  console.log(applicantsCount)
  return (
    <Link
      to={`/advertisement/job/${id}`}
      className="relative bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 overflow-hidden flex flex-col p-6 gap-4 hover:outline-primary-800/40 transition-colors"
    >
      <div
        className={`w-32 h-32 -right-8 -top-16 absolute rounded-bl-full ${accentBgClass}`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-tight ${accentBgClass} ${accentTextClass}`}
          >
            {departmentLabel}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-tight bg-secondary-200 text-black">
            {typeLabel}
          </span>
        </div>
        <button
          type="button"
          aria-label="More options"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            // TODO: wire up a real dropdown (archive/duplicate/delete) here.
          }}
          className="text-black/50 hover:text-black transition-colors shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex flex-col gap-1">
        <h3 className="text-black text-h6 font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-black/60 text-base leading-6">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {company} · {location}
          </span>
        </div>
      </div>

      {salary != null && (
        <div className="relative flex flex-col gap-0.5">
          <span className="text-black/50 text-caption uppercase tracking-tight">Salary</span>
          <span className="text-black text-lg font-semibold leading-6">{formattedSalary}</span>
        </div>
      )}

      <div className="relative flex flex-wrap items-center gap-2">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-black/70 text-xs"
          >
            {tag}
          </span>
        ))}
        {remainingTagsCount > 0 && (
          <span className="px-2.5 py-1 rounded bg-secondary-200 text-black text-xs font-medium">
            +{remainingTagsCount} more
          </span>
        )}
      </div>

      <div className="relative mt-auto pt-4 border-t border-secondary-300 flex items-center justify-between">
        <span className="text-black/50 text-caption leading-[1.125rem]">
          Posted: {postedDate} · End: {endDate}
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className={`text-lg font-semibold leading-7 ${accentTextClass}`}>{applicantsCount}</span>
          <span className="text-black/60 text-xs font-medium leading-4">Applicants</span>
        </span>
      </div>
    </Link>
  );
}