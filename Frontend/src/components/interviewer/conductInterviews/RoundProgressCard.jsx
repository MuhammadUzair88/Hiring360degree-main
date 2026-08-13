
import React from "react";

/**
 * Matches the Figma "ROUND PROGRESS" card 1:1 — same structure, same
 * spacing — with two changes: indigo-600/blue-100 map onto our
 * primary-700/primary-100 tokens (Tailwind's indigo isn't in our
 * palette), and the fixed 144px bar / hardcoded 2-of-3 segments are
 * replaced with values derived from `roundIndex`/`totalRounds` so the
 * card works for any candidate, not just "round 2 of 3".
 */
export default function RoundProgressCard({ roundIndex, totalRounds, stageName }) {
  const safeTotalRounds = Math.max(Number(totalRounds) || 1, 1);
  const currentRound = Math.min((Number(roundIndex) || 0) + 1, safeTotalRounds);
  const percent = Math.round((currentRound / safeTotalRounds) * 100);

  return (
    <div className="self-stretch p-5 bg-secondary-50 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-2">
      <span className="text-gray-500 text-xs font-semibold uppercase leading-4 tracking-wide">Round Progress</span>

      <div className="pt-2 flex justify-between items-center">
        <span className="text-slate-900 text-sm font-semibold leading-5">
          {stageName ? `${stageName} — Round ${currentRound} of ${safeTotalRounds}` : `Round ${currentRound} of ${safeTotalRounds}`}
        </span>
        <span className="text-primary-700 text-xs font-bold leading-4 tracking-tight">{percent}%</span>
      </div>

      <div className="self-stretch h-2 relative bg-primary-100 rounded-full overflow-hidden">
        <div className="h-2 absolute left-0 top-0 bg-primary-700 transition-all" style={{ width: `${percent}%` }} />
      </div>

      <div className="pt-1 flex justify-center items-start gap-1">
        {Array.from({ length: safeTotalRounds }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full ${index < currentRound ? "bg-primary-700" : "bg-primary-100"}`}
          />
        ))}
      </div>
    </div>
  );
}