// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { SessionOverview } from "../components/organization/sessionPage";
// import { useAuth } from "../context/AuthContext";
// import interviewService from "../services/interviewService";
// import chatService from "../services/chatService";
// import { extractErrorMessage } from "../services/apiClient";


// export default function SessionPage() {
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const { interviewer, isInterviewerLogin } = useAuth();

//   const [callDetails, setCallDetails] = useState(null);
//   const [streamToken, setStreamToken] = useState(null);
//   const [candidateName, setCandidateName] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isActive = true;
//     (async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const details = await interviewService.getCallDetails(callId);
//         if (!isActive) return;
//         setCallDetails(details.call || details);

//         const displayName = isInterviewerLogin
//           ? interviewer?.name || "Interviewer"
//           : window.prompt("What's your name?")?.trim() || "Candidate";
//         setCandidateName(displayName);

//         const tokenData = await chatService.getStreamToken({
//           userId: isInterviewerLogin ? interviewer?.id || "interviewer" : `candidate-${callId}`,
//           userName: displayName,
//         });
//         if (isActive) setStreamToken(tokenData.token);
//       } catch (err) {
//         if (isActive) setError(extractErrorMessage(err, "This interview link is invalid or has expired."));
//       } finally {
//         if (isActive) setIsLoading(false);
//       }
//     })();
//     return () => {
//       isActive = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [callId]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-300">
//         Joining interview room…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 px-4 text-center text-slate-300">
//         <p className="text-lg font-semibold text-white">Can't join this interview</p>
//         <p className="max-w-sm text-sm">{error}</p>
//         <button
//           type="button"
//           onClick={() => navigate("/")}
//           className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
//         >
//           Back to dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <SessionOverview
//       userData={{
//         id: isInterviewerLogin ? interviewer?.id || "interviewer" : `candidate-${callId}`,
//         name: candidateName,
//         role: isInterviewerLogin ? "interviewer" : "candidate",
//       }}
//       sessionInfo={{
//         roundName: callDetails?.roundName || "Interview",
//         callId,
//       }}
//       // Not yet consumed by SessionOverview — reserved for the Stream
//       // Video SDK wiring described above.
//       streamToken={streamToken}
//     />
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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

const TOKEN_RETRY_DELAYS = [0, 750, 1500];

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
  const { interviewer, isInterviewerLogin } = useAuth();

  const requestedRole = searchParams.get("role");
  const joinRole = useMemo(() => {
    if (requestedRole === "candidate" || requestedRole === "interviewer") {
      return requestedRole;
    }

    return isInterviewerLogin ? "interviewer" : "candidate";
  }, [requestedRole, isInterviewerLogin]);

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
      setIsLoading(true);
      setError(null);
      setSession(null);

      try {
        if (!callId) {
          throw new Error("Interview call ID is missing.");
        }

        if (joinRole === "interviewer" && !isInterviewerLogin) {
          throw new Error(
            "Please sign in to the interviewer portal before joining this interview."
          );
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
  }, [callId, joinRole, isInterviewerLogin, interviewer?.name, retryKey]);

  const displayName =
    joinRole === "interviewer"
      ? interviewer?.name || "Interviewer"
      : session?.sessionInfo?.candidateName || "Candidate";

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
        />
      </StreamCall>
    </StreamVideo>
  );
}
