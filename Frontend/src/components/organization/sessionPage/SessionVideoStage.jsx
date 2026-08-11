

import React from "react";
import {
  ParticipantView,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { VideoOff, MicOff, ScreenShare } from "lucide-react";
import "./sessionScreenShare.css";

function EmptyParticipantViewUI() {
  return null;
}

function ParticipantVideoPlaceholder({ style }) {
  const { participant } = useParticipantViewContext();
  const name = participant?.name || participant?.userId || "Participant";

  return (
    <div
      style={style}
      className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-800 to-slate-950"
    >
      <div className="w-32 h-32 rounded-full bg-primary-700 flex items-center justify-center text-4xl font-semibold text-white">
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <VideoOff size={16} />
        Camera is off
      </div>
    </div>
  );
}

function ScreenShareVideoPlaceholder({ style }) {
  return (
    <div
      style={style}
      className="w-full h-full flex items-center justify-center bg-black text-slate-400 text-sm"
    >
      Preparing shared screen...
    </div>
  );
}

/**
 * Screen share must use CONTAIN, not COVER.
 * Camera video can remain full-bleed, while shared desktop content must keep
 * its complete aspect ratio so the browser does not crop the left/right or
 * top/bottom edges.
 */
export default function SessionVideoStage({
  participant,
  screenShareParticipant,
}) {
  if (screenShareParticipant) {
    const presenterName =
      screenShareParticipant.name ||
      screenShareParticipant.userId ||
      "Participant";

    return (
      <div className="session-screen-share-stage absolute inset-0 min-w-0 min-h-0 overflow-hidden bg-black flex items-center justify-center">
        <ParticipantView
          participant={screenShareParticipant}
          trackType="screenShareTrack"
          mirror={false}
          ParticipantViewUI={EmptyParticipantViewUI}
          VideoPlaceholder={ScreenShareVideoPlaceholder}
          className="session-stream-participant session-stream-screen-share w-full h-full min-w-0 min-h-0"
        />

        <span className="absolute left-6 bottom-28 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs pointer-events-none">
          <ScreenShare size={12} />
          {screenShareParticipant.isLocalParticipant
            ? "You are presenting your screen"
            : `${presenterName} is presenting their screen`}
        </span>
      </div>
    );
  }

  if (!participant?.streamParticipant) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
        Waiting for others to join...
      </div>
    );
  }

  const publishedTracks = Array.isArray(participant.publishedTracks)
    ? participant.publishedTracks
    : [];
  const hasAudioTrack = publishedTracks.includes("audio");

  return (
    <div className="absolute inset-0 min-w-0 min-h-0 overflow-hidden">
      <ParticipantView
        participant={participant.streamParticipant}
        ParticipantViewUI={EmptyParticipantViewUI}
        VideoPlaceholder={ParticipantVideoPlaceholder}
        className="w-full h-full min-w-0 min-h-0 session-stream-participant"
      />

      {!hasAudioTrack && (
        <span className="absolute left-6 bottom-28 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
          <MicOff size={12} className="text-danger-400" />
          {participant.name || "Participant"} is muted
        </span>
      )}
    </div>
  );
}
