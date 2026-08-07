// src/components/interviewerDashboard/evaluation/InterviewFocusCard.jsx

import React from "react";

export default function InterviewFocusCard({ items = [] }) {
  return (
    <div className="w-full bg-primary-50/60 border border-primary-100 rounded-xl p-6">
      <h4 className="text-base font-semibold text-primary-800 mb-3">Interview Focus</h4>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-800 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
