import React from "react";
import { Briefcase } from "lucide-react";
import { NETWORK_STATUS } from "./data";

/**
 * Floating title badge over the top-left of the video stage: connection
 * dot, interview title, round name, and elapsed duration. Same information
 * the old docked header showed (round name + connection state) - just
 * positioned to match the reference design instead of living in a bar.
 */
export default function SessionInfoOverlay({ title, subtitle, duration, networkStatus }) {
  const isStable = networkStatus === NETWORK_STATUS.STABLE;

  return (
    <div className="absolute left-6 top-6 z-10 flex flex-col gap-1.5 max-w-[60%]">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${isStable ? "bg-success-500 animate-pulse" : "bg-danger-500"}`}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-white truncate">{title}</span>
      </div>

      <div className="flex items-center gap-3 pl-[18px]">
        <div className="flex items-center gap-1.5 text-white/70 text-xs">
          <Briefcase size={13} />
          <span className="truncate">{subtitle}</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
        <span className="text-white/70 text-xs shrink-0">{duration}</span>
      </div>
    </div>
  );
}