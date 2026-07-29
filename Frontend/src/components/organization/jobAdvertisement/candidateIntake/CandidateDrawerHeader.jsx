import React from "react";
import { X, CheckCircle2, User, Briefcase, GraduationCap, ShieldAlert } from "lucide-react";
import AnalyzeResumeButton from "./AnalyzeResumeButton";

function getVerdictStyle(verdict = "") {
  const normalized = verdict.toLowerCase();
  if (normalized.includes("strong")) return { bg: "bg-success-50", border: "border-success-200", text: "text-success-700", icon: "text-success-600" };
  if (normalized.includes("weak") || normalized.includes("not")) return { bg: "bg-danger-50", border: "border-danger-200", text: "text-danger-700", icon: "text-danger-600" };
  return { bg: "bg-primary-800/5", border: "border-primary-800/20", text: "text-primary-800", icon: "text-primary-800" };
}

function getRiskTextClass(level = "") {
  const normalized = level.toLowerCase();
  if (normalized === "low") return "text-success-600";
  if (normalized === "high") return "text-danger-600";
  return "text-warning-600";
}

/** Title row + verdict badge (or Analyze button) + the 4-up quick facts. */
export default function CandidateDrawerHeader({ candidate, isAnalyzed, isAnalyzing, onAnalyze, onClose }) {
  const evaluation = isAnalyzed ? candidate.aiEvaluation : null;

  const facts = [
    { icon: User, label: "Candidate", value: candidate.name },
    { icon: Briefcase, label: "Experience", value: evaluation?.experience || "—" },
    { icon: GraduationCap, label: "Education", value: evaluation ? `Score: ${evaluation.educationScore}%` : "—" },
    evaluation && {
      icon: ShieldAlert,
      label: "Risk Level",
      value: evaluation.riskLevel,
      valueClassName: getRiskTextClass(evaluation.riskLevel),
      helperText: `${evaluation.flagsCount} flag${evaluation.flagsCount === 1 ? "" : "s"}`,
    },
  ].filter(Boolean);

  const verdictStyle = evaluation ? getVerdictStyle(evaluation.verdict) : null;

  return (
    <div className="border-b border-secondary-300 p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-slate-900 text-xl font-semibold leading-7">Candidate Evaluation</h2>
          <p className="text-gray-500 text-sm">AI-Powered Analysis</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {!isAnalyzed ? (
            <AnalyzeResumeButton isAnalyzing={isAnalyzing} onAnalyze={onAnalyze} size="lg" />
          ) : (
            verdictStyle && (
              <div className={`px-4 py-2 rounded-xl border ${verdictStyle.bg} ${verdictStyle.border} flex items-center gap-2 max-w-xs`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${verdictStyle.icon}`} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-sm font-bold ${verdictStyle.text}`}>{evaluation.matchScore}%</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${verdictStyle.text}`}>{evaluation.verdict}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-4">{evaluation.verdictSummary}</p>
                </div>
              </div>
            )
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close candidate evaluation"
            className="p-2 rounded-full text-gray-500 hover:bg-secondary-200 hover:text-slate-900 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {facts.map((fact) => (
          <div key={fact.label} className="p-3 rounded-xl bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wide">
              <fact.icon className="w-3 h-3" />
              {fact.label}
            </span>
            <span className={`text-sm font-semibold truncate ${fact.valueClassName || "text-slate-900"}`}>{fact.value}</span>
            {fact.helperText && <span className="text-gray-400 text-[10px]">{fact.helperText}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}