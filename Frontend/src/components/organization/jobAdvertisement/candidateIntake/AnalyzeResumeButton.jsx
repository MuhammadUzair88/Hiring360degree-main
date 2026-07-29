import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

/**
 * Small reusable "Analyze Resume" trigger. The card and the drawer
 * header both render this until that candidate has been analyzed —
 * once analyzed, the caller swaps it out for the real score/verdict.
 */
export default function AnalyzeResumeButton({ isAnalyzing, onAnalyze, size = "sm" }) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={(event) => {
        // Card is now fully clickable to open the drawer — stop this
        // from also triggering that.
        event.stopPropagation();
        onAnalyze?.(event);
      }}
      disabled={isAnalyzing}
      aria-label="Analyze resume with AI"
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-wait shrink-0 ${
        isLarge
          ? "px-4 py-2.5 text-sm bg-primary-800 text-white hover:bg-primary-700"
          : "px-2.5 py-1.5 text-[11px] bg-primary-800/10 text-primary-800 hover:bg-primary-800 hover:text-white"
      }`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className={`${isLarge ? "w-4 h-4" : "w-3 h-3"} animate-spin`} />
          Analyzing…
        </>
      ) : (
        <>
          <Sparkles className={`${isLarge ? "w-4 h-4" : "w-3 h-3"}`} />
          Analyze CV
        </>
      )}
    </button>
  );
}