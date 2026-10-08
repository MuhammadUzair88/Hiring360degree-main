import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CallingState,
  hasAudio,
  hasScreenShare,
  hasVideo,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import {
  PARTICIPANT_ROLE,
  SESSION_PANEL,
  NETWORK_STATUS,
} from "./data";

import SessionStage from "./SessionStage";
import SessionSidePanel from "./SessionSidePanel";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import ToastNotification from "./ToastNotification";
import LeaveSessionModal from "./LeaveSessionModal";
import EndSessionModal from "./EndSessionModal";
import CollaborativeCodePanel from "./CollaborativeCodePanel";
import interviewService from "../../../services/interviewService";
import { extractErrorMessage } from "../../../services/apiClient";

const WELCOME_MESSAGE = {
  id: "session-welcome",
  text: "Welcome to the interview!",
  sender: "System",
  timestamp: "",
  isSystem: true,
};

export default function SessionOverview({
  userData,
  sessionInfo,
  chatChannel,
  codingToken,
  aiAssistant = null,
}) {
  const navigate = useNavigate();
  const call = useCall();
  const isHost = userData?.role === "interviewer";

  const {
    useParticipants,
    useLocalParticipant,
    useCameraState,
    useMicrophoneState,
    useScreenShareState,
    useHasOngoingScreenShare,
    useCallCallingState,
    useCallStartedAt,
    useCallEndedAt,
  } = useCallStateHooks();

  const streamParticipants = useParticipants();
  const localParticipant = useLocalParticipant();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { screenShare } = useScreenShareState();
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const callingState = useCallCallingState();
  const callStartedAt = useCallStartedAt();
  const callEndedAt = useCallEndedAt();

  const [activePanel, setActivePanel] = useState(SESSION_PANEL.PARTICIPANTS);
  const [codingSession, setCodingSession] = useState({
    enabled: false,
    languageId: null,
    sourceCode: "",
    stdin: "",
    revision: 0,
  });
  const [compilerLanguages, setCompilerLanguages] = useState([]);
  const [isLoadingCompilerLanguages, setIsLoadingCompilerLanguages] = useState(false);
  const [codingToggleBusy, setCodingToggleBusy] = useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);
  const [endSessionConfirmation, setEndSessionConfirmation] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([WELCOME_MESSAGE]);

  const [expandedParticipantId, setExpandedParticipantId] = useState(null);
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const [localPermissions, setLocalPermissions] = useState({});

  const toastTimerRef = useRef(null);
  const endRedirectedRef = useRef(false);
  const previousCodingEnabledRef = useRef(false);

  const applyCodingSession = useCallback((nextSession) => {
    setCodingSession((current) =>
      Number(nextSession?.revision || 0) >= Number(current.revision || 0)
        ? nextSession
        : current
    );
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!codingToken || !sessionInfo.callId) return undefined;

    let active = true;
    let timer;
    const pollCodingSession = async () => {
      try {
        const response = await interviewService.getCodingSession(
          sessionInfo.callId,
          codingToken
        );
        if (active && response.codingSession) {
          applyCodingSession(response.codingSession);
        }
      } catch (error) {
        if (active) {
          console.warn("Unable to sync interview code session:", error);
        }
      } finally {
        if (active) timer = window.setTimeout(pollCodingSession, 1000);
      }
    };

    void pollCodingSession();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [applyCodingSession, codingToken, sessionInfo.callId]);

  useEffect(() => {
    if (!codingSession.enabled || !codingToken || !sessionInfo.callId) {
      setCompilerLanguages([]);
      setIsLoadingCompilerLanguages(false);
      return undefined;
    }

    let active = true;
    setIsLoadingCompilerLanguages(true);
    interviewService
      .getCompilerLanguages(sessionInfo.callId, codingToken)
      .then((response) => {
        if (active) setCompilerLanguages(response.languages || []);
      })
      .catch((error) => {
        if (active) {
          console.warn("Unable to load compiler languages:", error);
          setCompilerLanguages([]);
        }
      })
      .finally(() => {
        if (active) setIsLoadingCompilerLanguages(false);
      });

    return () => {
      active = false;
    };
  }, [codingSession.enabled, codingToken, sessionInfo.callId]);

  useEffect(() => {
    const wasEnabled = previousCodingEnabledRef.current;
    if (codingSession.enabled && !wasEnabled) {
      setActivePanel(SESSION_PANEL.CODE);
    } else if (!codingSession.enabled && wasEnabled) {
      setActivePanel((current) =>
        current === SESSION_PANEL.CODE ? SESSION_PANEL.PARTICIPANTS : current
      );
    }
    previousCodingEnabledRef.current = codingSession.enabled;
  }, [codingSession.enabled]);

  const participants = useMemo(
    () =>
      streamParticipants
        .map((participant) => ({
          userId: participant.userId,
          name:
            participant.name ||
            (participant.userId === userData.id ? userData.name : "Participant"),
          role:
            participant.userId === sessionInfo.streamHostId
              ? PARTICIPANT_ROLE.HOST
              : PARTICIPANT_ROLE.GUEST,
          publishedTracks: [
            ...(hasAudio(participant) ? ["audio"] : []),
            ...(hasVideo(participant) ? ["video"] : []),
            ...(hasScreenShare(participant) ? ["screenshare"] : []),
          ],
          streamParticipant: participant,
        }))
        .sort((a, b) => {
          if (a.role === b.role) return 0;
          return a.role === PARTICIPANT_ROLE.HOST ? -1 : 1;
        }),
    [streamParticipants, sessionInfo.streamHostId, userData.id, userData.name]
  );

  const isScreenSharing = Boolean(localParticipant && hasScreenShare(localParticipant));
  const screenShareParticipant =
    streamParticipants.find((participant) => hasScreenShare(participant)) || null;

  const featuredParticipant =
    participants.find((participant) => participant.userId !== userData.id) || null;

  const candidate = participants.find(
    (participant) => participant.role !== PARTICIPANT_ROLE.HOST
  );

  const overlayTitle = candidate
    ? `Interview: ${candidate.name}`
    : sessionInfo.candidateName
      ? `Interview: ${sessionInfo.candidateName}`
      : sessionInfo.roundName;

  const resolvedNetworkStatus = [
    CallingState.RECONNECTING,
    CallingState.RECONNECTING_FAILED,
    CallingState.OFFLINE,
  ].includes(callingState)
    ? NETWORK_STATUS.DISCONNECTED
    : NETWORK_STATUS.STABLE;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const updateDuration = () => {
      if (!callStartedAt) {
        setElapsedSeconds(0);
        return;
      }

      const startedAt = new Date(callStartedAt).getTime();
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      );
    };

    updateDuration();
    const timer = window.setInterval(updateDuration, 1000);
    return () => window.clearInterval(timer);
  }, [callStartedAt]);

  const navigateAfterEndedInterview = useCallback(
    (scheduleId = sessionInfo.scheduleId) => {
      if (endRedirectedRef.current) return;
      endRedirectedRef.current = true;

      if (isHost && scheduleId) {
        navigate(`/interviewers/evaluation/${scheduleId}`, { replace: true });
        return;
      }

      // Candidates never see the interviewer feedback screen.
      navigate("/", { replace: true });
    },
    [isHost, navigate, sessionInfo.scheduleId]
  );

  // Covers the case where Stream reports that the call ended before the local
  // REST request resolves, or the call was ended by another host session.
  useEffect(() => {
    if (callEndedAt) {
      navigateAfterEndedInterview();
    }
  }, [callEndedAt, navigateAfterEndedInterview]);

  // A candidate who is removed/kicked leaves the call without setting endedAt.
  // Send only the candidate away; the interviewer workspace remains protected.
  useEffect(() => {
    if (!isHost && callingState === CallingState.LEFT && !callEndedAt) {
      navigate("/", { replace: true });
    }
  }, [callEndedAt, callingState, isHost, navigate]);

  useEffect(() => {
    if (!chatChannel) return undefined;

    const normalizeMessage = (message) => ({
      id:
        message.id ||
        `${message.user?.id || "message"}-${message.created_at || Date.now()}`,
      text: message.text || "",
      sender: message.user?.name || message.user?.id || "Participant",
      timestamp: message.created_at
        ? new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      isSystem: message.type === "system",
    });

    const existingMessages = (chatChannel.state?.messages || []).map(normalizeMessage);
    setChatMessages([WELCOME_MESSAGE, ...existingMessages]);

    const subscription = chatChannel.on("message.new", (event) => {
      if (!event.message) return;

      const normalized = normalizeMessage(event.message);

      setChatMessages((current) => {
        if (current.some((message) => message.id === normalized.id)) return current;
        return [...current, normalized];
      });

      if (
        activePanel !== SESSION_PANEL.CHAT &&
        event.message.user?.id !== userData.id
      ) {
        setUnreadCount((count) => count + 1);
      }
    });

    return () => subscription?.unsubscribe?.();
  }, [chatChannel, activePanel, userData.id]);

  const handleSendMessage = async (text) => {
    if (!chatChannel) {
      showToast("Chat is still connecting.");
      return;
    }

    try {
      await chatChannel.sendMessage({ text });
    } catch (error) {
      console.error("Unable to send chat message:", error);
      showToast(extractErrorMessage(error, "Message could not be sent."));
    }
  };

  const handleSelectTab = (tab) => {
    setActivePanel(tab);

    if (tab === SESSION_PANEL.CHAT) {
      setUnreadCount(0);
      chatChannel?.markRead().catch((error) => {
        console.warn("Unable to mark chat as read:", error);
      });
    }
  };

  const handleToggleCoding = async () => {
    if (!isHost || !codingToken || codingToggleBusy) return;

    setCodingToggleBusy(true);
    try {
      const response = await interviewService.updateCodingSession(
        sessionInfo.callId,
        codingToken,
        { enabled: !codingSession.enabled }
      );
      applyCodingSession(response.codingSession);
      showToast(
        response.codingSession.enabled
          ? "Shared code editor enabled"
          : "Shared code editor disabled"
      );
    } catch (error) {
      showToast(extractErrorMessage(error, "Code editor setting could not be changed."));
    } finally {
      setCodingToggleBusy(false);
    }
  };

  const handleSaveCodingSession = useCallback(
    async (updates) => {
      const response = await interviewService.updateCodingSession(
        sessionInfo.callId,
        codingToken,
        updates
      );
      applyCodingSession(response.codingSession);
      return response.codingSession;
    },
    [applyCodingSession, codingToken, sessionInfo.callId]
  );

  const handleRunCode = useCallback(
    async (submission) => {
      const response = await interviewService.runCodingSubmission(
        sessionInfo.callId,
        codingToken,
        {
          languageId: submission.languageId,
          sourceCode: submission.sourceCode,
          stdin: submission.stdin,
        }
      );
      return (
        response.result || {
          status: response.message || "Compilation pending",
          message: response.message || "The compiler is still processing.",
        }
      );
    },
    [codingToken, sessionInfo.callId]
  );

  const handleToggleMic = async () => {
    try {
      await microphone.toggle();
    } catch (error) {
      console.error("Microphone toggle failed:", error);
      showToast("Microphone could not be changed. Check browser permissions.");
    }
  };

  const handleToggleCamera = async () => {
    try {
      await camera.toggle();
    } catch (error) {
      console.error("Camera toggle failed:", error);
      showToast("Camera could not be changed. Check browser permissions.");
    }
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing && hasOngoingScreenShare) {
      showToast("Another participant is already sharing their screen.");
      return;
    }

    try {
      await screenShare.toggle();
    } catch (error) {
      console.error("Screen share toggle failed:", error);
      showToast("Screen sharing could not be started.");
    }
  };

  const handleEndSession = async () => {
    if (!isHost || isEndingSession) return;

    setIsEndingSession(true);

    try {
      const result = await interviewService.endCall(sessionInfo.callId);
      navigateAfterEndedInterview(
        result?.scheduleId || result?.interviewId || sessionInfo.scheduleId
      );
    } catch (error) {
      console.error("Unable to end interview:", error);
      setEndSessionConfirmation(false);
      showToast(extractErrorMessage(error, "The session could not be ended."));
    } finally {
      setIsEndingSession(false);
    }
  };

  const handleLeave = async () => {
    try {
      await call?.leave();
    } catch (error) {
      console.warn("Unable to leave call cleanly:", error);
    } finally {
      navigate(
        isHost ? "/interviewers/conduct-interviews" : "/",
        { replace: true }
      );
    }
  };

  const handleReportIssue = () => {
    showToast("Thanks — this has been noted.");
  };

  const applyLocalPermissions = (userId, permissions, status) => {
    setLocalPermissions((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        ...permissions.reduce(
          (next, permission) => ({ ...next, [permission]: status }),
          {}
        ),
      },
    }));
  };

  const handleGrantPermissions = async (participant, permissions) => {
    if (!isHost) return;

    const { userId } = participant;
    setActionLoadingKey(`grant-${userId}`);

    try {
      await interviewService.grantPermissions(sessionInfo.callId, {
        userId,
        permissions,
      });
      applyLocalPermissions(userId, permissions, "allowed");
      showToast("Permissions granted");
    } catch (error) {
      console.error("Grant permission failed:", error);
      showToast(extractErrorMessage(error, "Permissions could not be granted."));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleRevokePermissions = async (participant, permissions) => {
    if (!isHost) return;

    const { userId } = participant;
    setActionLoadingKey(`revoke-${userId}`);

    try {
      await interviewService.revokePermissions(sessionInfo.callId, {
        userId,
        permissions,
      });
      applyLocalPermissions(userId, permissions, "blocked");
      showToast("Permissions revoked");
    } catch (error) {
      console.error("Revoke permission failed:", error);
      showToast(extractErrorMessage(error, "Permissions could not be revoked."));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleMuteParticipant = async (participant) => {
    if (!isHost) return;

    try {
      await interviewService.muteParticipant(
        sessionInfo.callId,
        participant.userId
      );
      showToast("Microphone muted");
    } catch (error) {
      console.error("Mute participant failed:", error);
      showToast(extractErrorMessage(error, "Participant could not be muted."));
    }
  };

  const handleRemoveParticipant = async (participant) => {
    if (!isHost) return;
    if (!window.confirm(`Remove ${participant.name} from the call?`)) return;

    setActionLoadingKey(`remove-${participant.userId}`);

    try {
      await interviewService.removeParticipant(
        sessionInfo.callId,
        participant.userId
      );
      showToast("Participant removed");
    } catch (error) {
      console.error("Remove participant failed:", error);
      showToast(extractErrorMessage(error, "Participant could not be removed."));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const duration = formatDuration(elapsedSeconds);

  if (leaveConfirmation) {
    return (
      <LeaveSessionModal
        onCancel={() => setLeaveConfirmation(false)}
        onConfirm={handleLeave}
      />
    );
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
    <div className="flex h-screen relative bg-slate-950">
      <ToastNotification message={toastMessage} />

      <SessionStage
        featuredParticipant={featuredParticipant}
        selfParticipant={localParticipant}
        selfName={userData.name}
        isCameraMuted={isCameraMuted}
        screenShareParticipant={screenShareParticipant}
        title={overlayTitle}
        subtitle={sessionInfo.roundName}
        duration={duration}
        networkStatus={resolvedNetworkStatus}
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
        isHost={isHost}
        codingEnabled={codingSession.enabled}
        codingToggleBusy={codingToggleBusy}
        onToggleCoding={handleToggleCoding}
      >
        {activePanel === SESSION_PANEL.CODE && codingSession.enabled ? (
          <CollaborativeCodePanel
            codingSession={codingSession}
            languages={compilerLanguages}
            isLoadingLanguages={isLoadingCompilerLanguages}
            onSave={handleSaveCodingSession}
            onRun={handleRunCode}
          />
        ) : activePanel === SESSION_PANEL.CHAT ? (
          <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
        ) : (
          <ParticipantsPanel
            participants={participants}
            currentUserId={userData.id}
            isHost={isHost}
            expandedId={expandedParticipantId}
            onToggleExpand={(userId) =>
              setExpandedParticipantId((current) =>
                current === userId ? null : userId
              )
            }
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
