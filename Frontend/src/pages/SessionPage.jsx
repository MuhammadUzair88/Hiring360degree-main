import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionOverview } from "../components/organization/sessionPage";
import { useAuth } from "../context/AuthContext";
import interviewService from "../services/interviewService";
import chatService from "../services/chatService";
import { extractErrorMessage } from "../services/apiClient";


export default function SessionPage() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { interviewer, isInterviewerLogin } = useAuth();

  const [callDetails, setCallDetails] = useState(null);
  const [streamToken, setStreamToken] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await interviewService.getCallDetails(callId);
        if (!isActive) return;
        setCallDetails(details.call || details);

        const displayName = isInterviewerLogin
          ? interviewer?.name || "Interviewer"
          : window.prompt("What's your name?")?.trim() || "Candidate";
        setCandidateName(displayName);

        const tokenData = await chatService.getStreamToken({
          userId: isInterviewerLogin ? interviewer?.id || "interviewer" : `candidate-${callId}`,
          userName: displayName,
        });
        if (isActive) setStreamToken(tokenData.token);
      } catch (err) {
        if (isActive) setError(extractErrorMessage(err, "This interview link is invalid or has expired."));
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-300">
        Joining interview room…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 px-4 text-center text-slate-300">
        <p className="text-lg font-semibold text-white">Can't join this interview</p>
        <p className="max-w-sm text-sm">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <SessionOverview
      userData={{
        id: isInterviewerLogin ? interviewer?.id || "interviewer" : `candidate-${callId}`,
        name: candidateName,
        role: isInterviewerLogin ? "interviewer" : "candidate",
      }}
      sessionInfo={{
        roundName: callDetails?.roundName || "Interview",
        callId,
      }}
      // Not yet consumed by SessionOverview — reserved for the Stream
      // Video SDK wiring described above.
      streamToken={streamToken}
    />
  );
}
