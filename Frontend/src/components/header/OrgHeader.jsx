import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Mail, Menu, Plus } from "lucide-react";
// Adjust this path if your assets folder lives somewhere else.
import logoIcon from "../../assets/logo.svg";

export default function OrgHeader({
  orgName = "Hiring 360",
  notificationCount = 1,
  onMenuClick = () => {},
}) {
  return (
    <header className="app-header">
      {/* Menu + search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
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

        <div className="hidden sm:block flex-1 min-w-0 max-w-sm lg:max-w-96 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, jobs, or reports..."
            className="w-full pl-10 pr-4 py-2 bg-primary-50 rounded-full text-sm text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-gray-700 hover:text-primary-800 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
          )}
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="hidden sm:inline-flex text-gray-700 hover:text-primary-800 transition-colors"
        >
          <Mail className="w-5 h-5" />
        </button>

        <div className="hidden sm:block w-px h-8 bg-secondary-300" />

        <Link
          to="/advertisement/create"
          aria-label="New Job Posting"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">New Job Posting</span>
        </Link>
      </div>
    </header>
  );
}