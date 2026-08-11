
import React from "react";
import SessionVideoStage from "./SessionVideoStage";
import SessionInfoOverlay from "./SessionInfoOverlay";
import SelfViewTile from "./SelfViewTile";
import SessionControlBar from "./SessionControlBar";

/**
 * Main interview media stage.
 * `min-w-0` / `min-h-0` are important because this component sits beside
 * the fixed-width participants/chat panel inside a flex row. Without them,
 * the Stream video element can keep its intrinsic width and get clipped.
 */
export default function SessionStage({
  featuredParticipant,
  selfParticipant,
  selfName,
  isCameraMuted,
  screenShareParticipant,
  title,
  subtitle,
  duration,
  networkStatus,
  controlBarProps,
}) {
  return (
    <div className="flex-1 min-w-0 min-h-0 relative bg-slate-950 overflow-hidden">
      <SessionVideoStage
        participant={featuredParticipant}
        screenShareParticipant={screenShareParticipant}
      />

      <SessionInfoOverlay
        title={title}
        subtitle={subtitle}
        duration={duration}
        networkStatus={networkStatus}
      />

      <SelfViewTile
        name={selfName}
        participant={selfParticipant}
        isCameraMuted={isCameraMuted}
      />

      <SessionControlBar {...controlBarProps} />
    </div>
  );
}
