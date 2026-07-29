import React from "react";
import { CheckCircle2, Mail, Briefcase, Users, FileText } from "lucide-react";

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// Cycles through primary shades only — the same "vary shade, never
// hue" rule used for the job advertisement cards in data.js.
const AVATAR_SHADES = ["text-primary-600", "text-primary-700", "text-primary-800", "text-primary-900"];
const AVATAR_BG = ["bg-primary-600/10", "bg-primary-700/10", "bg-primary-800/10", "bg-primary-900/10"];

export default function SelectedCandidatesCard({ candidates = [], selectedId, onSelect, onCreateOffer }) {
  return (
    <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5 h-full">
      <div className="flex items-start justify-between border-b border-secondary-300 pb-4">
        <div>
          <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Selected Candidates</h3>
          <p className="text-gray-500 text-xs mt-1">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ready for offer</p>
        </div>
        <span className="w-9 h-9 rounded-xl bg-primary-800/10 text-primary-800 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </span>
      </div>

      {candidates.length === 0 ? (
        <div className="flex-1 min-h-[10rem] flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-secondary-300 text-center p-8">
          <Users className="w-6 h-6 text-secondary-400" />
          <p className="text-gray-400 text-xs italic">No candidates have passed every round yet</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
          {candidates.map((candidate, index) => {
            const isSelected = selectedId === candidate.applicationId;
            const shade = index % AVATAR_SHADES.length;

            return (
              <div
                key={candidate.applicationId}
                onClick={() => onSelect(candidate.applicationId)}
                role="button"
                tabIndex={0}
                className={`p-4 rounded-xl outline outline-1 outline-offset-[-1px] flex flex-col gap-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-primary-800/5 outline-primary-800" : "bg-secondary-100 outline-secondary-300 hover:outline-primary-800/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-9 h-9 rounded-full ${AVATAR_BG[shade]} ${AVATAR_SHADES[shade]} text-sm font-semibold flex items-center justify-center shrink-0`}>
                    {initials(candidate.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">{candidate.name}</p>
                    <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" /> {candidate.email}
                    </p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 shrink-0" /> {candidate.position}
                </p>

                <span
                  className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    candidate.hasOffer ? "bg-info-50 text-info-700" : "bg-success-50 text-success-700"
                  }`}
                >
                  {candidate.hasOffer ? "Offer Created" : "Passed Final Interview"}
                </span>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCreateOffer(candidate.applicationId);
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors outline outline-1 outline-offset-[-1px] flex items-center justify-center gap-1.5 ${
                    isSelected ? "bg-primary-800 text-white outline-primary-800" : "bg-secondary-50 text-primary-800 outline-primary-800 hover:bg-primary-800 hover:text-white"
                  }`}
                >
                  {candidate.hasOffer ? (
                    <>
                      <FileText className="w-3.5 h-3.5" /> Edit Offer
                    </>
                  ) : (
                    "Create Offer"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}