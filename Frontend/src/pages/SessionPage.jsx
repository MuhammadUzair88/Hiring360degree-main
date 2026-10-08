import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { StreamChat } from "stream-chat";

import {
  ConnectingScreen,
  ConnectionErrorScreen,
  SessionOverview,
} from "../components/organization/sessionPage";
import { useAuth } from "../context/AuthContext";
import interviewService from "../services/interviewService";
import chatService from "../services/chatService";
import { extractErrorMessage } from "../services/apiClient";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";

const TOKEN_RETRY_DELAYS = [0, 750, 1500];

function InterviewerLoginRequiredScreen({ onLogin, onBack }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-100 p-4">
      <div className="w-full max-w-md rounded-3xl border border-secondary-300 bg-white p-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-200">
          <ShieldCheck size={28} />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          Interviewer sign-in required
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          This is an interviewer interview-room link. Sign in with the interviewer account assigned to this interview, then you will return directly to this room.
        </p>

        <button
          type="button"
          onClick={onLogin}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <LogIn size={16} />
          Sign in as interviewer
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-secondary-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-secondary-100"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <p className="mt-5 text-xs leading-5 text-gray-400">
          Candidate links remain public. Interviewer host controls are protected by interviewer authentication.
        </p>
      </div>
    </div>
  );
}

