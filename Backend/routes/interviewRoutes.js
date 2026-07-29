// routes/interviewRoutes.js
import express from "express";
import {
  getCallDetails,           // PUBLIC
  grantPermissions,         // PUBLIC
  revokePermissions,        // PUBLIC
  admitCandidateToCall,     // PUBLIC
  removeCandidateFromCall,  // PUBLIC
  endInterviewCall,         // PUBLIC
  createInterview,
  getJobSchedules,
  resendInterviewEmail,
  checkInterviewerAvailability,
  updateInterview,
  
} from "../controllers/interviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { muteCandidateInCall } from "../utils/stream.js";
import { decideRoundOutcome, getRoundCandidates } from "../controllers/nextRoundController.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES (No auth required - for interview room)
// =========================
router.get("/call/:callId/details", getCallDetails);
router.post("/call/:callId/grant-permissions", grantPermissions);
router.post("/call/:callId/revoke-permissions", revokePermissions);
router.post("/call/:callId/admit/:userId", admitCandidateToCall);
router.post("/call/:callId/remove/:userId", removeCandidateFromCall);
router.post("/call/:callId/end", endInterviewCall);
router.post("/call/:callId/mute/:userId", muteCandidateInCall);



// =========================
// PROTECTED ROUTES (Auth required)
// =========================
router.get("/check-availability", authMiddleware, checkInterviewerAvailability);
router.post("/schedule", authMiddleware, createInterview);
router.put("/schedule/:scheduleId", authMiddleware, updateInterview);
router.get("/schedule/:advertisementId", authMiddleware, getJobSchedules);
router.post("/resend-email/:scheduleId", authMiddleware, resendInterviewEmail);

// move to next round routes

router.patch("/decision/:scheduleId", authMiddleware, decideRoundOutcome);
router.get("/round-pool/:advertisementId/:roundIndex", authMiddleware, getRoundCandidates);

export default router;