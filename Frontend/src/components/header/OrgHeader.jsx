import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Mail } from "lucide-react";

export default function OrgHeader({ notificationCount = 1 }) {
  return (
    <header className="h-16 shrink-0 px-6 bg-secondary-50 border-b border-secondary-300 flex items-center justify-between gap-6">
      {/* Search */}
      <div className="flex-1 max-w-96 relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search candidates, jobs, or reports..."
          className="w-full pl-10 pr-4 py-2 bg-primary-50 rounded-full text-sm text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 shrink-0">
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
          className="text-gray-700 hover:text-primary-800 transition-colors"
        >
          <Mail className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-secondary-300" />

        <Link
          to="/advertisement/create"
          className="px-4 py-2 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
        >
          New Job Posting
        </Link>
      </div>
    </header>
  );
}