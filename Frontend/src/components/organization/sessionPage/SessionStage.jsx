import React from "react";
import SessionVideoStage from "./SessionVideoStage";
import SessionInfoOverlay from "./SessionInfoOverlay";
import SelfViewTile from "./SelfViewTile";
import SessionControlBar from "./SessionControlBar";

/**
 * SessionStage
 * ---------------------------------------------------------------------------
 * Everything that sits over the video canvas: the featured participant (or
 * your screen share) as the background, the top-left title badge, the
 * top-right self-view tile, and the floating bottom control pill. Kept as
 * one composite so `SessionOverview` only has to think in terms of "the
 * stage" and "the side panel", matching the two-column layout of the
 * reference design.
 * ---------------------------------------------------------------------------
 */
export default function SessionStage({
  featuredParticipant,
  selfName,
  selfStream,
  isCameraMuted,
  screenStream,
  title,
  subtitle,
  duration,
  networkStatus,
  controlBarProps,
}) {
  return (
    <div className="flex-1 relative bg-slate-950 overflow-hidden">
      <SessionVideoStage participant={featuredParticipant} screenStream={screenStream} />
      <SessionInfoOverlay title={title} subtitle={subtitle} duration={duration} networkStatus={networkStatus} />
      <SelfViewTile name={selfName} stream={selfStream} isCameraMuted={isCameraMuted} />
      <SessionControlBar {...controlBarProps} />
    </div>
  );
}