import React from "react";
import ParticipantCard from "./ParticipantCard";
import Hiring360Logo from "./Hiring360Logo";
import { PARTICIPANT_ROLE } from "./data";

/**
 * Roster grouped into Host / Candidate / AI Assistant sections with
 * uppercase labels, matching the reference design. The AI Assistant row is
 * purely informational (no mute/remove - it isn't a real call participant).
 */
export default function ParticipantsPanel({
  participants,
  currentUserId,
  isHost,
  expandedId,
  onToggleExpand,
  localPermissions,
  actionLoadingKey,
  onMute,
  onRemove,
  onGrantPermission,
  onRevokePermission,
  aiAssistant,
}) {
  const host = participants.find((p) => p.role === PARTICIPANT_ROLE.HOST);
  const guests = participants.filter((p) => p.role !== PARTICIPANT_ROLE.HOST);

  const renderCard = (participant) => {
    const { userId } = participant;
    const perms = localPermissions[userId] || {};

    return (
      <ParticipantCard
        key={userId}
        participant={participant}
        isHost={isHost}
        isSelf={userId === currentUserId}
        isExpanded={expandedId === userId}
        onToggleExpand={() => onToggleExpand(userId)}
        actionLoadingKey={actionLoadingKey}
        permissions={{
          isAudioAllowed: perms["send-audio"] !== "blocked",
          isVideoAllowed: perms["send-video"] !== "blocked",
          isScreenAllowed: perms["screenshare"] !== "blocked",
        }}
        onMute={() => onMute(participant)}
        onRemove={() => onRemove(participant)}
        onGrantPermission={(perm) => onGrantPermission(participant, perm)}
        onRevokePermission={(perm) => onRevokePermission(participant, perm)}
      />
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
      {host && (
        <Section label="Host">{renderCard(host)}</Section>
      )}

      {guests.length > 0 && (
        <Section label={guests.length > 1 ? "Candidates" : "Candidate"} bordered>
          <div className="space-y-4">{guests.map(renderCard)}</div>
        </Section>
      )}

      {aiAssistant && (
        <Section label="AI Assistant" bordered>
          <AiAssistantRow assistant={aiAssistant} />
        </Section>
      )}

      {participants.length === 0 && (
        <p className="text-sm text-neutral-600 text-center py-8">No participants</p>
      )}
    </div>
  );
}

function Section({ label, bordered, children }) {
  return (
    <div className={`flex flex-col gap-4 ${bordered ? "pt-4 border-t border-secondary-300" : ""}`}>
      <p className="text-xs text-neutral-600 uppercase tracking-wide opacity-60">{label}</p>
      {children}
    </div>
  );
}

function AiAssistantRow({ assistant }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-primary-700/5 ring-1 ring-primary-700/10">
      <div className="flex items-center gap-3">
        {/* <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
          <Hiring360Logo size={18} className="text-white" />
        </div> */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-700 truncate">{assistant.name}</p>
          <p className="text-xs text-primary-700/70">{assistant.status}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
        <span className="w-1 h-3 rounded-full bg-primary-700/40 animate-pulse" />
        <span className="w-1 h-3 rounded-full bg-primary-700/40 animate-pulse [animation-delay:150ms]" />
        <span className="w-1 h-3 rounded-full bg-primary-700/40 animate-pulse [animation-delay:300ms]" />
      </div>
    </div>
  );
}