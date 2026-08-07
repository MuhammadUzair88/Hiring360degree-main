// src/components/interviewerDashboard/evaluation/CandidateProfileCard.jsx

import React from "react";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function CandidateProfileCard({ candidate }) {
  const isSubmitted = candidate.status === "Submitted";

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full ring-4 ring-primary-100 bg-primary-50 flex items-center justify-center overflow-hidden mb-4">
          {candidate.avatarUrl ? (
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-primary-700">
              {getInitials(candidate.name)}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-slate-900">{candidate.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{candidate.role}</p>

        <span
          className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isSubmitted ? "bg-slate-100 text-slate-600" : "bg-primary-50 text-primary-800"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSubmitted ? "bg-slate-500" : "bg-primary-800"}`} />
          {candidate.status}
        </span>
      </div>

      {/* Interview meta */}
      <div className="pt-6 border-t border-slate-200 flex flex-col gap-4">
        <MetaRow label="Assigned Role" value={candidate.assignedRole} />
        <MetaRow label="Interview Date" value={candidate.interviewDate} />
        <MetaRow label="Duration" value={candidate.duration} />
      </div>
    </div>
  );
}
