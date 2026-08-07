// src/components/interviewerDashboard/conductInterview/JobDescriptionPanel.jsx

import React from "react";
import { Shield, Award, Info, BookOpen } from "lucide-react";

export default function JobDescriptionPanel({ requiredSkills, experienceRequired, jobDescription }) {
  const hasContent = requiredSkills?.length || experienceRequired || jobDescription;

  if (!hasContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-12">
        <BookOpen size={32} className="text-black/20" />
        <p className="text-black/50 text-sm font-medium">No job details available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 bg-secondary-100 overflow-y-auto flex flex-col gap-6">
      {requiredSkills?.length > 0 && (
        <div className="bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-5 flex flex-col gap-3">
          <h4 className="text-black/50 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
            <Shield size={12} /> Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <span key={skill} className="text-xs font-semibold bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 px-3 py-1.5 rounded-lg text-slate-900">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {experienceRequired && (
        <div className="bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-5 flex flex-col gap-2">
          <h4 className="text-black/50 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
            <Award size={12} /> Experience Required
          </h4>
          <p className="text-slate-900 text-sm font-semibold">{experienceRequired}</p>
        </div>
      )}

      {jobDescription && (
        <div className="bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-5 flex flex-col gap-2">
          <h4 className="text-black/50 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
            <Info size={12} /> Description
          </h4>
          <p className="text-black/70 text-sm leading-relaxed whitespace-pre-line">{jobDescription}</p>
        </div>
      )}
    </div>
  );
}