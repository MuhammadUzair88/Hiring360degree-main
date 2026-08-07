// src/components/interviewerDashboard/evaluation/StrengthsImprovementsSection.jsx

import React from "react";

function EvaluationTextarea({ label, placeholder, value, onChange, readOnly }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label className="text-base font-semibold text-slate-900">{label}</label>
      <textarea
        rows={4}
        required
        disabled={readOnly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-primary-800 focus:ring-1 focus:ring-primary-800 transition-colors resize-none disabled:bg-slate-50 disabled:opacity-80 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default function StrengthsImprovementsSection({
  strengths,
  improvements,
  onStrengthsChange,
  onImprovementsChange,
  readOnly,
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-6">
      <EvaluationTextarea
        label="Core Strengths"
        placeholder="What stood out the most? (e.g. Exceptional architecting skills, deep understanding of system performance)"
        value={strengths}
        onChange={onStrengthsChange}
        readOnly={readOnly}
      />
      <EvaluationTextarea
        label="Areas for Improvement"
        placeholder="Where did they struggle? (e.g. Needs more exposure to AWS infrastructure, communication was slightly too verbose)"
        value={improvements}
        onChange={onImprovementsChange}
        readOnly={readOnly}
      />
    </div>
  );
}
