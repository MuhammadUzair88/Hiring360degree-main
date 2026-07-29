import React from "react";
import { Tag } from "lucide-react";

/** Bottom full-width card — job description + skills, read-only mirror of JobForm's Description / Skills fields. */
export default function JobOverviewDescriptionCard({ job }) {
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <div className="w-full bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-black text-base font-semibold">Role Context &amp; Detailed Specifications</h3>
        <p className="text-black/70 text-sm leading-relaxed max-w-5xl whitespace-pre-wrap">
          {job.description || "No description provided yet."}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 border-t border-secondary-300 pt-6">
        <h3 className="text-black text-sm font-semibold">Core Competency Matrix</h3>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-black/70 text-xs font-medium hover:outline-primary-800/40 hover:text-primary-800 transition-colors"
              >
                <Tag className="w-3 h-3 text-black/40" />
                {skill}
              </span>
            ))
          ) : (
            <p className="text-black/50 text-xs">No skills listed for this role.</p>
          )}
        </div>
      </div>
    </div>
  );
}