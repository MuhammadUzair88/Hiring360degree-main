import React from "react";
import { Mic, MicOff, Camera, CameraOff, Monitor, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { PARTICIPANT_ROLE } from "./data";

/**
 * Single participant row: avatar, name, live mic/camera status, and - for
 * hosts managing a non-host participant - an expandable panel with
 * Allow/Block access controls plus quick Mute/Remove actions. Same
 * management capability as before, restyled into a compact row that
 * matches the reference design.
 */
export default function ParticipantCard({
  participant,
  isHost,
  isSelf,
  permissions,
  isExpanded,
  onToggleExpand,
  actionLoadingKey,
  onMute,
  onRemove,
  onGrantPermission,
  onRevokePermission,
}) {
  const { userId, name, role, publishedTracks = [] } = participant;
  const isCurrentHost = role === PARTICIPANT_ROLE.HOST;
  const canManage = isHost && !isCurrentHost;
  const hasAudio = publishedTracks.includes("audio");
  const hasVideo = publishedTracks.includes("video");
  const { isAudioAllowed, isVideoAllowed, isScreenAllowed } = permissions;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
              isCurrentHost ? "bg-primary-600" : "bg-primary-700"
            }`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-900 truncate">
              {name} {isSelf && "(You)"}
            </p>
            {isSelf ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                <span className="text-xs text-neutral-600">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasAudio ? (
                  <Mic size={12} className="text-success-500" />
                ) : (
                  <MicOff size={12} className="text-danger-400" />
                )}
                {hasVideo ? (
                  <Camera size={12} className="text-success-500" />
                ) : (
                  <CameraOff size={12} className="text-neutral-400" />
                )}
                <span className="text-xs text-neutral-600">
                  {hasAudio && hasVideo ? "Excellent" : hasAudio ? "Audio only" : "Connecting"}
                </span>
              </div>
            )}
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded hover:bg-secondary-200 text-neutral-600 hover:text-slate-900 transition-colors shrink-0"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {isExpanded && canManage && (
        <div className="mt-3 ml-[52px] p-3 rounded-lg bg-white border border-secondary-300">
          <div className="flex gap-2 pb-3 mb-1 border-b border-secondary-300">
            <button
              type="button"
              onClick={onMute}
              className="flex-1 text-xs font-semibold bg-secondary-200 hover:bg-secondary-300 text-slate-700 py-1.5 rounded transition-colors"
            >
              Mute Audio
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={actionLoadingKey === `remove-${userId}`}
              className="flex-1 text-xs font-semibold bg-danger-50 hover:bg-danger-100 text-danger-600 py-1.5 rounded transition-colors flex items-center justify-center"
            >
              {actionLoadingKey === `remove-${userId}` ? <Loader2 size={12} className="animate-spin" /> : "Remove"}
            </button>
          </div>

          <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-2 font-semibold">Access Controls</p>

          <PermissionToggle
            icon={<Mic size={14} />}
            label="Microphone"
            allowed={isAudioAllowed}
            onAllow={() => onGrantPermission(["send-audio"])}
            onBlock={() => onRevokePermission(["send-audio"])}
            disabled={!!actionLoadingKey}
          />
          <PermissionToggle
            icon={<Camera size={14} />}
            label="Camera"
            allowed={isVideoAllowed}
            onAllow={() => onGrantPermission(["send-video"])}
            onBlock={() => onRevokePermission(["send-video"])}
            disabled={!!actionLoadingKey}
          />
          <PermissionToggle
            icon={<Monitor size={14} />}
            label="Screen Share"
            allowed={isScreenAllowed}
            onAllow={() => onGrantPermission(["screenshare"])}
            onBlock={() => onRevokePermission(["screenshare"])}
            disabled={!!actionLoadingKey}
            isLast
          />
        </div>
      )}
    </div>
  );
}

function PermissionToggle({ icon, label, allowed, onAllow, onBlock, disabled, isLast }) {
  return (
    <div className={`flex items-center justify-between py-2 ${!isLast ? "border-b border-secondary-300" : ""}`}>
      <span className="text-xs font-medium text-slate-700 flex items-center gap-2">
        {icon} {label}
      </span>
      <div className="flex gap-1 bg-secondary-100 p-0.5 rounded border border-secondary-300">
        <button
          type="button"
          onClick={onAllow}
          disabled={disabled}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            allowed ? "bg-success-600 text-white" : "text-neutral-600 hover:text-slate-900 hover:bg-secondary-200"
          }`}
        >
          Allow
        </button>
        <button
          type="button"
          onClick={onBlock}
          disabled={disabled}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            !allowed ? "bg-danger-600 text-white" : "text-neutral-600 hover:text-slate-900 hover:bg-secondary-200"
          }`}
        >
          Block
        </button>
      </div>
    </div>
  );
}