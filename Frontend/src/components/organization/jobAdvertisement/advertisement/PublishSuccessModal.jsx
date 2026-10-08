import React, { useState } from "react";

import { Download, Send } from "lucide-react";

import SocialPostCopyCard from "./SocialPostCopyCard";
import SocialPublishModal from "../../../../pages/connectSocials/SocialPublishModal";

import { publishModalCopy, publishSummaryFields } from "./publishmodaldata";

import {
  buildApplyUrl,
  buildSocialPostText,
  downloadDataUrl,
} from "./publishutils";

export default function PublishSuccessModal({
  isOpen,
  onClose,
  onReturnToDashboard,
  formData,
  organizationName = "Your Company",
  pamphletImageDataUrl,
  jobId,
}) {
  const [socialModalOpen, setSocialModalOpen] = useState(false);

  if (!isOpen) {
    return null;
  }

  const applyUrl = buildApplyUrl(jobId);

  const postText = buildSocialPostText({
    jobTitle: formData?.jobTitle,
    organizationName,
    department: formData?.department,
    applyUrl,
  });

  const summaryValues = {
    jobTitle: formData?.jobTitle || "Untitled Role",

    organizationName,

    department: formData?.department || "—",
  };

  const handleDownloadImage = () => {
    if (!pamphletImageDataUrl) {
      return;
    }

    const filename = `${(formData?.jobTitle || "job-pamphlet")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()}.png`;

    downloadDataUrl(pamphletImageDataUrl, filename);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-xl">
          {/* HERO */}

          <div className="relative bg-primary-800 px-8 py-10 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative text-center text-white">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-white text-primary-800 flex items-center justify-center">
                ✓
              </div>

              <h2 className="text-3xl font-bold">{publishModalCopy.title}</h2>

              <p className="mt-2 text-white/80">{publishModalCopy.subtitle}</p>
            </div>
          </div>

          <div className="px-8 py-8 overflow-y-auto">
            {/* SUMMARY */}

            <div className="px-6 py-6 bg-primary-50 rounded-xl border border-secondary-300 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {publishSummaryFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    {field.label}
                  </span>

                  <span className="text-slate-900 text-base font-semibold">
                    {summaryValues[field.key]}
                  </span>
                </div>
              ))}
            </div>

            {/* COPY */}

            <div className="pt-6">
              <SocialPostCopyCard text={postText} />
            </div>

            {/* SOCIAL */}

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSocialModalOpen(true)}
                className="w-full py-4 rounded-xl bg-primary-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-700"
              >
                <Send className="w-5 h-5" />
                Publish to Social Media
              </button>
            </div>

            {/* ACTIONS */}

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={!pamphletImageDataUrl}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-800 text-primary-800 font-medium disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download Campaign Image
              </button>

              <button
                type="button"
                onClick={onReturnToDashboard}
                className="flex-1 py-3 rounded-xl bg-primary-800 text-white font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <SocialPublishModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        formData={formData}
        organizationName={organizationName}
        pamphletImageDataUrl={pamphletImageDataUrl}
        jobId={jobId}
      />
    </>
  );
}
