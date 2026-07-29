import React, { useRef, useState } from "react";
import { PenTool, Upload, Loader2, X, AlertCircle, CheckCircle, CalendarClock } from "lucide-react";
import { DEFAULT_OFFER_VALIDITY_DAYS } from "./data";

/**
 * One-time, blocking setup screen shown the first time HR opens the
 * Offer Letter tab for a job. Collects the organization's digital
 * signature and how many days a candidate has to accept an offer.
 *
 * Rendered unconditionally by OfferLetterOverview while
 * `!offerLetter.isConfigured` — there's no `isOpen` prop here because
 * the parent already controls whether this component mounts at all.
 */
export default function OfferLetterSetupModal({ onFinalize, organizationName = "Your Organization" }) {
  const fileInputRef = useRef(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [validityDays, setValidityDays] = useState(DEFAULT_OFFER_VALIDITY_DAYS);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, and SVG files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setError(null);
    setSignatureFile(file);

    const reader = new FileReader();
    reader.onload = (event) => setSignaturePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFinish = async () => {
    if (!signaturePreview) {
      setError("Please upload a signature image first.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      // Simulated save delay — swap for a real upload call when ready.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const signature = {
        url: signaturePreview,
        name: signatureFile.name,
        uploadedAt: new Date().toISOString(),
      };

      onFinalize(signature, Number(validityDays) || DEFAULT_OFFER_VALIDITY_DAYS);
    } catch {
      setError("Failed to save your setup. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="w-full max-w-lg bg-secondary-50 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="h-1 bg-primary-800 shrink-0" />

        <div className="overflow-y-auto">
          <div className="px-6 sm:px-8 pt-8 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary-800/10 flex items-center justify-center shrink-0">
                <PenTool className="w-5 h-5 text-primary-800" />
              </span>
              <div className="min-w-0">
                <h2 className="text-slate-900 text-lg sm:text-xl font-semibold leading-7">Set Up Offer Letters</h2>
                <p className="text-gray-500 text-sm mt-0.5 truncate">{organizationName}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 text-sm leading-6">
              Upload your organization's digital signature and set how long candidates have to accept an
              offer. Both apply to every offer letter for this job — you'll only need to do this once.
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-8 flex flex-col gap-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-danger-500 hover:text-danger-700 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Signature upload */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">Digital Signature</span>

              {!signaturePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="w-full border-2 border-dashed border-secondary-300 hover:border-primary-800/40 bg-secondary-100/50 hover:bg-secondary-100 rounded-xl p-6 sm:p-8 transition-colors group disabled:opacity-60"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-800/5 group-hover:bg-primary-800/10 flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6 text-gray-500 group-hover:text-primary-800 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-800 transition-colors">
                        Click to upload signature
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, or SVG — Max 5MB</p>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="bg-secondary-100 rounded-xl p-4 sm:p-6 outline outline-1 outline-offset-[-1px] outline-primary-800/20">
                  <div className="flex items-center gap-4">
                    <div className="w-20 sm:w-24 h-14 sm:h-16 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center p-2 shrink-0">
                      <img src={signaturePreview} alt="Signature preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500 shrink-0" />
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {signatureFile?.name || "Signature uploaded"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isSaving}
                        className="text-xs text-danger-600 hover:text-danger-700 font-semibold mt-2 transition-colors disabled:opacity-50"
                      >
                        Remove &amp; re-upload
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleFileSelect} className="hidden" />
            </div>

            {/* Offer validity */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" /> Offer Acceptance Deadline
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                  className="w-24 px-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                />
                <span className="text-gray-500 text-sm">days to accept, counted from the letter date</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-secondary-300">
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-semibold shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Finish Setup"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}