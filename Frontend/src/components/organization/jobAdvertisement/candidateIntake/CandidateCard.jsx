import React from "react";
import CandidateStatusBadge from "./CandidateStatusBadge";
import CandidateScoreRing from "./CandidateScoreRing";
import CandidateActions from "./CandidateActions";
import AnalyzeResumeButton from "./AnalyzeResumeButton";

function formatAppliedAt(dateString) {
  const hours = Math.round((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Applied just now";
  if (hours < 24) return `Applied ${hours}h ago`;
  return `Applied ${Math.round(hours / 24)}d ago`;
}

/**
 * One applicant card inside a CandidateColumn.
 *
 * - Click/Enter/Space anywhere on the card opens the detail drawer.
 *   Every actionable element inside it (Analyze, bookmark/shortlist/
 *   reject) stops propagation so those actions don't also pop the
 *   drawer open.
 * - Draggable via the native HTML5 DnD API: onDragStart stashes this
 *   candidate's id on the dataTransfer payload; CandidateColumn reads
 *   it back out on drop. No extra library needed.
 */
export default function CandidateCard({
  candidate,
  isBusy,
  isAnalyzed,
  isAnalyzing,
  isDragging,
  onAnalyze,
  onOpenProfile,
  onBookmark,
  onUnbookmark,
  onShortlist,
  onUnshortlist,
  onReject,
  onDragStart,
  onDragEnd,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenProfile();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={!isBusy}
      onClick={onOpenProfile}
      onKeyDown={handleKeyDown}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", candidate.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.(candidate.id);
      }}
      onDragEnd={onDragEnd}
      aria-label={`Open ${candidate.name}'s evaluation`}
      className={`app-candidate-card p-4 bg-secondary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm hover:outline-primary-800/40 transition-colors flex flex-col gap-3 ${
        isDragging ? "is-dragging" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-full bg-primary-800/10 text-primary-800 font-semibold flex items-center justify-center shrink-0">
            {candidate.name.charAt(0)}
          </span>
          <span className="flex flex-col min-w-0">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-900 text-sm font-semibold leading-5 truncate">
                {candidate.name}
              </span>
              <CandidateStatusBadge status={candidate.status} />
            </span>
            <span className="text-gray-500 text-xs truncate">{candidate.email}</span>
          </span>
        </div>

        {isAnalyzed && candidate.aiEvaluation ? (
          <CandidateScoreRing score={candidate.aiEvaluation.matchScore} />
        ) : (
          <AnalyzeResumeButton isAnalyzing={isAnalyzing} onAnalyze={onAnalyze} />
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-gray-400 text-[11px]">{formatAppliedAt(candidate.appliedAt)}</span>
        <CandidateActions
          status={candidate.status}
          isBusy={isBusy}
          onView={onOpenProfile}
          onBookmark={onBookmark}
          onUnbookmark={onUnbookmark}
          onShortlist={onShortlist}
          onUnshortlist={onUnshortlist}
          onReject={onReject}
        />
      </div>
    </div>
  );
}