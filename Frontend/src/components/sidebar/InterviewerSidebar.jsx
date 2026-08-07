import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  ClipboardCheck,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// Adjust these two paths if your assets folder lives somewhere else.
import logoFull from "../../assets/image-removebg-preview.png";
import logoIcon from "../../assets/logo.svg";

// Interviewer-portal navigation. Lives under the plural "/interviewers" —
// the org dashboard already owns the singular "/interviewer" for its
// "manage interviewers" page (see App.jsx), so this has to stay plural to
// avoid colliding with that route.
// "end: true" on Dashboard keeps it from matching nested "/interviewers/..." routes.
const navItems = [
  { label: "Dashboard", to: "/interviewers/dashboard", icon: LayoutDashboard, end: true },
  { label: "Conduct Interviews", to: "/interviewers/conduct-interviews", icon: Video },
  { label: "Evaluation", to: "/interviewers/evaluation", icon: ClipboardCheck },
];

const COLLAPSE_STORAGE_KEY = "hiring360:interviewerSidebarCollapsed";

/**
 * Interviewer portal's sidebar. Deliberately built as a 1:1 structural
 * copy of MainSidebar (same markup, same `.app-sidebar-main` / shared
 * classes from index.css, same collapse + off-canvas drawer behavior) so
 * the two portals stay visually and behaviorally identical. Only the nav
 * items and the localStorage key differ.
 *
 * The interviewer portal has no header (see InterviewerLayout), so the
 * mobile drawer is opened from the small edge tab rendered by
 * InterviewerLayout instead of a header hamburger button.
 *
 * Pure presentational component — no context/data dependency. Organization
 * details and the logout handler come in as props, same as MainSidebar.
 */
export default function InterviewerSidebar({
  organizationName = "GrainUp",
  organizationIndustry = "Global report",
  organizationLogo = null,
  mobileOpen = false,
  onClose = () => {},
  onLogout = () => {},
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  // Same initials fallback MainSidebar uses, just fed by props now.
  const organizationInitials = organizationName
    ? organizationName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "OR";

  return (
    <>
      {mobileOpen && (
        <div
          className="app-drawer-backdrop sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="interviewer-sidebar"
        className={`app-sidebar-main h-screen sm:sticky sm:top-0 shrink-0 bg-secondary-100 border-r border-secondary-300 flex flex-col ${
          mobileOpen ? "is-open" : ""
        } ${collapsed ? "is-collapsed" : ""}`}
      >
        {/* Collapse/expand toggle — appears from tablet width up (600px+) */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls="interviewer-sidebar"
          className="app-sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Website logo — full mark in the compact drawer and the expanded
            rail, icon-only mark once collapsed. */}
        <div className="app-sidebar-section app-sidebar-brand-row py-4 border-b border-secondary-300 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <img
              src={logoIcon}
              alt="Hiring 360"
              className="org-logo-icon h-8 w-8 shrink-0"
            />
            <img
              src={logoFull}
              alt="Hiring 360"
              className="org-name h-8 w-full shrink-0"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="sm:hidden p-1 rounded-full text-gray-600 hover:bg-secondary-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Organization card — name + logo. On collapse it shrinks to a
            centered logo/initials chip instead of a squeezed full-width
            bar. */}
        <div className="app-sidebar-section pt-4">
          <div className="app-org-card flex items-center gap-3 p-2 rounded-xl border border-secondary-300 bg-secondary-50">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-white border border-secondary-300 overflow-hidden flex items-center justify-center">
              {organizationLogo ? (
                <img
                  src={organizationLogo}
                  alt={organizationName}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-semibold text-gray-700">
                  {organizationInitials}
                </span>
              )}
            </div>

            <div className="min-w-0 org-card-text">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {organizationName}
              </p>
              <p className="text-[10px] text-gray-600 uppercase tracking-wide truncate">
                {organizationIndustry}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 app-sidebar-section py-4 flex flex-col gap-2">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                `app-sidebar-row flex items-center gap-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary-50 border-l-4 border-primary-800 text-primary-800 font-medium"
                    : "text-gray-700 hover:bg-secondary-200"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="app-sidebar-section py-4 border-t border-secondary-300">
          <button
            type="button"
            onClick={onLogout}
            title="Sign Out"
            className="app-sidebar-row w-full flex items-center gap-3 rounded-lg text-sm text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="nav-label">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}