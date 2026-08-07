// src/components/interviewerDashboard/conductInterview/CandidateProfileCard.jsx

import React from "react";
import { Mail, Phone, Calendar } from "lucide-react";

function formatTime(timeStr) {
  if (!timeStr) return "N/A";
  if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) return timeStr;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes || 0).padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${period}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CandidateProfileCard({ email, phone, interviewDate, interviewTime }) {
  return (
    <div className="self-stretch p-5 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
      <span className="text-gray-500 text-xs font-semibold uppercase leading-4 tracking-wide">Candidate Profile</span>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-primary-800 shrink-0" />
          <span className="text-slate-900 text-sm leading-5 truncate">{email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-primary-800 shrink-0" />
          <span className="text-slate-900 text-sm leading-5">{phone}</span>
        </div>
        <div className="pt-3 border-t border-secondary-300 flex items-center gap-3">
          <Calendar size={16} className="text-primary-800 shrink-0" />
          <div>
            <p className="text-slate-900 text-sm font-semibold leading-5">{formatDate(interviewDate)}</p>
            <p className="text-gray-700 text-xs font-semibold leading-4 tracking-tight">{formatTime(interviewTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}