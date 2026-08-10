import React, { useState } from "react";
import { X, Download, Loader2, FileText, Printer } from "lucide-react";
import A4Preview from "./A4Preview";
import OfferLetterPreview from "./OfferLetterPreview";
import { exportNodeAsPng, downloadDataUrl, openImageForPrint } from "./offerDateUtils";

const CAPTURE_ID = "offer-letter-preview-capture";

export default function OfferLetterPreviewModal({
  isOpen,
  onClose,
  candidate,
  organization,
  advertisement,
  design,
  signature,
  offer,
}) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportNodeAsPng(CAPTURE_ID, { scale: 2 });
      downloadDataUrl(
        dataUrl,
        `${(candidate?.name || "offer-letter")
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase()}.png`
      );
    } catch (error) {
      console.warn("Offer letter export failed.", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportNodeAsPng(CAPTURE_ID, { scale: 2 });
      openImageForPrint(
        dataUrl,
        candidate?.name ? `Offer Letter — ${candidate.name}` : "Offer Letter"
      );
    } catch (error) {
      console.warn("Offer letter export failed.", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg max-h-[90vh] bg-secondary-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-secondary-300">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-primary-800/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-800" />
            </span>
            <div>
              <h3 className="text-slate-900 text-base font-semibold">Offer Letter</h3>
              {candidate?.name && (
                <p className="text-gray-500 text-xs">{candidate.name}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-secondary-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-secondary-100">
          <div className="w-full max-w-[380px] bg-white shadow-lg outline outline-1 outline-offset-[-1px] outline-secondary-300/70 rounded-sm">
            <A4Preview
              theme={design?.theme}
              candidate={candidate}
              organization={organization}
              advertisement={advertisement}
              colors={design?.colors}
              brandingPreference={design?.brandingPreference}
              logoSize={design?.logoSize}
              headingSize={design?.headingSize}
              bodyFontSize={design?.bodyFontSize}
              signatureSize={design?.signatureSize}
              spacing={design?.spacing}
              formData={{
                joiningDate: offer?.joiningDate || "",
                endingDate: offer?.endingDate || "",
              }}
              signature={signature}
              customContent={offer?.offerContent || null}
              maxScale={1}
            />
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-secondary-300 flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            disabled={isExporting}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 text-sm font-medium hover:outline-primary-800 hover:text-primary-800 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PNG
          </button>
        </div>
      </div>

      {/* Use an unscaled A4 source for high-quality download/print. */}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: 794,
          height: 1123,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          id={CAPTURE_ID}
          style={{ width: 794, height: 1123, background: "#fff" }}
        >
          <OfferLetterPreview
            theme={design?.theme}
            candidate={candidate}
            organization={organization}
            advertisement={advertisement}
            colors={design?.colors}
            brandingPreference={design?.brandingPreference}
            logoSize={design?.logoSize}
            headingSize={design?.headingSize}
            bodyFontSize={design?.bodyFontSize}
            signatureSize={design?.signatureSize}
            spacing={design?.spacing}
            formData={{
              joiningDate: offer?.joiningDate || "",
              endingDate: offer?.endingDate || "",
            }}
            signature={signature}
            customContent={offer?.offerContent || null}
          />
        </div>
      </div>
    </div>
  );
}
