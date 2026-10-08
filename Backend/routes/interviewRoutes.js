
// routes/interviewRoutes.js
import express from "express";
import {
  getCallDetails,
  markInterviewCallStarted,
  grantPermissions,
  revokePermissions,
  admitCandidateToCall,
  removeCandidateFromCall,
  endInterviewCall,
  createInterview,
  getJobSchedules,
  resendInterviewEmail,
  checkInterviewerAvailability,
  updateInterview,
  cancelInterview,
} from "../controllers/interviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import interviewCallHostMiddleware from "../middlewares/interviewCallHostMiddleware.js";
import codingSessionAuthMiddleware from "../middlewares/codingSessionAuthMiddleware.js";
import {
  getCodingSession,
  updateCodingSession,
  getCompilerLanguages,
  runCodingSubmission,
} from "../controllers/codingSessionController.js";
import { muteCandidateInCall } from "../utils/stream.js";
import {
  decideRoundOutcome,
  getRoundCandidates,
} from "../controllers/nextRoundController.js";

const router = express.Router();

// Candidate-accessible room bootstrap route. The random callId comes from the
// emailed meeting link; no organization/interviewer account is required.
router.get("/call/:callId/details", getCallDetails);

// Shared coding room state is authorized by a short-lived participant token
// minted alongside the Stream tokens. Only the interviewer can toggle it.
router.get(
  "/call/:callId/coding-session/languages",
  codingSessionAuthMiddleware,
  getCompilerLanguages
);
router.get(
  "/call/:callId/coding-session",
  codingSessionAuthMiddleware,
  getCodingSession
);
router.patch(
  "/call/:callId/coding-session",
  codingSessionAuthMiddleware,
  updateCodingSession
);
router.post(
  "/call/:callId/coding-session/run",
  codingSessionAuthMiddleware,
  runCodingSubmission
);

// Starting the interview and all moderator actions require the assigned
// interviewer's JWT. A candidate opening the link early cannot mark it Ongoing.
router.post(
  "/call/:callId/started",
  interviewCallHostMiddleware,
  markInterviewCallStarted
);

// Host/moderator actions require the assigned interviewer's JWT.
router.post(
  "/call/:callId/grant-permissions",
  interviewCallHostMiddleware,
  grantPermissions
);
router.post(
  "/call/:callId/revoke-permissions",
  interviewCallHostMiddleware,
  revokePermissions
);
router.post(
  "/call/:callId/admit/:userId",
  interviewCallHostMiddleware,
  admitCandidateToCall
);
router.post(
  "/call/:callId/remove/:userId",
  interviewCallHostMiddleware,
  removeCandidateFromCall
);
router.post(
  "/call/:callId/end",
  interviewCallHostMiddleware,
  endInterviewCall
);
router.post(
  "/call/:callId/mute/:userId",
  interviewCallHostMiddleware,
  muteCandidateInCall
);

// Organization scheduling routes.
router.get("/check-availability", authMiddleware, checkInterviewerAvailability);
router.post("/schedule", authMiddleware, createInterview);
router.put("/schedule/:scheduleId", authMiddleware, updateInterview);
router.patch("/schedule/:scheduleId/cancel", authMiddleware, cancelInterview);
router.get("/schedule/:advertisementId", authMiddleware, getJobSchedules);
router.post("/resend-email/:scheduleId", authMiddleware, resendInterviewEmail);
router.patch("/decision/:scheduleId", authMiddleware, decideRoundOutcome);
router.get(
  "/round-pool/:advertisementId/:roundIndex",
  authMiddleware,
  getRoundCandidates
);

export default router;
