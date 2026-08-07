import React, { useEffect, useRef } from "react";
import { VideoOff, MicOff, ScreenShare } from "lucide-react";

/**
 * Full-bleed video background. Shows your real screen-share capture when
 * you're presenting; otherwise shows the featured (non-self) participant.
 * Swap the participant branch for Stream's <SpeakerLayout /> once a real
 * call is connected - the overlays around it (title, self view, controls)
 * don't need to change.
 */
export default function SessionVideoStage({ participant, screenStream }) {
  const screenVideoRef = useRef(null);

  useEffect(() => {
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream || null;
    }
  }, [screenStream]);

  if (screenStream) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <video ref={screenVideoRef} autoPlay playsInline muted className="max-w-full max-h-full" />
        <span className="absolute left-6 bottom-28 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
          <ScreenShare size={12} />
          You are presenting your screen
        </span>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
        Waiting for others to join...
      </div>
    );
  }

  const hasVideo = participant.publishedTracks.includes("video");
  const hasAudio = participant.publishedTracks.includes("audio");

  return (
    <div className="absolute inset-0">
      {hasVideo ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
          <div className="w-32 h-32 rounded-full bg-primary-700 flex items-center justify-center text-4xl font-semibold text-white">
            {participant.name.charAt(0).toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-950 text-slate-500">
          <VideoOff size={40} />
          <span className="text-sm">Camera is off</span>
        </div>
      )}

      {!hasAudio && (
        <span className="absolute left-6 bottom-28 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
          <MicOff size={12} className="text-danger-400" />
          {participant.name} is muted
        </span>
      )}
    </div>
  );
}