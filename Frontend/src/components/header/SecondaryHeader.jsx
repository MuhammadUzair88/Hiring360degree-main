import React from "react";
import { useLocation } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";

/**
 * SecondaryHeader
 *
 * Header bar shown alongside SecondarySidebar (the per-job sub navigation:
 * Job Overview, Candidate Intake, HR Round, Technical Round, Offer Letter).
 *
 * Title and subtitle change automatically based on the active route (via
 * useLocation, matched against PAGE_CONFIG below — the same keys used in
 * SecondarySidebar's navItems `to` paths). The action button, however, is
 * a single constant CTA ("Export List") shown the same way on every page —
 * it does not change per section.
 *
 * You can still pass `page` explicitly to override route auto-detection,
 * and `title` / `subtitle` / `ctaLabel` always win over the defaults if
 * provided.
 *
 * Colors, type scale and font all come from the design tokens defined in
 * index.css (`@theme`) — primary-* (purple), secondary-* (white/gray),
 * text-* sizes, and the Poppins font-sans stack.
 */

// Keys mirror the last `to` segment used in SecondarySidebar's navItems.
const PAGE_CONFIG = {
  "job-overiew": {
    title: "Job Overview",
    subtitle: "Full details and settings for this job advertisement.",
  },
  "candidate-intake": {
    title: "Candidate Intake",
    subtitle: "Review and move applicants through the pipeline.",
  },
  "hr-round": {
    title: "HR Round",
    subtitle: "Manage candidates currently in the HR interview stage.",
  },
  "technical-round": {
    title: "Technical Round",
    subtitle: "Manage candidates currently in the technical interview stage.",
  },
  "offer-letter": {
    title: "Offer Letter",
    subtitle: "Prepare and send offer letters to selected candidates.",
  },
};

// The single, consistent action shown on every page.
const DEFAULT_CTA_LABEL = "Export List";

// Pulls the last non-empty segment off the current pathname, e.g.
// "/advertisement/job/hr-round" -> "hr-round".
function getPageKeyFromPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export default function SecondaryHeader({
  page,
  title,
  subtitle,
  ctaLabel = DEFAULT_CTA_LABEL,
  onSearch,
  onFilter,
  onCtaClick,
  showSearch = true,
  showFilter = true,
  showCta = true,
}) {
  const location = useLocation();
  const derivedPage = page ?? getPageKeyFromPath(location.pathname);

  const config = PAGE_CONFIG[derivedPage] ?? {};
  const resolvedTitle = title ?? config.title ?? "Untitled";
  const resolvedSubtitle = subtitle ?? config.subtitle ?? "";

  return (
    <header className="self-stretch h-20 px-8 bg-secondary-50 border-b border-secondary-300 flex justify-between items-center font-sans">
      {/* Title + subtitle */}
      <div className="flex flex-col justify-center">
        <h1 className="text-slate-900 text-2xl font-semibold leading-8">
          {resolvedTitle}
        </h1>
        {resolvedSubtitle && (
          <p className="text-gray-600 text-sm font-normal leading-5">
            {resolvedSubtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {(showSearch || showFilter) && (
          <div className="flex items-center gap-1">
            {showSearch && (
              <button
                type="button"
                onClick={onSearch}
                aria-label="Search"
                className="p-2 rounded-full text-gray-600 hover:bg-secondary-200 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            {showFilter && (
              <button
                type="button"
                onClick={onFilter}
                aria-label="Filter"
                className="p-2 rounded-full text-gray-600 hover:bg-secondary-200 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {showCta && (
          <button
            type="button"
            onClick={onCtaClick}
            className="px-6 py-2.5 bg-primary-800 rounded-lg shadow-sm text-secondary-50 text-base font-semibold leading-6 hover:bg-primary-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </header>
  );
}