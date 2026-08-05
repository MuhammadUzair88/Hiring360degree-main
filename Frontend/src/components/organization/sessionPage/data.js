/**
 * data.js
 * ---------------------------------------------------------------------------
 * Demo / mock data for the Session (live interview) experience.
 *
 * Every export here shapes exactly what <SessionOverview /> and its children
 * expect as props. Once this feature is wired to a real Stream call, the
 * live call data replaces these values one-for-one - no component in this
 * folder needs to change.
 * ---------------------------------------------------------------------------
 */

// Roles a participant can hold inside a session.
export const PARTICIPANT_ROLE = {
  HOST: "host",
  GUEST: "user",
};

// Network/connection indicator states used by <SessionInfoOverlay />.
export const NETWORK_STATUS = {
  STABLE: "stable",
  DISCONNECTED: "disconnected",
};

// Which tab is active in the always-visible right-hand panel.
export const SESSION_PANEL = {
  PARTICIPANTS: "participants",
  CHAT: "chat",
};

/** Stand-in for the logged-in user before a real call connects. */
export const DEMO_USER_DATA = {
  id: "interviewer_demo_001",
  name: "Sarah Jenkins",
  role: "interviewer", // "interviewer" | "candidate"
};

/** Stand-in for the round/session metadata normally read from the call's custom data. */
export const DEMO_SESSION_INFO = {
  roundName: "Senior Frontend Engineer",
  callId: "interview_demo_1234567",
};

/**
 * Stand-in participant roster, shaped exactly like the normalized objects
 * `SessionOverview` builds from raw Stream participants.
 */
export const DEMO_PARTICIPANTS = [
  {
    userId: "interviewer_demo_001",
    name: "Sarah Jenkins",
    role: PARTICIPANT_ROLE.HOST,
    publishedTracks: ["audio", "video"],
  },
  {
    userId: "candidate_demo_002",
    name: "Marcus Chen",
    role: PARTICIPANT_ROLE.GUEST,
    publishedTracks: ["audio", "video"],
  },
];

/** Stand-in chat transcript - always starts with the same system welcome message as the live call. */
export const DEMO_CHAT_MESSAGES = [
  {
    id: 1,
    text: "Welcome to the interview!",
    sender: "System",
    timestamp: new Date().toLocaleTimeString(),
    isSystem: true,
  },
];

/** Stand-in for the AI notetaker/transcription assistant shown in the roster. Purely informational - not manageable like a real participant. */
export const DEMO_AI_ASSISTANT = {
  name: "Hiring360 AI",
  status: "Transcribing...",
};