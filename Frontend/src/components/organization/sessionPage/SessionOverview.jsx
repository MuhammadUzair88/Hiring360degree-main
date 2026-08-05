import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PARTICIPANT_ROLE,
  SESSION_PANEL,
  NETWORK_STATUS,
  DEMO_USER_DATA,
  DEMO_SESSION_INFO,
  DEMO_PARTICIPANTS,
  DEMO_CHAT_MESSAGES,
  DEMO_AI_ASSISTANT,
} from "./data";

import SessionStage from "./SessionStage";
import SessionSidePanel from "./SessionSidePanel";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import ToastNotification from "./ToastNotification";
import LeaveSessionModal from "./LeaveSessionModal";
import EndSessionModal from "./EndSessionModal";

const TRACK_BY_PERMISSION = {
  "send-audio": "audio",
  "send-video": "video",
};

/**
 * SessionOverview
 * ---------------------------------------------------------------------------
 * The full in-call experience: video stage, floating controls, and an
 * always-docked Participants/Chat panel - laid out to match the reference
 * design.
 *
 * Two layers of "real" live here side by side:
 *
 *   1. Your own camera/microphone/screen share are wired to the browser's
 *      real media APIs (`getUserMedia` / `getDisplayMedia`) - this needs no
 *      backend at all, so your own preview, mute state, and screen share
 *      genuinely work right now.
 *   2. Everything else (the roster, chat, permissions, ending the session)
 *      runs on local dummy state seeded from `data.js`, because actually
 *      sending/receiving audio, video, and messages to another participant
 *      requires a real-time backend (the Stream Video call this used to be
 *      wired to). That part comes back once the API/Stream integration is
 *      reconnected in `src/pages/SessionPage.jsx` - nothing in this
 *      component needs to change to support that, since it already accepts
 *      real data as props.
 * ---------------------------------------------------------------------------
 */
