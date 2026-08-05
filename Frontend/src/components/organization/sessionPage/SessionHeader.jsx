import React from "react";
import { Users, MessageSquare } from "lucide-react";
import { SESSION_PANEL, NETWORK_STATUS } from "./data";

/**
 * Top status bar for the live session screen.
 * Same information as the original header: connection dot, round name,
 * participant count, and the two panel toggles (Participants / Chat with
 * an unread badge) - only the visual treatment has changed.
 */
export default function SessionHeader({
  roundName,
  participantCount,
  networkStatus,
  activePanel,
  unreadCount,
  onToggleParticipants,
  onToggleChat,
}) {
  const isStable = networkStatus === NETWORK_STATUS.STABLE;

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isStable ? "bg-success-500 animate-pulse" : "bg-danger-500"
            }`}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-white truncate">
            {roundName || "Interview Session"}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
          <Users size={14} />
          <span>{participantCount} in call</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleParticipants}
          aria-pressed={activePanel === SESSION_PANEL.PARTICIPANTS}
          title="Participants"
          className={`p-2 rounded-lg transition-colors ${
            activePanel === SESSION_PANEL.PARTICIPANTS
              ? "bg-primary-700 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Users size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleChat}
          aria-pressed={activePanel === SESSION_PANEL.CHAT}
          title="Chat"
          className={`relative p-2 rounded-lg transition-colors ${
            activePanel === SESSION_PANEL.CHAT
              ? "bg-primary-700 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <MessageSquare size={18} />
          {unreadCount > 0 && activePanel !== SESSION_PANEL.CHAT && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-danger-600 text-white text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}