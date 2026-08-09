import React, { useRef, useState, useEffect } from "react";
import { Save, ArrowLeft, PenTool, CheckCircle2, RefreshCcw, Loader2, Upload, AlertCircle } from "lucide-react";
import DesignControls from "./DesignControls";
import A4Preview from "./A4Preview";
import { getTodayDateInput } from "./offerDateUtils";
import { uploadImageToCloudinary } from "../../../../utils/uploadImage";
import { resolveOfferPalette } from "./Theme";

/**
 * Design + signature customization screen. Reached inline from the
 * "Customize" button on OfferLetterCard — same pattern as the
 * pamphlet's PamphletOverview, not a separate route. Design changes
 * apply live (persisted via onDesignChange as they happen), so
 * there's nothing to "save" beyond returning to the dashboard.
 */
export default function OfferLetterStudio({ organizationName, organization, advertisement, previewCandidate, design, onDesignChange, onResetColors, signature, onSignatureChange, onBack }) {
  const fileInputRef = useRef(null);
  const [pendingSignature, setPendingSignature] = useState(signature);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setPendingSignature(signature), [signature]);

  const currentColors = resolveOfferPalette(design?.colors, design?.theme || "corporate");

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      event.target.value = "";
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, and SVG files are allowed.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      const next = { url: uploadedUrl, name: file.name, uploadedAt: new Date().toISOString() };
      await onSignatureChange(next);
      setPendingSignature(next);
    } catch {
      setError("Signature upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveSignature = async () => {
    setIsUploading(true);
    setError("");
    try {
      await onSignatureChange(null);
      setPendingSignature(null);
    } catch (err) {
      setError(err?.message || "Could not remove the saved signature.");
    } finally {
      setIsUploading(false);
    }
  };

  const organizationDisplayName = organization?.name || organizationName || "Your Organization";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 hover:bg-secondary-100 text-gray-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-slate-900 text-xl sm:text-2xl font-semibold leading-tight">Customize Offer Letter</h1>
          <p className="text-gray-700 text-sm">Update the design, colors, or signature. Applies to every candidate's letter for this job.</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 outline outline-1 outline-offset-[-1px] outline-red-200 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-semibold shrink-0">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Signature */}
          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" /> Digital Signature
            </span>
            <p className="text-gray-500 text-xs leading-4">Saved for {organizationDisplayName}. Appears on every offer letter.</p>

            {pendingSignature?.url ? (
              <div className="p-4 bg-secondary-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-4">
                <div className="w-20 h-14 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center p-2 shrink-0">
                  <img src={pendingSignature.url} alt="Signature" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 truncate">
                    <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
                    {pendingSignature.name || "Uploaded"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-800/10 text-primary-800 text-xs font-semibold hover:bg-primary-800/20 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />} Change
                    </button>
                    <button type="button" onClick={handleRemoveSignature} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger-50 text-danger-600 text-xs font-semibold hover:bg-danger-100 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="py-8 rounded-xl outline outline-2 outline-dashed outline-offset-[-2px] outline-secondary-300 hover:outline-primary-800/40 bg-secondary-100/50 hover:bg-secondary-100 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-primary-800" />
                    <span className="text-sm font-semibold text-slate-900">Uploading…</span>
                  </>
                ) : (
                  <>
                    <span className="w-10 h-10 rounded-full bg-primary-800/10 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary-800" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">Click to upload signature</span>
                    <span className="text-gray-500 text-xs">PNG, JPG, SVG · Max 5MB</span>
                  </>
                )}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* Design controls */}
          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300">
            <DesignControls
              theme={design.theme}
              setTheme={(value) =>
                  onDesignChange({
                    theme: value,
                    colors: resolveOfferPalette(null, value),
                  })
                }
              brandingPreference={design.brandingPreference}
              setBrandingPreference={(value) => onDesignChange({ brandingPreference: value })}
              logoSize={design.logoSize}
              setLogoSize={(value) => onDesignChange({ logoSize: value })}
              headingSize={design.headingSize}
              setHeadingSize={(value) => onDesignChange({ headingSize: value })}
              bodyFontSize={design.bodyFontSize}
              setBodyFontSize={(value) => onDesignChange({ bodyFontSize: value })}
              signatureSize={design.signatureSize}
              setSignatureSize={(value) => onDesignChange({ signatureSize: value })}
              spacing={design.spacing}
              setSpacing={(value) => onDesignChange({ spacing: value })}
              colors={currentColors}
              onColorChange={(colorKey, value) =>
                  onDesignChange({
                    colors: { ...currentColors, [colorKey]: value },
                  })
                }
              onResetColors={() => onResetColors(design.theme)}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-primary-50/60 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-white shadow-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300/70 rounded-sm">
              <A4Preview
                theme={design.theme}
                candidate={previewCandidate || { name: "Preview Candidate", email: "candidate@email.com", position: advertisement?.jobTitle || "Position" }}
                organization={organization}
                advertisement={advertisement}
                colors={design.colors}
                brandingPreference={design.brandingPreference}
                logoSize={design.logoSize}
                headingSize={design.headingSize}
                bodyFontSize={design.bodyFontSize}
                signatureSize={design.signatureSize}
                spacing={design.spacing}
                formData={{ joiningDate: getTodayDateInput(), endingDate: "" }}
                signature={pendingSignature}
                customContent={null}
                maxScale={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
          <Save className="w-4 h-4" /> Done
        </button>
      </div>
    </div>
  );
}