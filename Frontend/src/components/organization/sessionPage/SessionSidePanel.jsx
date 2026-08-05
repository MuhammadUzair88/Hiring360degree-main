import React from "react";
import { SESSION_PANEL } from "./data";

/**
 * Right-hand panel shell - always docked (no close/hide, matching the
 * reference design), with Participants/Chat as tabs. Tab switching is
 * driven from here or from the matching icons in the floating control bar.
 */
export default function SessionSidePanel({ activeTab, onSelectTab, participantCount, unreadCount, children }) {
  return (
    <aside className="w-80 shrink-0 border-l border-secondary-300 bg-secondary-50 flex flex-col">
      <div className="flex border-b border-secondary-300">
        <TabButton
          active={activeTab === SESSION_PANEL.PARTICIPANTS}
          onClick={() => onSelectTab(SESSION_PANEL.PARTICIPANTS)}
        >
          Participants ({participantCount})
        </TabButton>
        <TabButton active={activeTab === SESSION_PANEL.CHAT} onClick={() => onSelectTab(SESSION_PANEL.CHAT)} badge={unreadCount}>
          Chat
        </TabButton>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </aside>
  );
}

function TabButton({ active, onClick, children, badge = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-4 text-sm text-center border-b-2 transition-colors ${
        active ? "border-primary-700 text-primary-700 font-semibold" : "border-transparent text-neutral-600 hover:text-slate-900"
      }`}
    >
      {children}
      {badge > 0 && !active && (
        <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-danger-600 text-white text-[10px] font-semibold align-middle">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}