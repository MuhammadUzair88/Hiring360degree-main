import React, { useState } from "react";
import { Award, ThumbsUp, AlertTriangle, FileWarning, ChevronDown } from "lucide-react";

function BulletList({ items, bulletClassName }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bulletClassName}`} />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Key Achievements + Strengths/Concerns + Resume Formatting Issues + a collapsible Detailed Analysis. */
export default function CandidateInsightsPanel({
  keyAchievements = [],
  strengths = [],
  concerns,
  formattingIssues = [],
  detailedAnalysis,
}) {
  const [isDetailedAnalysisOpen, setIsDetailedAnalysisOpen] = useState(false);

  const hasStrengths = strengths.length > 0;
  const hasConcerns = Boolean(concerns?.items?.length);

  return (
    <div className="flex flex-col gap-5">
      {keyAchievements.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
            <Award className="w-4 h-4 text-primary-800" />
            Key Achievements
          </h3>
          <div className="p-4 rounded-xl bg-primary-800/5 outline outline-1 outline-offset-[-1px] outline-primary-800/10">
            <BulletList items={keyAchievements} bulletClassName="bg-primary-800" />
          </div>
        </section>
      )}

      {(hasStrengths || hasConcerns) && (
        <div className={`grid grid-cols-1 gap-4 ${hasStrengths && hasConcerns ? "sm:grid-cols-2" : ""}`}>
          {hasStrengths && (
            <section className="p-4 rounded-xl bg-success-50 outline outline-1 outline-offset-[-1px] outline-success-200 flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-success-700 text-sm font-bold">
                <ThumbsUp className="w-4 h-4" />
                Strengths
                <span className="text-success-700/70 text-xs font-semibold">({strengths.length})</span>
              </h3>
              <BulletList items={strengths} bulletClassName="bg-success-600" />
            </section>
          )}

          {hasConcerns && (
            <section className="p-4 rounded-xl bg-warning-50 outline outline-1 outline-offset-[-1px] outline-warning-200 flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-warning-700 text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                Concerns
                <span className="text-warning-700/70 text-xs font-semibold">({concerns.level})</span>
              </h3>
              <BulletList items={concerns.items} bulletClassName="bg-warning-600" />
            </section>
          )}
        </div>
      )}

      {formattingIssues.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
            <FileWarning className="w-4 h-4 text-danger-600" />
            Resume Formatting Issues
            <span className="text-gray-500 text-xs font-semibold">({formattingIssues.length})</span>
          </h3>
          <div className="p-4 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200">
            <BulletList items={formattingIssues} bulletClassName="bg-danger-600" />
          </div>
        </section>
      )}

      {detailedAnalysis && (
        <section className="rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsDetailedAnalysisOpen((open) => !open)}
            className="w-full px-4 py-3 flex items-center justify-between bg-secondary-100 hover:bg-secondary-200 transition-colors"
          >
            <span className="text-slate-900 text-sm font-semibold">Detailed Analysis</span>
            <span className="flex items-center gap-1 text-primary-800 text-xs font-semibold">
              {isDetailedAnalysisOpen ? "Collapse" : "Click to expand"}
              <ChevronDown className={`w-4 h-4 transition-transform ${isDetailedAnalysisOpen ? "rotate-180" : ""}`} />
            </span>
          </button>
          {isDetailedAnalysisOpen && (
            <div className="p-4 bg-secondary-50 text-gray-700 text-sm leading-relaxed">{detailedAnalysis}</div>
          )}
        </section>
      )}
    </div>
  );
}