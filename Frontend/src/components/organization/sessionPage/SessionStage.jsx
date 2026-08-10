import React from "react";
import SessionVideoStage from "./SessionVideoStage";
import SessionInfoOverlay from "./SessionInfoOverlay";
import SelfViewTile from "./SelfViewTile";
import SessionControlBar from "./SessionControlBar";

/**
 * Existing stage composition. Stream participants are passed into the same
 * visual slots that previously displayed browser-local placeholder streams.
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
    <div className="flex-1 relative bg-slate-950 overflow-hidden">
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
