import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// Adjust these two paths if your assets folder lives somewhere else.
import logoFull from "../../assets/logofull.svg";
import logoIcon from "../../assets/logo.svg";

// Primary navigation. "end: true" on Dashboard keeps it from matching
// every nested route (since "/" is a prefix of everything).
const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Job Advertisement", to: "/advertisement", icon: Megaphone },
  { label: "Interviewer", to: "/interviewer", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
];

const COLLAPSE_STORAGE_KEY = "hiring360:mainSidebarCollapsed";

/**
 * Responsive behavior (breakpoints + classes defined once in index.css):
 * - Below 600px: off-canvas drawer, closed by default, opened via `mobileOpen`
 *   (toggled from the header's hamburger button in the parent layout).
 * - 600px+ (tablet and desktop): permanent sticky rail, defaults to expanded
 *   with full labels. The circular toggle collapses it to icons-only, the
 *   same way at both tablet and desktop widths. Choice is remembered in
 *   localStorage so it survives navigation and reloads.
 */
export default function MainSidebar({
  orgName = "Hiring 360",
  orgTagline = "Global Recruitment",
  userName = "Alex Rivera",
  userRole = "HR Lead",
  userAvatar = "https://placehold.co/40x40",
  mobileOpen = false,
  onClose = () => {},
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
        id="main-sidebar"
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
          aria-controls="main-sidebar"
          className="app-sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Website logo — full mark in the compact drawer and the expanded
            rail, icon-only mark once collapsed (classes in index.css) */}
        <div className="p-4 border-b border-secondary-300 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <img
              src={logoIcon}
              alt={`${orgName} – ${orgTagline}`}
              className="org-logo-icon h-8 w-8 shrink-0"
            />
            <img
              src={logoIcon}
              alt={`${orgName} – ${orgTagline}`}
              className="org-name h-8 w-auto shrink-0"
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

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
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

        {/* User footer */}
        <div className="p-4 border-t border-secondary-300 flex items-center gap-3">
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="overflow-hidden user-footer-text">
            <p className="text-xs font-medium text-slate-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-700 truncate">{userRole}</p>
          </div>
        </div>
      </aside>
    </>
  );
}