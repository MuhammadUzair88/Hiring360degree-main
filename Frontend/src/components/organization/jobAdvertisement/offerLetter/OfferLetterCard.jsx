import React from "react";
import { Edit3, Pencil, UserPlus, Users } from "lucide-react";
import A4Preview from "./A4Preview";
import { formatShortDate, getTodayDateInput } from "./offerDateUtils";

export default function OfferLetterCard({
  candidate,
  organization = {},
  advertisement = {},
  design,
  signature,
  totalCandidates = 0,
  onCustomize,
  onEdit,
  onGenerate,
}) {
  const hasOffer = Boolean(candidate?.hasOffer);

  return (
    <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5 h-full">
      <div className="flex items-start justify-between gap-3 border-b border-secondary-300 pb-4">
        <div className="min-w-0">
          <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Offer Letter Preview</h3>
          <p className="text-slate-900 text-base font-semibold mt-1 truncate">{candidate ? candidate.name : "Select a candidate"}</p>
          {candidate && hasOffer && (
            <p className="text-gray-500 text-xs mt-1">
              {candidate.joiningDate ? `Joins ${formatShortDate(candidate.joiningDate)}` : "Draft"}
              {candidate.endingDate ? ` · Ends ${formatShortDate(candidate.endingDate)}` : ""}
            </p>
          )}
          {!candidate && <p className="text-gray-400 text-xs mt-1">{totalCandidates > 0 ? "Pick a candidate on the left" : "Waiting for candidates"}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            disabled={!candidate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 text-xs font-semibold hover:outline-primary-800 hover:text-primary-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={onCustomize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 text-xs font-semibold hover:outline-primary-800 hover:text-primary-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Customize
          </button>
        </div>
      </div>

      <div className="bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 p-4 flex items-start justify-center flex-grow min-h-[500px]">
        <div className="w-full max-w-[440px] mx-auto bg-white shadow-lg outline outline-1 outline-offset-[-1px] outline-secondary-300/70 rounded-sm" style={{ minHeight: "600px" }}>
          <A4Preview
            theme={design?.theme}
            candidate={candidate || { name: "Candidate Name", email: "candidate@email.com", position: advertisement?.jobTitle || "Position" }}
            organization={organization}
            advertisement={advertisement}
            colors={design?.colors}
            brandingPreference={design?.brandingPreference}
            logoSize={design?.logoSize}
            headingSize={design?.headingSize}
            bodyFontSize={design?.bodyFontSize}
            signatureSize={design?.signatureSize}
            spacing={design?.spacing}
            formData={{
              joiningDate: candidate?.joiningDate || getTodayDateInput(),
              endingDate: candidate?.endingDate || "",
            }}
            signature={signature}
            customContent={candidate?.offerContent || null}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {candidate && !hasOffer && (
          <button
            type="button"
            onClick={onGenerate}
            className="w-full py-3 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Generate Offer Letter
          </button>
        )}

        {!candidate && totalCandidates === 0 && (
          <div className="p-4 bg-info-50 outline outline-1 outline-offset-[-1px] outline-info-200 rounded-xl text-center">
            <Users className="w-5 h-5 text-info-600 mx-auto mb-2" />
            <p className="text-xs text-info-700 font-medium">No candidates yet</p>
            <p className="text-[10px] text-info-600/80 mt-1">Candidates who pass every interview round will appear here.</p>
          </div>
        )}

        {!candidate && totalCandidates > 0 && (
          <div className="p-4 bg-warning-50 outline outline-1 outline-offset-[-1px] outline-warning-200 rounded-xl text-center">
            <Users className="w-5 h-5 text-warning-600 mx-auto mb-2" />
            <p className="text-xs text-warning-700 font-medium">
              {totalCandidates} candidate{totalCandidates !== 1 ? "s" : ""} ready
            </p>
            <p className="text-[10px] text-warning-600/80 mt-1">Select a candidate to generate their offer.</p>
          </div>
        )}
      </div>
    </div>
  );
}