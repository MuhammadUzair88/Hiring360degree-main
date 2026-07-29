import React, { useState } from "react";
import { ListChecks, Plus, X, Info } from "lucide-react";
import { DEFAULT_ROUND_NAMES } from "./data";

/**
 * Blocking, one-time setup popup. There's no route to reach the Rounds
 * workspace without finalizing this first, so it has no "cancel" path —
 * "Reset" just clears the draft back to the suggested defaults.
 */
export default function RoundsSetupModal({ onFinalize }) {
  const [roundNames, setRoundNames] = useState(DEFAULT_ROUND_NAMES);
  const [error, setError] = useState("");

  const updateName = (index, value) => {
    setRoundNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  };

  const addRound = () => {
    setRoundNames((prev) => [...prev, `Round ${prev.length + 1}`]);
  };

  const removeRound = (index) => {
    if (roundNames.length === 1) return;
    setRoundNames((prev) => prev.filter((_, i) => i !== index));
  };

  const resetDraft = () => {
    setRoundNames(DEFAULT_ROUND_NAMES);
    setError("");
  };

  const handleFinalize = () => {
    if (roundNames.some((name) => !name.trim())) {
      setError("Every round needs a name before you can continue.");
      return;
    }
    onFinalize(roundNames);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="w-full max-w-xl bg-secondary-50 rounded-xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-primary-800" />

        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-800/10 flex items-center justify-center shrink-0">
              <ListChecks className="w-4 h-4 text-primary-800" />
            </span>
            <h2 className="text-slate-900 text-2xl font-semibold leading-8">Configure Interview Rounds</h2>
          </div>
          <p className="mt-2 text-gray-700 text-sm leading-6">
            Decide how many interview rounds this job needs before opening the tracking workspace. This
            framework applies to every shortlisted candidate in the current pipeline.
          </p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {roundNames.map((name, index) => (
              <div key={index} className="p-4 bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-3">
                <span className="w-7 h-7 shrink-0 rounded-md bg-primary-800 text-white text-xs font-bold flex items-center justify-center">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => updateName(index, event.target.value)}
                  placeholder={`Round ${index + 1} name`}
                  className="flex-1 min-w-0 bg-transparent text-slate-900 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => removeRound(index)}
                  disabled={roundNames.length === 1}
                  aria-label="Remove round"
                  className="p-1.5 rounded-full text-gray-500 hover:bg-danger-50 hover:text-danger-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="px-4 py-2.5 rounded-lg bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={addRound}
            className="py-3 rounded-xl outline outline-2 outline-offset-[-2px] outline-secondary-300 text-gray-700 text-sm font-semibold flex items-center justify-center gap-2 hover:outline-primary-800/40 hover:text-primary-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Next Level Round
          </button>

          <div className="p-5 bg-primary-800/5 rounded-xl flex flex-col gap-3">
            <span className="flex items-center gap-2 text-primary-800 text-xs font-bold uppercase tracking-wide">
              <Info className="w-4 h-4" />
              Framework Constraints
            </span>
            <ul className="flex flex-col gap-1.5 text-gray-700 text-xs leading-5 list-disc pl-4">
              <li>Interviewers cannot be assigned overlapping time slots</li>
              <li>Interviews cannot be scheduled in the past</li>
              <li>Candidates must clear a round before appearing in the next one</li>
              <li>Every round shares the same tracking workspace layout</li>
            </ul>
          </div>
        </div>

        <div className="px-8 py-5 bg-primary-800/5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetDraft}
            className="px-5 py-2.5 rounded-lg text-gray-700 text-sm font-semibold hover:bg-secondary-200 transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            className="px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-semibold shadow-md hover:bg-primary-700 transition-colors"
          >
            Finalize Framework Setup
          </button>
        </div>
      </div>
    </div>
  );
}