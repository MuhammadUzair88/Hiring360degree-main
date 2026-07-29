import React from "react";

const RADIUS = 15.9155; // gives a circle whose circumference is exactly 100, so strokeDasharray can be a plain percentage

function getScoreTier(score) {
  if (score >= 70) return { ring: "app-score-ring-strong", text: "text-success-600", label: "Strong" };
  if (score >= 40) return { ring: "app-score-ring-average", text: "text-warning-600", label: "Average" };
  return { ring: "app-score-ring-weak", text: "text-danger-600", label: "Low" };
}

/** Circular AI match-score indicator. `size="lg"` is used in the drawer header, the default is used on cards. */
export default function CandidateScoreRing({ score = 0, size = "sm", showLabel = true }) {
  const tier = getScoreTier(score);
  const dimensionClass = size === "lg" ? "w-16 h-16" : "w-10 h-10";
  const scoreTextClass = size === "lg" ? "text-sm" : "text-[9px]";

  return (
    <div className="flex items-center gap-1.5 shrink-0" title={`AI match score: ${score}%`}>
      <div className={`relative ${dimensionClass} flex items-center justify-center`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle className="stroke-secondary-300" cx="18" cy="18" r={RADIUS} strokeWidth="3" fill="none" />
          <circle
            className={`${tier.ring} transition-all duration-500`}
            cx="18"
            cy="18"
            r={RADIUS}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className={`absolute font-bold text-slate-900 ${scoreTextClass}`}>{score}%</span>
      </div>

      {showLabel && (
        <div className="hidden sm:flex flex-col">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">AI Score</span>
          <span className={`text-[10px] font-bold ${tier.text}`}>{tier.label}</span>
        </div>
      )}
    </div>
  );
}