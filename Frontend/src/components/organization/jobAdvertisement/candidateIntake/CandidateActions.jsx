import React from "react";
import { Eye, Bookmark, X, Check, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { CANDIDATE_STATUS } from "./data";

const BUTTON_STYLES = {
  neutral: "border-secondary-300 bg-secondary-50 text-gray-600 hover:border-primary-800/40 hover:text-primary-800",
  bookmark: "border-info-200 bg-info-50 text-info-600 hover:bg-info-600 hover:text-white hover:border-info-600",
  reject: "border-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-600 hover:text-white hover:border-danger-600",
  accept: "border-success-200 bg-success-50 text-success-600 hover:bg-success-600 hover:text-white hover:border-success-600",
  revert: "border-warning-200 bg-warning-50 text-warning-600 hover:bg-warning-600 hover:text-white hover:border-warning-600",
};

function ActionButton({ icon: Icon, styleKey, label, onClick }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        // Stops the click from also bubbling up to the card's own
        // onClick (which opens the drawer) now that the whole card
        // is clickable.
        event.stopPropagation();
        onClick?.(event);
      }}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg border transition-colors ${BUTTON_STYLES[styleKey]}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

/**
 * The row of icon buttons shown on a candidate card and in the drawer
 * footer. Which buttons render is driven entirely by `status`, so the
 * three pipeline stages never need three copies of this markup.
 */
export default function CandidateActions({
  status,
  isBusy = false,
  showView = true,
  onView,
  onBookmark,
  onUnbookmark,
  onShortlist,
  onUnshortlist,
  onReject,
}) {
  if (isBusy) {
    return (
      <div className="p-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary-800" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {showView && <ActionButton icon={Eye} styleKey="neutral" label="View full evaluation" onClick={onView} />}

      {status === CANDIDATE_STATUS.PENDING && (
        <>
          <ActionButton icon={Bookmark} styleKey="bookmark" label="Bookmark candidate" onClick={onBookmark} />
          <ActionButton icon={X} styleKey="reject" label="Reject candidate" onClick={onReject} />
          <ActionButton icon={Check} styleKey="accept" label="Shortlist candidate" onClick={onShortlist} />
        </>
      )}

      {status === CANDIDATE_STATUS.BOOKMARKED && (
        <>
          <ActionButton icon={RefreshCw} styleKey="revert" label="Move back to pending" onClick={onUnbookmark} />
          <ActionButton icon={X} styleKey="reject" label="Reject candidate" onClick={onReject} />
          <ActionButton icon={Check} styleKey="accept" label="Shortlist candidate" onClick={onShortlist} />
        </>
      )}

      {status === CANDIDATE_STATUS.SHORTLISTED && (
        <>
          <ActionButton icon={ArrowLeft} styleKey="revert" label="Move back to pending" onClick={onUnshortlist} />
          <ActionButton icon={X} styleKey="reject" label="Reject candidate" onClick={onReject} />
        </>
      )}
    </div>
  );
}