export default function SessionOverview({
  userData = DEMO_USER_DATA,
  sessionInfo = DEMO_SESSION_INFO,
  networkStatus = NETWORK_STATUS.STABLE,
  initialParticipants = DEMO_PARTICIPANTS,
  initialChatMessages = DEMO_CHAT_MESSAGES,
  aiAssistant = DEMO_AI_ASSISTANT,
}) {
  const navigate = useNavigate();
  const isHost = userData.role === "interviewer";

  // ---- panel / modal / toast UI state --------------------------------------
  const [activePanel, setActivePanel] = useState(SESSION_PANEL.PARTICIPANTS);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);
  const [endSessionConfirmation, setEndSessionConfirmation] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // ---- self media: real browser camera / microphone / screen share ----------
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Ask for camera + mic once, on entering the session - exactly like a real
  // call would. No backend involved: this is the browser talking directly
  // to the device.
  useEffect(() => {
    let cancelled = false;

    async function startLocalMedia() {
      if (!navigator.mediaDevices?.getUserMedia) {
        showToast("This browser can't access your camera or microphone.");
        setIsCameraMuted(true);
        setIsMicMuted(true);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error("Could not access camera/microphone:", err);
        showToast("Camera and microphone access was blocked. You can still preview the session.");
        setIsCameraMuted(true);
        setIsMicMuted(true);
      }
    }

    startLocalMedia();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [showToast]);

  // ---- roster + chat, seeded straight from data.js --------------------------
  const [participants, setParticipants] = useState(initialParticipants);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [unreadCount, setUnreadCount] = useState(0);

  // ---- host participant-management state -------------------------------------
  const [expandedParticipantId, setExpandedParticipantId] = useState(null);
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const [localPermissions, setLocalPermissions] = useState({});

  // ---- elapsed call duration, shown in the title overlay ----------------------
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const simulateDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

  // ---- handlers: chat ---------------------------------------------------------
  const handleSendMessage = (text) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: userData.name,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: false,
      },
    ]);
  };

  // ---- handlers: side panel tab selection (unread badge clears on chat open) --
  const handleSelectTab = (tab) => {
    setActivePanel(tab);
    if (tab === SESSION_PANEL.CHAT) setUnreadCount(0);
  };

  // ---- handlers: self media controls (real tracks, not just booleans) ---------
  const handleToggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) {
      setIsMicMuted((prev) => !prev);
      return;
    }
    audioTrack.enabled = !audioTrack.enabled;
    setIsMicMuted(!audioTrack.enabled);
  };

  const handleToggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) {
      setIsCameraMuted((prev) => !prev);
      return;
    }
    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraMuted(!videoTrack.enabled);
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast("Screen sharing isn't supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);

      // The browser's own "Stop sharing" control ends the track directly -
      // listen for that so our state stays in sync.
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        screenStreamRef.current = null;
        setScreenStream(null);
        setIsScreenSharing(false);
      });
    } catch (err) {
      // Cancelling the browser's share picker also lands here - not a real error.
      console.info("Screen share was not started:", err.message);
    }
  };

  // ---- handlers: end session (host) / leave / report --------------------------
  const handleEndSession = async () => {
    setIsEndingSession(true);
    showToast("Session ending...");
    await simulateDelay(800);
    navigate("/");
  };

  const handleLeave = () => {
    navigate("/");
  };

  const handleReportIssue = () => {
    showToast("Thanks - this has been noted.");
  };

  // ---- handlers: participant management (host only) ----------------------------
  const applyLocalPermissions = (userId, permissions, status) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...permissions.reduce((acc, p) => ({ ...acc, [p]: status }), {}),
      },
    }));
  };

  const removeParticipantTracks = (userId, permissions) => {
    const tracksToRemove = permissions.map((perm) => TRACK_BY_PERMISSION[perm]).filter(Boolean);
    if (tracksToRemove.length === 0) return;

    setParticipants((prev) =>
      prev.map((p) =>
        p.userId === userId
          ? { ...p, publishedTracks: p.publishedTracks.filter((t) => !tracksToRemove.includes(t)) }
          : p,
      ),
    );
  };

  const handleGrantPermissions = async (participant, permissions) => {
    const { userId } = participant;
    setActionLoadingKey(`grant-${userId}`);
    await simulateDelay();
    applyLocalPermissions(userId, permissions, "allowed");
    showToast("Permissions granted");
    setActionLoadingKey(null);
  };

  const handleRevokePermissions = async (participant, permissions) => {
    const { userId } = participant;
    setActionLoadingKey(`revoke-${userId}`);
    await simulateDelay();
    applyLocalPermissions(userId, permissions, "blocked");
    removeParticipantTracks(userId, permissions);
    showToast("Permissions revoked");
    setActionLoadingKey(null);
  };

  const handleMuteParticipant = async (participant) => {
    removeParticipantTracks(participant.userId, ["send-audio"]);
    showToast("Microphone muted");
  };

  const handleRemoveParticipant = async (participant) => {
    if (!window.confirm(`Remove ${participant.name} from the call?`)) return;

    setActionLoadingKey(`remove-${participant.userId}`);
    await simulateDelay();
    setParticipants((prev) => prev.filter((p) => p.userId !== participant.userId));
    showToast("Participant removed");
    setActionLoadingKey(null);
  };

  // ---- derived display data -----------------------------------------------------
  const featuredParticipant = participants.find((p) => p.userId !== userData.id) || null;
  const candidate = participants.find((p) => p.role !== PARTICIPANT_ROLE.HOST);
  const overlayTitle = candidate ? `Interview: ${candidate.name}` : sessionInfo.roundName;
  const duration = formatDuration(elapsedSeconds);

  // ---- render -------------------------------------------------------------------
  if (leaveConfirmation) {
    return <LeaveSessionModal onCancel={() => setLeaveConfirmation(false)} onConfirm={handleLeave} />;
  }

  if (endSessionConfirmation) {
    return (
      <EndSessionModal
        isEndingSession={isEndingSession}
        onCancel={() => setEndSessionConfirmation(false)}
        onConfirm={handleEndSession}
      />
    );
  }

  return (
    <div className="flex h-screen relative">
      <ToastNotification message={toastMessage} />

      <SessionStage
        featuredParticipant={featuredParticipant}
        selfName={userData.name}
        selfStream={localStream}
        isCameraMuted={isCameraMuted}
        screenStream={screenStream}
        title={overlayTitle}
        subtitle={sessionInfo.roundName}
        duration={duration}
        networkStatus={networkStatus}
        controlBarProps={{
          isMicMuted,
          onToggleMic: handleToggleMic,
          isCameraMuted,
          onToggleCamera: handleToggleCamera,
          isScreenSharing,
          onToggleScreenShare: handleToggleScreenShare,
          activeTab: activePanel,
          onSelectTab: handleSelectTab,
          unreadCount,
          isHost,
          onRequestEndSession: () => setEndSessionConfirmation(true),
          onReportIssue: handleReportIssue,
          onRequestLeave: () => setLeaveConfirmation(true),
        }}
      />

      <SessionSidePanel
        activeTab={activePanel}
        onSelectTab={handleSelectTab}
        participantCount={participants.length}
        unreadCount={unreadCount}
      >
        {activePanel === SESSION_PANEL.CHAT ? (
          <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
        ) : (
          <ParticipantsPanel
            participants={participants}
            currentUserId={userData.id}
            isHost={isHost}
            expandedId={expandedParticipantId}
            onToggleExpand={(userId) => setExpandedParticipantId((prev) => (prev === userId ? null : userId))}
            localPermissions={localPermissions}
            actionLoadingKey={actionLoadingKey}
            onMute={handleMuteParticipant}
            onRemove={handleRemoveParticipant}
            onGrantPermission={handleGrantPermissions}
            onRevokePermission={handleRevokePermissions}
            aiAssistant={aiAssistant}
          />
        )}
      </SessionSidePanel>
    </div>
  );
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}