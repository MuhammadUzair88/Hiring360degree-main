import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Users,
  MessageSquare,
  MoreHorizontal,
  PhoneOff,
} from "lucide-react";
import { SESSION_PANEL } from "./data";

/**
 * Floating bottom control pill: mic, camera, screen share, participants,
 * chat, more, and a two-line "Leave Session" button - same icon set, order,
 * and glass styling as the reference design.
 *
 * The old "End Session" (host-only) button now lives inside the "More"
 * menu rather than as its own pill, since the reference design only shows
 * a single leave action in the bar - the underlying capability is
 * unchanged, just relocated.
 */
export default function SessionControlBar({
  isMicMuted,
  onToggleMic,
  isCameraMuted,
  onToggleCamera,
  isScreenSharing,
  onToggleScreenShare,
  activeTab,
  onSelectTab,
  unreadCount,
  isHost,
  onRequestEndSession,
  onReportIssue,
  onRequestLeave,
}) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-10">
      <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-slate-900/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
        <PillButton onClick={onToggleMic} label={isMicMuted ? "Unmute microphone" : "Mute microphone"}>
          {isMicMuted ? <MicOff size={20} className="text-danger-400" /> : <Mic size={20} className="text-white" />}
        </PillButton>

        <PillButton onClick={onToggleCamera} label={isCameraMuted ? "Start camera" : "Stop camera"}>
          {isCameraMuted ? (
            <CameraOff size={20} className="text-danger-400" />
          ) : (
            <Camera size={20} className="text-white" />
          )}
        </PillButton>

        <Divider />

        <PillButton onClick={onToggleScreenShare} label="Share screen" highlighted={isScreenSharing}>
          <Monitor size={20} className="text-white" />
        </PillButton>

        <PillButton
          onClick={() => onSelectTab(SESSION_PANEL.PARTICIPANTS)}
          label="Participants"
          dot={activeTab === SESSION_PANEL.PARTICIPANTS}
        >
          <Users size={20} className="text-white" />
        </PillButton>

        <PillButton
          onClick={() => onSelectTab(SESSION_PANEL.CHAT)}
          label="Chat"
          dot={activeTab === SESSION_PANEL.CHAT}
          badge={activeTab !== SESSION_PANEL.CHAT ? unreadCount : 0}
        >
          <MessageSquare size={20} className="text-white" />
        </PillButton>

        <div className="relative">
          <PillButton onClick={() => setIsMoreMenuOpen((prev) => !prev)} label="More options">
            <MoreHorizontal size={20} className="text-white" />
          </PillButton>

          {isMoreMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMoreMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute bottom-full right-0 mb-3 w-56 rounded-xl bg-white shadow-xl border border-secondary-300 py-2 z-20">
                {isHost && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onRequestEndSession();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    End session for everyone
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onReportIssue();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-secondary-100 transition-colors"
                >
                  Report a problem
                </button>
              </div>
            </>
          )}
        </div>

        <Divider />

        <button
          type="button"
          onClick={onRequestLeave}
          title="Leave interview"
          className="h-12 pl-6 pr-8 rounded-full bg-danger-700 hover:opacity-90 transition-opacity flex items-center gap-3 text-white"
        >
          <PhoneOff size={18} />
          <span className="text-sm font-medium leading-tight text-left">
            Leave
            <br />
            Session
          </span>
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-8 bg-white/10" aria-hidden="true" />;
}

function PillButton({ children, onClick, label, dot, badge = 0, highlighted }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`relative w-11 h-12 rounded-full flex items-center justify-center transition-colors ${
        highlighted ? "bg-primary-700" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {children}
      {dot && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-400" aria-hidden="true" />}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-600 text-white text-[10px] font-semibold flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}