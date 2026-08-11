import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export default function DeleteAdvertisementModal({
  open = false,
  advertisement = null,
  isDeleting = false,
  onClose = () => {},
  onConfirm = () => {},
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDeleting, onClose]);

  if (!open || !advertisement) return null;

  const applicantCount = Number(advertisement.applicantsCount || 0);
  const hasCandidateHistory = applicantCount > 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[1px]"
        aria-label="Close delete advertisement dialog"
        onClick={() => !isDeleting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-advertisement-title"
        className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-2xl border border-secondary-300 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-secondary-200 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="delete-advertisement-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete advertisement?
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-secondary-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="min-w-0 rounded-xl border border-secondary-200 bg-secondary-100/70 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              Advertisement
            </p>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
              {advertisement.title || "Untitled Job"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
            </p>
          </div>

          {hasCandidateHistory ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              This advertisement already has candidate history. Permanent deletion is disabled so applications, interviews, evaluations, and offers are not broken. Use <span className="font-semibold">Close advertisement</span> from the three-dot menu instead.
            </div>
          ) : (
            <p className="text-sm leading-6 text-gray-600">
              Permanently delete <span className="font-semibold text-slate-900">{advertisement.title || "this advertisement"}</span>? Any generated advertisement assets will also be removed.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="h-10 rounded-xl border border-secondary-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-secondary-100 disabled:opacity-50"
            >
              Cancel
            </button>

            {!hasCandidateHistory ? (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex h-10 min-w-[166px] items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete permanently
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
