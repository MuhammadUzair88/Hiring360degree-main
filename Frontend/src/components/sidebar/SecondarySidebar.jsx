import React from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  Users,
  UserCheck,
  Code2,
  FileSignature,
  Plus,
} from "lucide-react";

// Sub-navigation for a single job advertisement.
const navItems = [
  {
    label: "Advertisement Overview",
    to: "/advertisement/job",
    icon: FileText,
    end: true,
  },
  {
    label: "Candidate Intake",
    to: "/advertisement/job/candidate-intake",
    icon: Users,
    badge: "5 Applied", // dummy data — replace with real applicant count later
  },
  { label: "HR Round", to: "/advertisement/job/hr-round", icon: UserCheck },
  {
    label: "Technical Round",
    to: "/advertisement/job/technical-round",
    icon: Code2,
  },
  {
    label: "Offer Letter",
    to: "/advertisement/job/offer-letter",
    icon: FileSignature,
  },
];

export default function SecondarySidebar({
  jobTitle = "Senior Frontend Developer",
  status = "In Progress",
  progress = 40, // percentage, 0-100
  onNewJobPosting,
}) {
  return (
    <aside className="w-72 h-screen sticky top-0 shrink-0 bg-secondary-100 border-r border-secondary-300 flex flex-col justify-between">
      <div>
        {/* Job header */}
        <div className="p-6 border-b border-secondary-300">
          <p className="text-lg font-bold text-slate-900 leading-6">
            {jobTitle}
          </p>
          <div className="flex items-center gap-2 py-3">
            <span className="w-2 h-2 rounded-full bg-primary-800" />
            <span className="text-xs font-medium text-gray-700">
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

        {/* Sub nav */}
        <nav className="px-2 py-2 flex flex-col gap-1">
          {navItems.map(({ label, to, icon: Icon, end, badge }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-colors ${
                  isActive
                    ? "bg-primary-50 border-l-4 border-primary-800 text-primary-800 font-medium"
                    : "text-gray-700 hover:bg-secondary-200"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </span>
              {badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary-800 text-white text-[10px] font-bold shrink-0">
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Job Posting
        </button>
      </div>
    </aside>
  );
}