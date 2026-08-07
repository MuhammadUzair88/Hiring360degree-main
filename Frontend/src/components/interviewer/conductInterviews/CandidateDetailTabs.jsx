// src/components/interviewerDashboard/conductInterview/CandidateDetailTabs.jsx

import React from "react";
import { FileText, BookOpen, MessageSquare } from "lucide-react";

const TABS = [
  { id: "resume", label: "Resume", icon: FileText },
  { id: "job", label: "Job Description", icon: BookOpen },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

export default function CandidateDetailTabs({ activeTab, onChangeTab, feedbackCount = 0 }) {
  return (
    <div className="self-stretch px-4 sm:px-8 bg-secondary-50 border-b border-secondary-300 flex items-center gap-6 sm:gap-8 overflow-x-auto">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`h-12 pt-2.5 pb-3 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
              isActive ? "border-primary-800 text-primary-800" : "border-transparent text-gray-700 hover:text-slate-900"
            }`}
          >
            <Icon size={16} />
            <span className={`text-base leading-6 ${isActive ? "font-bold" : "font-semibold"}`}>{tab.label}</span>
            {tab.id === "feedback" && feedbackCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-primary-100 text-primary-800" : "bg-secondary-200 text-black/60"
                }`}
              >
                {feedbackCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}