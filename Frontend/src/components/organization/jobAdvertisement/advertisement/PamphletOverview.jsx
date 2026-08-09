import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import PamphletThemeSelector from "./PamphletThemeSelector";
import PamphletColorPalette from "./PamphletColorPalette";
import PamphletSizeSlider from "./PamphletSizeSlider";
import PamphletPreviewPanel from "./PamphletPreviewPanel";
import PamphletActionsFooter from "./PamphletActionsFooter";
import JobPamphletPreview from "./JobPamphletPreview";
import SegmentedOptionControl from "./SegmentedOptionControl";
import { pamphletHeader, pamphletBrandingOptions } from "./pamphletdata";
import { exportNodeAsPng, openImageForPrint } from "./Pamphletutils";
import { useAuth } from "../../../../context/AuthContext";

const CAPTURE_ID = "pamphlet-capture";

export default function PamphletOverview({
  formData,
  pamphletSettings,
  setPamphletTheme,
  setPamphletBranding,
  setPamphletLogoSize,
  setPamphletHeadingSize,
  handlePamphletColorChange,
  resetPamphletTheme,
  onBack,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { organization } = useAuth();

  const { theme, branding, logoSize, headingSize, colors } = pamphletSettings;
  const currentColors = colors?.[theme] || {};

  const handleGenerateNew = () => {
    resetPamphletTheme(theme);
    setPamphletLogoSize(100);
    setPamphletHeadingSize(100);
    setPamphletBranding("logo-name");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportNodeAsPng(CAPTURE_ID);
      openImageForPrint(dataUrl, formData?.jobTitle || "Job Pamphlet");
    } catch (error) {
      console.warn("Pamphlet export failed.", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-slate-900 text-2xl sm:text-3xl font-semibold leading-tight">
          {pamphletHeader.title}
        </h1>
        <p className="text-gray-700 text-base leading-6">
          {pamphletHeader.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT — controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">
              Select Theme
            </span>
            <PamphletThemeSelector value={theme} onChange={setPamphletTheme} />
          </div>

          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">
              Branding Display
            </span>
            <SegmentedOptionControl
              name="branding"
              options={pamphletBrandingOptions}
              value={branding}
              onChange={setPamphletBranding}
            />
          </div>

          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5">
            {(branding === "logo-only" || branding === "logo-name") && (
              <PamphletSizeSlider
                label="Logo Size"
                value={logoSize}
                onChange={setPamphletLogoSize}
                basePx={56}
              />
            )}
            <PamphletSizeSlider
              label="Heading Size"
              value={headingSize}
              onChange={setPamphletHeadingSize}
              basePx={48}
            />
          </div>

          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">
              Theme Palette
            </span>
            <PamphletColorPalette
              colors={currentColors}
              onChange={(colorKey, value) =>
                handlePamphletColorChange(theme, colorKey, value)
              }
            />
          </div>
        </div>

        {/* RIGHT — live preview + actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PamphletActionsFooter
            onBack={onBack}
            onGenerateNew={handleGenerateNew}
            onConfirm={onBack}
          />
          <PamphletPreviewPanel
            theme={theme}
            job={formData}
            colors={currentColors}
            branding={branding}
            logoSize={logoSize}
            headingSize={headingSize}
            onFullscreen={() => setIsFullscreen(true)}
            onExport={handleExport}
            captureId={CAPTURE_ID}
            organizationName={organization.name}
            organizationLogoUrl={organization.logo}
          />
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Pamphlet fullscreen preview"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="max-w-full max-h-full overflow-auto rounded-xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
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
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-slate-900 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-primary-800" />
            Preparing export…
          </div>
        </div>
      )}
    </div>
  );
}
