import React, { useRef, useState, useLayoutEffect } from "react";
import OfferLetterPreview from "./OfferLetterPreview";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export default function A4Preview({
  className = "",
  maxScale = 1.15,
  ...previewProps
}) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const recalc = () => {
      const width = el.offsetWidth;
      if (width > 0) {
        setScale(Math.min(width / A4_WIDTH, maxScale));
        setIsReady(true);
      }
    };

    const timer = setTimeout(recalc, 50);

    const ro = new ResizeObserver(recalc);
    ro.observe(el);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [maxScale]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={{ aspectRatio: `${A4_WIDTH} / ${A4_HEIGHT}`, minHeight: "400px" }}
    >
      {isReady ? (
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          <OfferLetterPreview {...previewProps} />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-gray-400 text-sm">Loading preview...</div>
        </div>
      )}
    </div>
  );
}