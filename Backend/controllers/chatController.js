

import jwt from "jsonwebtoken";
import { ScheduledInterview } from "../models/interviewModel.js";
import {
  chatClient,
  streamClient,
  createStreamUser,
  createVideoCall,
  ensureInterviewChatChannel,
} from "../utils/stream.js";

const TOKEN_VALIDITY_SECONDS = 4 * 60 * 60;

function readInterviewerId(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;

  try {
    const decoded = jwt.verify(
      authHeader.slice("Bearer ".length),
      process.env.JWT_TOKEN_SECRET
    );

    if (decoded.role !== "interviewer") return null;
    return decoded.interviewerId || null;
  } catch {
    return null;
  }
}

/**
 * Issue Video + Chat tokens for exactly one scheduled interview.
 *
 * Candidate identity is resolved from the callId in the emailed link.
 * Interviewer identity additionally requires the interviewer JWT and must
 * match the interviewer assigned to the schedule. The browser cannot request
 * a token for an arbitrary Stream user id.
 */
export const getStreamToken = async (req, res) => {
  try {
    const { callId, role } = req.body;

    if (!callId || !["candidate", "interviewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "callId and a valid role are required",
      });
    }

    const interview = await ScheduledInterview.findOne({ callId })
      .populate({
        path: "applicationId",
        select: "candidateId advertisementId",
        populate: { path: "candidateId", select: "name email" },
      })
      .populate({ path: "interviewerId", select: "name email" });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview call not found",
      });
    }

    if (["Completed", "Cancelled", "No Show"].includes(interview.status)) {
      return res.status(410).json({
        success: false,
        message: "This interview session is no longer active",
      });
    }

    const interviewerDoc = interview.interviewerId;
    const candidateDoc = interview.applicationId?.candidateId;

    if (!interviewerDoc || !candidateDoc) {
      return res.status(409).json({
        success: false,
        message: "Interview participants could not be resolved",
      });
    }

    if (role === "interviewer") {
      const requesterId = readInterviewerId(req);

      if (!requesterId) {
        return res.status(401).json({
          success: false,
          message: "Please sign in to the interviewer portal before joining",
        });
      }

      if (String(requesterId) !== String(interviewerDoc._id)) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this interview",
        });
      }
    }

    const streamHostId =
      interview.streamHostId || `interviewer_${interviewerDoc._id}`;
    const streamCandidateId =
      interview.streamCandidateId || `candidate_${candidateDoc._id}`;

    await Promise.all([
      createStreamUser({
        id: streamHostId,
        name: interviewerDoc.name || "Interviewer",
        role: "user",
      }),
      createStreamUser({
        id: streamCandidateId,
        name: candidateDoc.name || "Candidate",
        role: "user",
      }),
    ]);

    await createVideoCall(
      callId,
      streamHostId,
      interviewerDoc.name || "Interviewer",
      streamCandidateId,
      candidateDoc.name || "Candidate",
      {
        applicationId: String(interview.applicationId?._id || ""),
        scheduledInterviewId: String(interview._id),
        roundIndex: interview.roundIndex,
      }
    );

    await ensureInterviewChatChannel({
      callId,
      hostId: streamHostId,
      participantId: streamCandidateId,
      roundName: "Interview",
    });

    const isInterviewer = role === "interviewer";
    const userId = isInterviewer ? streamHostId : streamCandidateId;
    const name = isInterviewer
      ? interviewerDoc.name || "Interviewer"
      : candidateDoc.name || "Candidate";

    // Video and Chat each get a token minted by their own supported server SDK.
    const videoToken = await streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_VALIDITY_SECONDS,
    });

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + TOKEN_VALIDITY_SECONDS;
    const chatToken = chatClient.createToken(userId, expiresAt, issuedAt);

    // Persist recovered Stream ids for legacy schedules so subsequent requests
    // do not need to reconstruct them.
    if (!interview.streamHostId || !interview.streamCandidateId) {
      interview.streamHostId = streamHostId;
      interview.streamCandidateId = streamCandidateId;
      await interview.save();
    }

    return res.status(200).json({
      success: true,
      apiKey: process.env.STREAM_API_KEY,
      videoToken,
      chatToken,
      // Backward compatibility for older SessionPage implementations.
      token: videoToken,
      user: {
        id: userId,
        name,
        role,
      },
      callId,
      scheduleId: String(interview._id),
      applicationId: String(interview.applicationId?._id || ""),
      streamHostId,
      streamCandidateId,
      candidateName: candidateDoc.name || "Candidate",
      interviewerName: interviewerDoc.name || "Interviewer",
    });
  } catch (error) {
    console.error("Stream token generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to prepare the interview session",
    });
  }
};
