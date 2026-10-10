import React from "react";
import { useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Menu, PanelLeft, Download } from "lucide-react";
import logoIcon from "../../assets/logos.svg";

const DEFAULT_CTA_LABEL = "Download";

// Keys mirror the last `to` segment used in SecondarySidebar's navItems.
const PAGE_CONFIG = {
  "": {
    title: "Job Overview",
    subtitle: "Full details and settings for this job advertisement.",
  },
  "candidate-intake": {
    title: "Candidate Intake",
    subtitle: "Review and move applicants through the pipeline.",
  },
  rounds: {
    title: "Rounds",
    subtitle: "Manage candidates currently in the interview rounds.",
  },
  "offer-letter": {
    title: "Offer Letter",
    subtitle: "Prepare and send offer letters to selected candidates.",
  },
};

// Pulls the last non-empty segment off the current pathname, e.g.
// "/advertisement/job/rounds" -> "rounds".
function getPageKeyFromPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

export default function SecondaryHeader({
  page,
  title,
  subtitle,
  ctaLabel = DEFAULT_CTA_LABEL,
  onSearch,
  onFilter,
  onCtaClick,
  onMenuClick = () => {},
  onJobMenuClick = () => {},
  showSearch = true,
  showFilter = true,
  showCta = true,
  orgName = "Hiring 360",
}) {
  const location = useLocation();
  const derivedPage = page ?? getPageKeyFromPath(location.pathname);

  const config = PAGE_CONFIG[derivedPage] ?? {};
  const resolvedTitle = title ?? config.title ?? "Job Overview";
  const resolvedSubtitle =
    subtitle ?? config.subtitle ?? "Full details and settings for this job advertisement.";

  return (
    <header className="app-header font-sans">
      {/* Menu buttons + logo + title */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="app-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>
         <img
          src={logoIcon}
          alt={orgName}
          className="sm:hidden h-8 w-8 shrink-0"
        />
        <button
          type="button"
          onClick={onJobMenuClick}
          aria-label="Open job menu"
          className="app-jobmenu-btn"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

       

        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-slate-900 text-lg sm:text-2xl font-semibold leading-6 sm:leading-8 truncate">
            {resolvedTitle}
          </h1>
          {resolvedSubtitle && (
            <p className="hidden md:block text-gray-600 text-sm font-normal leading-5 truncate">
              {resolvedSubtitle}
            </p>
          )}
        </div>
      </div>

  
    </header>
  );
}