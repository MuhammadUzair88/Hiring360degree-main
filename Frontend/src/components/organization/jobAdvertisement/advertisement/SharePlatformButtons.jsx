import React from "react";
import { sharePlatforms } from "./publishmodaldata";

/**
 * LinkedIn, Facebook, WhatsApp all open real share intents in a popup
 * window. Instagram has no such intent on any platform, so it's
 * handled as a special case via onInstagramShare instead of a URL.
 */
export default function SharePlatformButtons({ shareLinks, onInstagramShare }) {
  const handleClick = (key) => {
    if (key === "instagram") {
      onInstagramShare?.();
      return;
    }
    const url = shareLinks[key];
    if (url) window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <div className="flex flex-wrap gap-3">
      {sharePlatforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <button
            key={platform.key}
            type="button"
            onClick={() => handleClick(platform.key)}
            className="flex-1 min-w-[7rem] px-4 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center gap-2 text-gray-700 text-sm font-medium hover:outline-primary-800 hover:text-primary-800 transition-colors"
          >
            <Icon className="w-4 h-4" />
            {platform.label}
          </button>
        );
      })}
    </div>
  );
}