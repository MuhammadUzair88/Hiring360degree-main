
import React, { useLayoutEffect, useRef, useState } from "react";
import { Eye, Maximize2, Download } from "lucide-react";
import JobPamphletPreview from "./JobPamphletPreview";

/**
 * The pamphlet card — the white "Live Preview Rendering" panel that
 * shows the artwork for whichever theme is selected.
 */
export default function PamphletPreviewPanel({
  theme,
  job,
  colors,
  branding,
  logoSize,
  headingSize,
  organizationName,
  organizationLogoUrl,
  onFullscreen,
  onExport,
  captureId = "pamphlet-capture",
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useLayoutEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.offsetWidth - 48;
      setScale(Math.max(Math.min(availableWidth / 1200, 0.55), 0.2));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="relative p-8 lg:p-10 bg-primary-50/60 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="w-96 h-96 -right-24 -top-48 absolute bg-primary-800 rounded-full blur-3xl" />
        <div className="w-96 h-96 -left-48 bottom-0 absolute bg-primary-800 rounded-full blur-3xl" />
      </div>

      {/* <div className="relative w-full flex flex-col items-center bg-red-900"> */}
        {/* <div className="self-start pb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 text-sm font-medium">Live Preview Rendering</span>
        </div> */}

      
          <div
            id={captureId}
            className="origin-center shrink-0"
            style={{ width: "1200px", height: "630px", transform: `scale(${scale})` }}
          >
            <JobPamphletPreview
              theme={theme}
              job={job}
              colors={colors}
              branding={branding}
              logoSize={logoSize}
              headingSize={headingSize}
              organizationName={organizationName}
              organizationLogoUrl={organizationLogoUrl}
            />
          </div>
        

        {/* <div className="pt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onFullscreen}
            className="px-5 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-2 text-gray-700 text-sm font-medium hover:outline-primary-800 hover:text-primary-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Fullscreen
          </button>
          <button
            type="button"
            onClick={onExport}
            className="px-5 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-2 text-gray-700 text-sm font-medium hover:outline-primary-800 hover:text-primary-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
}