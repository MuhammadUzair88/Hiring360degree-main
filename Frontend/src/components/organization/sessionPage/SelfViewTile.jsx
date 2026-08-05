import React, { useEffect, useRef } from "react";

/**
 * Small floating "self view" tile, top-right of the video stage. Plays your
 * real camera stream (mirrored, like a mirror/selfie view) when one is
 * available and the camera isn't muted; otherwise falls back to an
 * initials avatar - e.g. while permission is still pending, was denied, or
 * you've turned your camera off.
 */
export default function SelfViewTile({ name, stream, isCameraMuted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  const showVideo = !!stream && !isCameraMuted;

  return (
    <div className="absolute right-6 top-6 z-10 w-48 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800">
      <div className="h-28 relative bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        {/* Always mounted so the stream attaches instantly the moment it's ready; just hidden until then. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover -scale-x-100 ${showVideo ? "block" : "hidden"}`}
        />
        {!showVideo && (
          <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center text-white text-lg font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-xs">
        You ({name})
      </span>
    </div>
  );
}