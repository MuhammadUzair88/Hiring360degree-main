import React from "react";
import {
  ParticipantView,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";

function EmptyParticipantViewUI() {
  return null;
}

function StreamSelfPlaceholder({ style }) {
  const { participant } = useParticipantViewContext();
  const name = participant?.name || participant?.userId || "You";

  return (
    <div
      style={style}
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
    >
      <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center text-white text-lg font-semibold">
        {name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

function LocalSelfPlaceholder({ name }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
      <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center text-white text-lg font-semibold">
        {(name || "Y").charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

/**
 * Floating local preview. The Stream participant is rendered only while a
 * local participant exists and the camera is enabled; otherwise the stable
 * Hiring360 placeholder is shown.
 */
export default function SelfViewTile({ name, participant, isCameraMuted }) {
  return (
    <div className="absolute right-6 top-6 z-10 w-48 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800">
      <div className="h-28 relative bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        {participant && !isCameraMuted ? (
          <ParticipantView
            participant={participant}
            ParticipantViewUI={EmptyParticipantViewUI}
            VideoPlaceholder={StreamSelfPlaceholder}
            mirror
            className="w-full h-full session-stream-participant session-stream-self-view"
          />
        ) : (
          <LocalSelfPlaceholder name={name} />
        )}
      </div>

      <span className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-xs">
        You ({name || "Participant"})
      </span>
    </div>
  );
}
