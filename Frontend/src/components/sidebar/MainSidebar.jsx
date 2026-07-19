import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Megaphone, Users, Settings } from "lucide-react";

// Primary navigation. "end: true" on Dashboard keeps it from matching
// every nested route (since "/" is a prefix of everything).
const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Job Advertisement", to: "/advertisement", icon: Megaphone },
  { label: "Interviewer", to: "/interviewer", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function MainSidebar({
  orgName = "Hiring 360",
  orgTagline = "Global Recruitment",
  userName = "Alex Rivera",
  userRole = "HR Lead",
  userAvatar = "https://placehold.co/40x40",
}) {
  return (
    <aside className="w-60 h-screen sticky top-0 shrink-0 bg-secondary-100 border-r border-secondary-300 flex flex-col">
      {/* Website logo + organization name */}
      <div className="p-4 border-b border-secondary-300">
        <p className="text-xl font-bold text-primary-800 leading-7">
          {orgName}
        </p>
        <p className="text-sm text-gray-700 leading-5">{orgTagline}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-50 border-l-4 border-primary-800 text-primary-800 font-medium"
                  : "text-gray-700 hover:bg-secondary-200"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-secondary-300 flex items-center gap-3">
        <img
          src={userAvatar}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-medium text-slate-900 truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-700 truncate">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}