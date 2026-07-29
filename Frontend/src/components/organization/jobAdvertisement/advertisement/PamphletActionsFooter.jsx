import React from "react";
import { ArrowLeft, RefreshCcw, Check } from "lucide-react";

/** Back link + the two pamphlet-level actions. All three are just navigation/reset — there's nothing to "save" beyond what's already in state. */
export default function PamphletActionsFooter({ onBack, onGenerateNew, onConfirm }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-primary-800 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Details
      </button>

      <div className="flex items-center gap-3">
        {/* <button
          type="button"
          onClick={onGenerateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Generate New
        </button> */}
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}