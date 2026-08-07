// src/components/interviewerDashboard/conductInterview/AppliedPositionCard.jsx

import React from "react";
import { Briefcase } from "lucide-react";

export default function AppliedPositionCard({ jobTitleTarget, departmentPool, employmentType, workMode, experienceRequired }) {
  return (
    <div className="self-stretch p-5 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
      <span className="text-gray-500 text-xs font-semibold uppercase leading-4 tracking-wide">Applied Position</span>

      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-slate-900 text-lg font-semibold leading-6">{jobTitleTarget}</h4>
          <p className="text-gray-700 text-sm leading-5">{departmentPool}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {employmentType && (
            <span className="px-2 py-1 bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded text-black/70 text-xs font-bold">
              {employmentType.toUpperCase()}
            </span>
          )}
          {workMode && (
            <span className="px-2 py-1 bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded text-black/70 text-xs font-bold">
              {workMode.toUpperCase()}
            </span>
          )}
        </div>

        {experienceRequired && (
          <div className="pt-2 flex items-center gap-2">
            <Briefcase size={14} className="text-gray-700 shrink-0" />
            <span className="text-gray-700 text-xs font-medium tracking-tight">{experienceRequired}</span>
          </div>
        )}
      </div>
    </div>
  );
}