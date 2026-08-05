import React from "react";
import { Calendar, Briefcase } from "lucide-react";

/**
 * Header for the candidate application page — organization badge/logo
 * and name, the job title, and the application deadline.
 */
export default function JobHeader({ organization, jobTitle, deadline }) {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-primary-700 flex items-center justify-center overflow-hidden">
          {organization?.logo ? (
            <img
              src={organization.logo}
              alt={`${organization?.name || "Organization"} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Briefcase className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-sm sm:text-base font-medium text-primary-700">
          {organization?.name}
        </span>
      </div>

      <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
        {jobTitle}
      </h1>

      {formattedDeadline && (
        <div className="mt-2 flex items-center gap-1.5 text-gray-500">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs sm:text-sm font-medium tracking-tight">
            Application Deadline: {formattedDeadline}
          </span>
        </div>
      )}
    </div>
  );
}