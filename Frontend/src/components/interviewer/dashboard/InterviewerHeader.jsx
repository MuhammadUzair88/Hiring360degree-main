import React, { useState } from "react";
import { Users, Globe, Mail, ChevronDown, ChevronUp } from "lucide-react";

export default function InterviewerHeader({ organization, interviewer, actions }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const organizationInitials = organization?.name
    ? organization.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "OR";

  const hasSecondaryDetails = Boolean(organization?.location || organization?.email);

  return (
    <div className="self-stretch flex flex-col gap-2 p-4 sm:p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Organization avatar / logo */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 overflow-hidden shadow-sm flex items-center justify-center shrink-0">
            {organization?.logo ? (
              <img
                src={organization.logo}
                alt={organization.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-primary-800 text-xs sm:text-sm font-bold">{organizationInitials}</span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-slate-900 text-base sm:text-2xl font-semibold tracking-tight truncate">
              {organization?.name || "Organization"}
            </h2>
            <span className="flex items-center gap-1.5 text-zinc-600 text-xs sm:text-sm font-medium truncate">
              <Users size={13} className="text-primary-800 shrink-0" />
              Welcome,{" "}
              <span className="text-primary-800 font-semibold truncate">
                {interviewer?.name || "Interviewer"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {actions}

          {/* Mobile-only toggle for location / email / role badge below */}
          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-zinc-600 text-[11px] font-semibold hover:text-primary-800 hover:outline-primary-700 transition-colors cursor-pointer"
          >
            {detailsOpen ? "Less" : "More"}
            {detailsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      <div
        className={`${detailsOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pl-0 sm:pl-[4.5rem]`}
      >
        {organization?.location && (
          <span className="flex items-center gap-1.5 text-zinc-600 text-xs sm:text-sm font-medium">
            <Globe size={13} className="shrink-0" />
            {organization.location}
          </span>
        )}

        {organization?.location && organization?.email && (
          <span className="hidden sm:block text-secondary-400">•</span>
        )}

        {organization?.email && (
          <span className="flex items-center gap-1.5 text-zinc-600 text-xs sm:text-sm font-medium">
            <Mail size={13} className="shrink-0" />
            {organization.email}
          </span>
        )}

        {hasSecondaryDetails && <span className="hidden sm:block text-secondary-400">•</span>}

        <span className="text-[10px] font-bold tracking-wider text-primary-800 uppercase bg-primary-50 outline outline-1 outline-offset-[-1px] outline-primary-200 px-2 py-0.5 rounded-md w-max">
          Interviewer
        </span>
      </div>
    </div>
  );
}
