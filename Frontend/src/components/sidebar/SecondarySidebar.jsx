import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  Users,
  UserCheck,
  Code2,
  FileSignature,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Sub-navigation for a single job advertisement. Built as a function
// (rather than a static module-level array) because every link needs
// the current job's id baked in — without it, navigating away from
// Overview would lose which job you were looking at.
function buildNavItems(jobId) {
  const base = jobId ? `/advertisement/job/${jobId}` : "/advertisement/job";

  return [
    {
      label: "Advertisement Overview",
      to: base,
      icon: FileText,
      end: true,
    },
    {
      label: "Candidate Intake",
      to: `${base}/candidate-intake`,
      icon: Users,
      badge: "5 Applied", // dummy data — replace with real applicant count later
    },
    { label: "Round", to: `${base}/rounds`, icon: UserCheck },
    {
      label: "Offer Letter",
      to: `${base}/offer-letter`,
      icon: FileSignature,
    },
  ];
}

const COLLAPSE_STORAGE_KEY = "hiring360:secondarySidebarCollapsed";

/**
 * Responsive behavior (breakpoints + classes defined once in index.css):
 * - Below 1200px (compact & medium): off-canvas drawer, closed by default,
 *   opened via `mobileOpen` (toggled from SecondaryHeader's job-menu button).
 * - 1200px+: permanent panel alongside MainSidebar. A circular toggle lets
 *   the user manually collapse this desktop panel down to icons-only (and
 *   back). The choice is remembered in localStorage.
 */
export default function SecondarySidebar({
  jobId,
  jobTitle = "Senior Frontend Developer",
  status = "In Progress",
  progress = 40, // percentage, 0-100
  onNewJobPosting,
  mobileOpen = false,
  onClose = () => {},
}) {
  const navItems = buildNavItems(jobId);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
  });

  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = mobileOpen || localOpen;

  const closeDrawer = () => {
    setLocalOpen(false);
    onClose();
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="app-drawer-backdrop lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Opens the drawer. Rendered outside <aside> on purpose: a transform
          on a parent also carries position:fixed/absolute children off-screen,
          so a button living inside the (closed, translated) aside can never
          be the thing that reveals it. */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setLocalOpen(true)}
          aria-label="Open job sections"
          aria-controls="secondary-sidebar"
          aria-expanded="false"
          className="app-sidebar-open-tab"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <aside
        id="secondary-sidebar"
        className={`app-sidebar-secondary h-screen lg:sticky lg:top-0 bg-secondary-100 border-r border-secondary-300 flex flex-col justify-between ${
          isOpen ? "is-open" : ""
        } ${collapsed ? "is-collapsed" : ""}`}
      >
        {/* Desktop-only collapse/expand toggle (1200px+) */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand job menu" : "Collapse job menu"}
          aria-expanded={!collapsed}
          aria-controls="secondary-sidebar"
          className="app-sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        <div>
          {/* Job header */}
          <div className="job-header-wrap p-4 sm:p-6 border-b border-secondary-300 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="job-header-text">
                <p className="text-lg font-bold text-slate-900 leading-6 truncate">
                  {jobTitle}
                </p>
                <div className="flex items-center gap-2 py-3">
                  <span className="w-2 h-2 rounded-full bg-primary-800 shrink-0" />
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {status}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-secondary-300 overflow-hidden">
                  <div
                    className="h-1 bg-primary-800"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {/* Collapsed-desktop-only glance at status, swapped in for the text block above */}
              <span
                className="job-header-dot hidden w-3 h-3 rounded-full bg-primary-800 mx-auto"
                title={`${jobTitle} — ${status}`}
              />
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close job menu"
              className="lg:hidden p-1 rounded-full text-gray-600 hover:bg-secondary-200 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub nav */}
          <nav className="px-2 py-2 flex flex-col gap-1">
            {navItems.map(({ label, to, icon: Icon, end, badge }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                onClick={closeDrawer}
                title={label}
                className={({ isActive }) =>
                  `app-subnav-item flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-primary-50 border-l-4 border-primary-800 text-primary-800 font-medium"
                      : "text-gray-700 hover:bg-secondary-200"
                  }`
                }
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="subnav-label truncate">{label}</span>
                </span>
                {badge && (
                  <span className="subnav-label px-1.5 py-0.5 rounded-full bg-primary-800 text-white text-[10px] font-bold shrink-0">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* New job posting */}
        <div className="p-4">
          <button
            type="button"
            onClick={onNewJobPosting}
            aria-label="New Job Posting"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="subnav-label">New Job Posting</span>
          </button>
        </div>
      </aside>
    </>
  );
}