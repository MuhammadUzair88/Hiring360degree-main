
// src/components/interviewer/conductInterviews/CandidateDetailTabs.jsx

import React from "react";
import { FileText, BookOpen, MessageSquare } from "lucide-react";

const TABS = [
  { id: "resume", label: "Resume", icon: FileText },
  { id: "job", label: "Job Description", icon: BookOpen },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

export default function CandidateDetailTabs({
  activeTab,
  onChangeTab,
  feedbackCount = 0,
}) {
  return (
    <div className="self-stretch shrink-0 border-b border-secondary-300 bg-secondary-50 px-2 sm:px-8">
      {/*
        Do not use overflow-x-auto here. The old tab bar created a nested
        horizontal scroller inside the candidate page. A three-column grid on
        small screens keeps every tab visible without a scrollbar; desktop
        switches back to the original left-aligned tab layout.
      */}
      <div className="grid w-full grid-cols-3 sm:flex sm:items-center sm:gap-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex h-12 min-w-0 items-center justify-center gap-1.5 border-b-2 px-1 pt-2.5 pb-3 transition-colors sm:justify-start sm:gap-2 sm:px-0 ${
                isActive
                  ? "border-primary-800 text-primary-800"
                  : "border-transparent text-gray-700 hover:text-slate-900"
              }`}
            >
              <Icon size={16} className="shrink-0" />

              <span
                className={`truncate text-xs leading-6 sm:text-base ${
                  isActive ? "font-bold" : "font-semibold"
                }`}
              >
                {tab.label}
              </span>

              {tab.id === "feedback" && feedbackCount > 0 && (
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:text-[10px] ${
                    isActive
                      ? "bg-primary-100 text-primary-800"
                      : "bg-secondary-200 text-black/60"
                  }`}
                >
                  {feedbackCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
