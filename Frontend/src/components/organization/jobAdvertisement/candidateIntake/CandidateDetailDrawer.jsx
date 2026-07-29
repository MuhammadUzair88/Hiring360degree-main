import React, { useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import CandidateDrawerHeader from "./CandidateDrawerHeader";
import QualificationScorecard from "./QualificationScoreCard";
import CandidateSummaryCard from "./CandidateSummaryCard";
import SkillsAssessmentCard from "./SkillsAssessmentCard";
import CandidateInsightsPanel from "./CandidateInsightsPanel";
import ResumePreviewPanel from "./ResumePreviewPanel";
import CandidateActions from "./CandidateActions";
import AnalyzeResumeButton from "./AnalyzeResumeButton";

/**
 * Right-side slide-in drawer showing the full AI evaluation for one
 * candidate. The evaluation panels only render once `isAnalyzed` is
 * true for this candidate — that flag lives in CandidateIntakeOverview,
 * so it's shared with the card and survives closing/reopening the drawer.
 */
export default function CandidateDetailDrawer({
  candidate,
  isBusy,
  isAnalyzed,
  isAnalyzing,
  onAnalyze,
  onClose,
  onBookmark,
  onUnbookmark,
  onShortlist,
  onUnshortlist,
  onReject,
}) {
  useEffect(() => {
    if (!candidate) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [candidate, onClose]);

  if (!candidate) return null;
  const evaluation = isAnalyzed ? candidate.aiEvaluation : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${candidate.name} candidate evaluation`}
        className="relative w-full sm:max-w-4xl h-full bg-secondary-50 shadow-2xl flex flex-col overflow-hidden"
      >
        <CandidateDrawerHeader
          candidate={candidate}
          isAnalyzed={isAnalyzed}
          isAnalyzing={isAnalyzing}
          onAnalyze={onAnalyze}
          onClose={onClose}
        />

        <div className="flex-1 flex flex-col sm:flex-row overflow-y-auto">
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto min-w-0">
            {evaluation ? (
              <>
                <QualificationScorecard scorecard={evaluation.scorecard} />
                <CandidateSummaryCard summary={evaluation.summary} />
                <SkillsAssessmentCard skills={evaluation.skills} />
                <CandidateInsightsPanel
                  keyAchievements={evaluation.keyAchievements}
                  strengths={evaluation.strengths}
                  concerns={evaluation.concerns}
                  formattingIssues={evaluation.resumeFormattingIssues}
                  detailedAnalysis={evaluation.detailedAnalysis}
                />
              </>
            ) : isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary-800" />
                <p className="text-gray-500 text-sm">Analyzing resume… this usually takes a few seconds.</p>
              </div>
            ) : candidate.aiEvaluation ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
                <Sparkles className="w-10 h-10 text-primary-800/50" />
                <div>
                  <p className="text-slate-900 text-sm font-semibold">Resume not analyzed yet</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Run the AI analyzer to see the match score, scorecard, and insights.
                  </p>
                </div>
                <AnalyzeResumeButton isAnalyzing={isAnalyzing} onAnalyze={onAnalyze} size="lg" />
              </div>
            ) : (
              <p className="text-gray-500 text-sm">AI evaluation isn't available for this candidate yet.</p>
            )}
          </div>

          <ResumePreviewPanel resume={candidate.resume} candidateName={candidate.name} />
        </div>

        <div className="border-t border-secondary-300 p-4 sm:px-6 flex items-center justify-between bg-secondary-50">
          <span className="text-gray-500 text-xs truncate">Application ID: {candidate.id}</span>
          <CandidateActions
            status={candidate.status}
            isBusy={isBusy}
            showView={false}
            onBookmark={onBookmark}
            onUnbookmark={onUnbookmark}
            onShortlist={onShortlist}
            onUnshortlist={onUnshortlist}
            onReject={onReject}
          />
        </div>
      </div>
    </div>
  );
}