import React, { useRef, useState } from "react";
import { PenTool, Upload, Loader2, X, AlertCircle, CheckCircle } from "lucide-react";
import { uploadImageToCloudinary } from "../../../../utils/uploadImage";

/** One-time setup: upload the organization's signature for this job's offer letters. */
export default function OfferLetterSetupModal({
  onFinalize,
  organizationName = "Your Organization",
}) {
  const fileInputRef = useRef(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, and SVG files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setError(null);
    setSignatureFile(file);

    const reader = new FileReader();
    reader.onload = (readerEvent) => setSignaturePreview(readerEvent.target.result);
    reader.onerror = () => setError("Could not preview the selected signature.");
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFinish = async () => {
    if (!signatureFile || !signaturePreview) {
      setError("Please upload a signature image first.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const signatureUrl = await uploadImageToCloudinary(signatureFile);

      await onFinalize({
        url: signatureUrl,
        name: signatureFile.name,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err?.message || "Failed to save your signature. Please try again.");
    } finally {
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
                <h2 className="text-slate-900 text-lg sm:text-xl font-semibold leading-7">
                  Set Up Offer Letters
                </h2>
                <p className="text-gray-500 text-sm mt-0.5 truncate">{organizationName}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 text-sm leading-6">
              Upload your organization's digital signature. It will be saved securely and used on offer letters for this job.
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-8 flex flex-col gap-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-danger-500 hover:text-danger-700 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">
                Digital Signature
              </span>

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
                      <img
                        src={signaturePreview}
                        alt="Signature preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500 shrink-0" />
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {signatureFile?.name || "Signature selected"}
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

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
              />
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
