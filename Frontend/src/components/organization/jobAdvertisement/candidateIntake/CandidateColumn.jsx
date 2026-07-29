import React from "react";

/**
 * Generic pipeline column (Pending / Bookmarked / Shortlisted).
 * Presentational for cards, but owns the drop zone: `status` tells it
 * which pipeline stage it represents, and a drop here bubbles the
 * dragged candidate's id + this status up to onDrop, which
 * CandidateIntakeOverview turns into the same bookmark/shortlist/move
 * calls the action buttons already use.
 */
export default function CandidateColumn({
  title,
  subtitle,
  count,
  badgeClassName = "bg-secondary-200 text-slate-900",
  emptyIcon: EmptyIcon,
  emptyMessage = "Nothing here yet",
  isEmpty,
  status,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  children,
}) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="px-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-slate-900 text-base font-semibold leading-6">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClassName}`}>{count}</span>
        </div>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => {
          event.preventDefault();
          onDragEnter?.(status);
        }}
        onDragLeave={(event) => {
          // Children re-fire dragenter/dragleave as the pointer moves over
          // them; only clear the highlight once we've actually left the
          // column's own bounding box, not just crossed into a card.
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onDragLeave?.(status);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          const candidateId = event.dataTransfer.getData("text/plain");
          onDrop?.(candidateId, status);
        }}
        className={`app-candidate-column-drop flex-1 min-h-[14rem] max-h-[40rem] overflow-y-auto flex flex-col gap-3 pr-1 p-1 ${
          isDragOver ? "is-drag-over" : ""
        }`}
      >
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-secondary-300 text-center p-8">
            {EmptyIcon && <EmptyIcon className="w-6 h-6 text-secondary-400" />}
            <p className="text-gray-400 text-xs italic">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}