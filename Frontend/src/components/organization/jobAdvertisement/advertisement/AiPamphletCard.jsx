import React, { useLayoutEffect, useRef, useState } from "react";
import { Zap, Loader2, Pencil } from "lucide-react";
import JobPamphletPreview from "../advertisement/JobPamphletPreview";
import { useAuth } from "../../../../context/AuthContext";

/**
 * "AI Assistant" sidebar card.
 *
 * - Idle: "Generate Pamphlet" button.
 * - Generating: same button, spinner + "Generating...".
 * - Generated: a live, scaled-down thumbnail of the actual pamphlet
 *   (same theme/colors/branding as the real one, rendered with the
 *   same JobPamphletPreview component the big preview card uses) plus
 *   a "Customize Design" button. Clicking either the thumbnail or
 *   that button calls onEdit, which reopens the pamphlet screen.
 */
export default function AIPamphletCard({
  isGenerating = false,
  isGenerated = false,
  onGenerate = () => {},
  onEdit = () => {},
  title = "Visual Pamphlet",
  description = "Generate a visual poster. After publishing, you can download it as an image to attach to your LinkedIn posts or share directly with candidates.",
  formData,
  pamphletSettings,
}) {
  const thumbnailRef = useRef(null);
  const [scale, setScale] = useState(0.24);
  const {organization} = useAuth()
  useLayoutEffect(() => {
    if (!isGenerated) return;
    function updateScale() {
      if (!thumbnailRef.current) return;
      setScale(thumbnailRef.current.offsetWidth / 1200);
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isGenerated]);

  const { theme, branding, logoSize, headingSize, colors } = pamphletSettings || {};
  const currentColors = colors?.[theme] || {};

  return (
    <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
      <span className="inline-flex items-center gap-1.5 text-primary-800 text-xs font-bold uppercase leading-4 tracking-wide">
        <Zap className="w-3.5 h-3.5" />
        AI Assistant
      </span>

      {isGenerated ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-slate-900 text-base font-semibold leading-6">Pamphlet Preview</h3>

          <div
            ref={thumbnailRef}
            onClick={onEdit}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onEdit();
            }}
            className="relative w-full pb-[52.5%] rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] outline-secondary-300 hover:outline-primary-800 transition-colors cursor-pointer group bg-white"
          >
            <div
              className="absolute top-0 left-0 origin-top-left shrink-0 pointer-events-none"
              style={{ width: "1200px", height: "630px", transform: `scale(${scale})` }}
            >
              <JobPamphletPreview
                theme={theme}
                job={formData}
                colors={currentColors}
                branding={branding}
                logoSize={logoSize}
                headingSize={headingSize}
                organizationName={organization.name}
              organizationLogoUrl={organization.logo}
              />
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                Click to Edit
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Customize Design
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-slate-900 text-base font-semibold leading-6">{title}</h3>
            <p className="text-gray-700 text-sm leading-5">{description}</p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Pamphlet
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}