async function withRetry(factory) {
  let lastError;

  for (const delay of TOKEN_RETRY_DELAYS) {
    if (delay) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }

    try {
      return await factory();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export default function SessionPage() {
  const { callId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { interviewer, isInterviewerLogin } = useAuth();

  const requestedRole = searchParams.get("role");
  const joinRole = useMemo(() => {
    if (requestedRole === "candidate" || requestedRole === "interviewer") {
      return requestedRole;
    }

    return isInterviewerLogin ? "interviewer" : "candidate";
  }, [requestedRole, isInterviewerLogin]);

  const interviewerAuthRequired =
    joinRole === "interviewer" && !isInterviewerLogin;

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    let videoClient = null;
    let call = null;
    let chatClient = null;
    let chatChannel = null;

    const cleanup = async () => {
      const tasks = [];

      if (chatChannel?.stopWatching) {
        tasks.push(
          chatChannel.stopWatching().catch((err) =>
            console.warn("Unable to stop watching interview chat:", err)
          )
        );
      }

      if (chatClient?.userID) {
        tasks.push(
          chatClient.disconnectUser().catch((err) =>
            console.warn("Unable to disconnect Stream Chat:", err)
          )
        );
      }

      if (call) {
        tasks.push(
          call.leave().catch((err) =>
            console.warn("Unable to leave Stream Video call:", err)
          )
        );
      }

      if (videoClient) {
        tasks.push(
          videoClient.disconnectUser().catch((err) =>
            console.warn("Unable to disconnect Stream Video:", err)
          )
        );
      }

      await Promise.allSettled(tasks);
    };

    const initializeSession = async () => {
      setError(null);
      setSession(null);

      if (interviewerAuthRequired) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        if (!callId) {
          throw new Error("Interview call ID is missing.");
        }

        const detailsResponse = await interviewService.getCallDetails(callId);
        if (!active) return;

        const details = detailsResponse.call || detailsResponse;

        const fetchTokenBundle = () =>
          withRetry(() =>
            chatService.getStreamToken({
              callId,
              role: joinRole,
            })
          );

        const initialTokens = await fetchTokenBundle();
        if (!active) return;

        const apiKey =
          initialTokens.apiKey || import.meta.env.VITE_STREAM_API_KEY;

        const videoToken = initialTokens.videoToken || initialTokens.token;
        const chatToken = initialTokens.chatToken || initialTokens.token;
        const streamUser = initialTokens.user;

        if (!apiKey || !videoToken || !chatToken || !streamUser?.id) {
          throw new Error("The interview room could not be configured.");
        }

        let firstVideoToken = videoToken;
        let firstChatToken = chatToken;

        const videoTokenProvider = async () => {
          if (firstVideoToken) {
            const token = firstVideoToken;
            firstVideoToken = null;
            return token;
          }

          const refreshed = await fetchTokenBundle();
          return refreshed.videoToken || refreshed.token;
        };

        const chatTokenProvider = async () => {
          if (firstChatToken) {
            const token = firstChatToken;
            firstChatToken = null;
            return token;
          }

          const refreshed = await fetchTokenBundle();
          return refreshed.chatToken || refreshed.token;
        };

        videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: streamUser.id,
            name: streamUser.name,
          },
          tokenProvider: videoTokenProvider,
          options: {
            maxConnectUserRetries: 3,
          },
        });

        call = videoClient.call("default", callId);

        // Ask Stream to publish real device tracks. Permission denial should not
        // prevent the user from joining; the room simply starts muted/camera-off.
        await Promise.allSettled([
          call.camera.enable(),
          call.microphone.enable(),
        ]);

        await call.join({ create: false });
        if (!active) {
          await cleanup();
          return;
        }

        // Only the assigned interviewer starts the backend interview clock.
        // A candidate opening an emailed link early must not turn the dashboard
        // status into Ongoing before the interviewer actually joins.
        if (joinRole === "interviewer") {
          interviewService.markCallStarted(callId).catch((err) => {
            console.warn("Could not mark interview as ongoing:", err);
          });
        }

        chatClient = StreamChat.getInstance(apiKey, {
          timeout: 8000,
        });

        if (chatClient.userID && chatClient.userID !== streamUser.id) {
          await chatClient.disconnectUser();
        }

        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id: streamUser.id,
              name: streamUser.name,
            },
            chatTokenProvider
          );
        }

        chatChannel = chatClient.channel("messaging", callId);
        await chatChannel.watch();

        if (!active) {
          await cleanup();
          return;
        }

        setSession({
          videoClient,
          call,
          chatChannel,
          codingToken: initialTokens.codingToken,
          userData: {
            id: streamUser.id,
            name:
              streamUser.name ||
              (joinRole === "interviewer" ? "Interviewer" : "Candidate"),
            role: joinRole,
          },
          sessionInfo: {
            callId,
            scheduleId:
              details.scheduleId ||
              details.interviewId ||
              initialTokens.scheduleId ||
              null,
            applicationId:
              details.applicationId || initialTokens.applicationId || null,
            roundName: details.roundName || "Interview",
            streamHostId:
              details.streamHostId || initialTokens.streamHostId || null,
            streamCandidateId:
              details.streamCandidateId ||
              initialTokens.streamCandidateId ||
              null,
            candidateName:
              details.candidateName || initialTokens.candidateName || "Candidate",
            interviewerName:
              details.interviewerName ||
              initialTokens.interviewerName ||
              interviewer?.name ||
              "Interviewer",
          },
        });
      } catch (err) {
        console.error("Unable to join interview session:", err);
        await cleanup();

        if (active) {
          setError(
            extractErrorMessage(
              err,
              "This interview link is invalid, expired, or could not connect."
            )
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    // Prevent React StrictMode's development-only setup/cleanup probe from
    // opening duplicate WebSocket/WebRTC connections.
    const startTimer = window.setTimeout(initializeSession, 0);

    return () => {
      active = false;
      window.clearTimeout(startTimer);
      void cleanup();
    };
  }, [callId, joinRole, interviewerAuthRequired, interviewer?.name, retryKey]);

  const displayName =
    joinRole === "interviewer"
      ? interviewer?.name || "Interviewer"
      : session?.sessionInfo?.candidateName || "Candidate";

  if (interviewerAuthRequired) {
    return (
      <InterviewerLoginRequiredScreen
        onLogin={() =>
          navigate("/interviewers/login", {
            state: {
              from: {
                pathname: location.pathname,
                search: location.search || "?role=interviewer",
              },
            },
          })
        }
        onBack={() => navigate("/interviewers/conduct-interviews")}
      />
    );
  }

  if (isLoading) {
    return <ConnectingScreen name={displayName} />;
  }

  if (error || !session) {
    return (
      <ConnectionErrorScreen
        message={error || "Unable to initialize the interview session."}
        onRetry={() => setRetryKey((value) => value + 1)}
        onBack={() =>
          navigate(
            joinRole === "interviewer"
              ? "/interviewers/conduct-interviews"
              : "/"
          )
        }
      />
    );
  }

  return (
    <StreamVideo client={session.videoClient}>
      <StreamCall call={session.call}>
        <SessionOverview
          userData={session.userData}
          sessionInfo={session.sessionInfo}
          chatChannel={session.chatChannel}
          codingToken={session.codingToken}
        />
      </StreamCall>
    </StreamVideo>
  );
}
