import React from "react";
import { Check, X, Download } from "lucide-react";
import SocialPostCopyCard from "./SocialPostCopyCard";
import SharePlatformButtons from "./SharePlatformButtons";
import { publishModalCopy, publishSummaryFields } from "./publishModalData";
import { buildApplyUrl, buildSocialPostText, buildShareLinks, copyTextToClipboard, downloadDataUrl } from "./publishUtils";

/**
 * PublishSuccessModal
 * ------------------------------------------------------------------
 * Shown after a successful publish. Same visual structure as the
 * Figma export (hero band with an overlapping checkmark badge, title,
 * subtitle, a 3-column summary card, the social copy box, a share
 * row, and footer actions) but rebuilt with this project's existing
 * design tokens (primary-800 / secondary-300 / slate-900 / gray-700)
 * instead of the raw zinc/violet/fuchsia classes from the export, so
 * it stays visually consistent with every other screen in the app —
 * the two color sets are close enough that the look barely changes.
 *
 * There's no real photo asset for the hero band, so it's a gradient +
 * dot-pattern treatment instead of an <img>, keeping the same
 * fade-to-white + overlapping circular badge effect from the design.
 * ------------------------------------------------------------------
 */
export default function PublishSuccessModal({
  isOpen,
  onClose,
  onReturnToDashboard,
  formData,
  organizationName = "Your Company",
  pamphletImageDataUrl,
  jobId,
}) {
  if (!isOpen) return null;

  const applyUrl = buildApplyUrl(jobId);
  const postText = buildSocialPostText({
    jobTitle: formData?.jobTitle,
    organizationName,
    department: formData?.department,
    applyUrl,
  });
  const shareLinks = buildShareLinks({ text: postText, url: applyUrl });

  const summaryValues = {
    jobTitle: formData?.jobTitle || "Untitled Role",
    organizationName,
    department: formData?.department || "—",
  };

  const handleInstagramShare = async () => {
    await copyTextToClipboard(postText);
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleDownloadImage = () => {
    if (!pamphletImageDataUrl) return;
    const filename = `${(formData?.jobTitle || "job-pamphlet").trim().replace(/\s+/g, "-").toLowerCase()}.png`;
    downloadDataUrl(pamphletImageDataUrl, filename);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-success-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden my-8">
        {/* Hero band */}
        <div className="w-full h-40 relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-300 shrink-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-primary-800 flex items-center justify-center shadow-lg ring-4 ring-white">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className="px-8 pt-10 pb-8 flex flex-col gap-2 overflow-y-auto">
          <h2 id="publish-success-title" className="text-center text-primary-800 text-3xl font-bold leading-10">
            {publishModalCopy.title}
          </h2>
          <p className="text-center text-gray-700 text-base leading-6 pb-4">{publishModalCopy.subtitle}</p>

          <div className="px-6 py-6 bg-primary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {publishSummaryFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{field.label}</span>
                <span className="text-slate-900 text-base font-semibold leading-6">{summaryValues[field.key]}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <SocialPostCopyCard text={postText} />
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <span className="text-slate-900 text-sm font-bold uppercase tracking-tight">Share on Platforms</span>
            <SharePlatformButtons shareLinks={shareLinks} onInstagramShare={handleInstagramShare} />
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={!pamphletImageDataUrl}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-base font-medium hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Campaign Image
            </button>
            <button
              type="button"
              onClick={onReturnToDashboard}
              className="flex-1 py-3 rounded-xl bg-primary-800 text-white text-base font-medium shadow-[0px_10px_15px_-3px_rgba(107,56,212,0.2)] hover:bg-primary-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}