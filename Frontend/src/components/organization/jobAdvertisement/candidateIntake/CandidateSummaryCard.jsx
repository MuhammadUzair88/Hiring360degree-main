import React from "react";
import { FileText } from "lucide-react";

export default function CandidateSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
        <FileText className="w-4 h-4 text-primary-800" />
        Candidate Summary
      </h3>
      <p className="p-4 rounded-xl bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 text-sm leading-relaxed">
        {summary}
      </p>
    </section>
  );
}