import { useEffect, useState } from "react";
import { FileText, Target } from "lucide-react";
import {
  demoCandidate,
  engineChecklist,
  jobMatch,
  icons,
} from "./Intelligencedata";

const { Sparkles, CheckCircle2, Quote } = icons;

function PanelLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <Icon className="w-4 h-4 text-primary-600" />
      <span className="text-primary-600 text-sm font-semibold uppercase tracking-wide">
        {children}
      </span>
    </div>
  );
}

/**
 * The section's signature visual: a single worked example that shows,
 * side by side, what the engine reads on a resume, what it checks for,
 * and the evidence it surfaces against a specific job requirement.
 *
 * Consolidates two near-duplicate mockups from the original Figma export
 * (a compact "Evidence vs Requirement" card and a fuller three-panel demo)
 * into one component, so the section makes its case once, clearly.
 *
 * Motion: checklist cards float continuously, match-progress bars grow in
 * from 0% the moment the card mounts, and the match badge has a soft
 * glow — mirroring the fragment-card / data-stream treatment from the
 * reference mockups.
 */
export default function CandidateMatchShowcase() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="intel-stagger-3 w-full bg-secondary-50 rounded-xl shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] outline outline-1 outline-offset-[-1px] outline-secondary-300 p-6 sm:p-10 lg:p-12 overflow-hidden">
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-8 items-start">
        {/* Animated dashed connectors — desktop only, purely decorative */}
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="intel-flow-line stroke-primary-600"
            d="M 300 160 C 340 160, 340 210, 380 210"
            fill="none"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <path
            className="intel-flow-line stroke-primary-600"
            d="M 620 210 C 660 210, 660 160, 700 160"
            fill="none"
            strokeWidth="1.5"
            opacity="0.45"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>

        {/* Candidate resume */}
        <div className="relative z-10 flex flex-col gap-5">
          <PanelLabel icon={FileText}>Candidate Resume</PanelLabel>

          <div className="bg-secondary-50 rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 p-6 flex flex-col gap-6 transition-shadow hover:shadow-[0px_8px_28px_0px_rgba(91,33,182,0.12)]">
            <div className="flex items-center gap-4 pb-4 border-b border-secondary-300">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-semibold text-lg shrink-0">
                {demoCandidate.initials}
              </div>
              <div>
                <p className="text-zinc-900 font-semibold leading-6">
                  {demoCandidate.name}
                </p>
                <p className="text-neutral-600 text-xs font-medium tracking-wide">
                  {demoCandidate.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {demoCandidate.resumeSections.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group -mx-2 p-2 rounded border-l-2 border-transparent hover:border-primary-600 hover:bg-primary-50/60 transition-colors flex flex-col gap-1"
                >
                  <p className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium tracking-wide group-hover:text-primary-600 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-primary-600" />
                    {label}
                  </p>
                  <p className="text-zinc-900 text-sm leading-5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI engine checklist — floating cards */}
        <div className="relative z-10 flex flex-col items-center gap-5 lg:pt-1">
          <PanelLabel icon={Sparkles}>Hiring360 AI Engine</PanelLabel>

          <div className="w-full lg:w-56 flex flex-col gap-4">
            {engineChecklist.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="intel-float p-4 bg-secondary-50 rounded-lg shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-between gap-3"
                style={{ animationDelay: `${i}s` }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-zinc-900 text-sm">{label}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Job matching & evidence */}
        <div className="relative z-10 flex flex-col gap-5">
          <PanelLabel icon={Target}>Job Matching &amp; Evidence</PanelLabel>

          <div className="bg-secondary-50 rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 p-6 flex flex-col gap-6 transition-shadow hover:shadow-[0px_8px_28px_0px_rgba(91,33,182,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-zinc-900 font-semibold leading-6">
                {jobMatch.roleTitle}
              </p>
              <span className="relative shrink-0">
                <span className="intel-glow absolute inset-0 rounded-full bg-primary-600/30 blur-sm" />
                <span className="relative px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-xs font-bold tracking-wide">
                  {jobMatch.matchPercent}% Match
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {jobMatch.requirements.map((req) => (
                <div key={req.label} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end gap-3">
                    <span className="text-zinc-600 text-xs font-medium tracking-wide">
                      {req.label}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 text-primary-600 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="h-2 bg-secondary-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-[width] duration-1000 ease-out"
                      style={{ width: revealed ? `${req.fillPercent}%` : "0%" }}
                    />
                  </div>

                  <div className="p-3 bg-primary-50 rounded border-l-2 border-primary-600 flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-primary-600 mt-0.5 shrink-0" />
                    <p className="text-neutral-600 text-sm leading-5">
                      {req.evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}