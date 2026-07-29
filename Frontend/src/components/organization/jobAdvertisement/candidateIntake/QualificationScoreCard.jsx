import React from "react";
import { Target, TrendingUp, GraduationCap, FileCheck2, Sparkles } from "lucide-react";

const METRIC_ICONS = {
  skillsMatch: Target,
  experienceFit: TrendingUp,
  educationLevel: GraduationCap,
  atsCompatibility: FileCheck2,
};

function getBarColorClass(score) {
  if (score >= 90) return "bg-primary-800";
  return "bg-primary-800";
}

export default function QualificationScorecard({ scorecard = [] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
        <Sparkles className="w-4 h-4 text-primary-800" />
        Qualification Scorecard
        <span className="px-1.5 py-0.5 rounded bg-primary-800/10 text-primary-800 text-[10px] font-bold">AI</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scorecard.map((metric) => {
          const Icon = METRIC_ICONS[metric.key] || Target;
          return (
            <div key={metric.key} className="p-4 rounded-xl bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                  <Icon className="w-3.5 h-3.5 text-primary-800" />
                  {metric.label}
                </span>
                <span className="text-slate-900 text-sm font-bold">{metric.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary-300 overflow-hidden">
                <div className={`h-1.5 rounded-full ${getBarColorClass(metric.score)}`} style={{ width: `${metric.score}%` }} />
              </div>
              <span className="text-gray-400 text-xs">{metric.note}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}