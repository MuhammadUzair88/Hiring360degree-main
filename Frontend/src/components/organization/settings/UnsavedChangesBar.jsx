import React from "react";
import { unsavedChangesCopy } from "./settingdata";

/**
 * Sticky save/discard bar. Rendered as the last item in the page's
 * flex column so `sticky bottom-0` pins it to the bottom of the
 * viewport without ever overlapping the sidebar — it only spans the
 * width of the content column it lives in.
 *
 * The negative margins cancel out `.app-content`'s own padding so the
 * bar reaches the true edges of the content area, matching the
 * full-bleed bar in the design.
 */
export default function UnsavedChangesBar({
  visible = false,
  message = unsavedChangesCopy.message,
  discardLabel = unsavedChangesCopy.discardLabel,
  saveLabel = unsavedChangesCopy.saveLabel,
  onDiscard = () => {},
  onSave = () => {},
}) {
  if (!visible) return null;

  return (
    <div className="sticky bottom-0 inset-x-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 mt-8">
      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.05)] border-t border-secondary-300/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <span className="text-gray-900 text-sm font-medium leading-5">{message}</span>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onDiscard}
            className="px-6 py-2 text-neutral-600 text-sm font-bold leading-5 hover:text-gray-900 transition-colors"
          >
            {discardLabel}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2 bg-primary-800 rounded-lg text-white text-sm font-bold leading-5 hover:bg-primary-700 transition-colors"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}