import React from "react";
import { Users } from "lucide-react";

/** Small circular AI match-score indicator, styled to match the score ring used on the Candidate Intake board. */
function ScoreRing({ score }) {
  const tierClass = score >= 70 ? "stroke-primary-700" : score >= 40 ? "stroke-warning-500" : "stroke-danger-500";
  return (
    <div className="relative w-9 h-9 shrink-0" title={`AI match score: ${score}%`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle className="stroke-secondary-400" cx="18" cy="18" r="15.9155" strokeWidth="3.5" fill="none" />
        <circle className={`${tierClass} transition-all duration-500`} cx="18" cy="18" r="15.9155" strokeWidth="3.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" fill="none" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-slate-900 text-[9px] font-bold">{score}%</span>
    </div>
  );
}

export default function RoundCandidatePool({ roundName, pool, scheduledCandidateIds, selectedCandidateId, onSelectCandidate }) {
  return (
    <div className="w-full lg:w-[30%] bg-secondary-50 rounded-2xl p-6 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-secondary-300 pb-4">
        <div>
          <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Shortlisted Applicants</h3>
          <p className="text-gray-500 text-xs mt-1">Ready for {roundName || "this round"}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary-800/10 text-primary-800 text-xs font-semibold">{pool.length} Total</span>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
        {pool.length === 0 ? (
          <div className="flex-1 min-h-[10rem] flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-secondary-300 text-center p-8">
            <Users className="w-6 h-6 text-secondary-400" />
            <p className="text-gray-400 text-xs italic">No applicants waiting on this round yet</p>
          </div>
        ) : (
          pool.map((candidate) => {
            const isSlotted = scheduledCandidateIds.has(candidate.candidateId);
            const isSelected = selectedCandidateId === candidate.id;

            return (
              <div
                key={candidate.id}
                className={`p-4 rounded-xl outline outline-1 outline-offset-[-1px] flex flex-col gap-3 transition-colors ${
                  isSelected ? "bg-primary-800/5 outline-primary-800" : "bg-secondary-100 outline-secondary-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-primary-800/10 text-primary-800 text-sm font-semibold flex items-center justify-center shrink-0">
                      {candidate.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-900 text-sm font-semibold truncate">{candidate.name}</p>
                      <p className="text-gray-500 text-xs truncate">{candidate.email}</p>
                    </div>
                  </div>
                  {typeof candidate.matchScore === "number" && <ScoreRing score={candidate.matchScore} />}
                </div>

                <button
                  type="button"
                  disabled={isSlotted}
                  onClick={() => onSelectCandidate(candidate.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors outline outline-1 outline-offset-[-1px] ${
                    isSlotted
                      ? "bg-secondary-200 text-gray-500 outline-secondary-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-primary-800 text-white outline-primary-800"
                      : "bg-secondary-50 text-primary-800 outline-primary-800 hover:bg-primary-800 hover:text-white"
                  }`}
                >
                  {isSlotted ? "Already Slotted" : isSelected ? "Selected" : "Schedule"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}