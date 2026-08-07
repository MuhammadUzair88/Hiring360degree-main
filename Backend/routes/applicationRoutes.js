import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addApplication, analyzeApplicationResume, bookmarkCandidate, getApplicationById, getApplications, getApplicationStats, MoveCandidateToApplied, rejectCandidate, shortlistCandidate } from "../controllers/applicationController.js";


const router = express.Router();

router.post("/add/:advertisementId", addApplication);
router.post("/analyze/:applicationId",authMiddleware, analyzeApplicationResume);
router.get("/stats/:advertisementId", authMiddleware, getApplicationStats);
router.get("/get/:advertisementId", authMiddleware, getApplications);
router.put("/bookmark/:applicationId", authMiddleware, bookmarkCandidate);
router.put("/shortlist/:applicationId", authMiddleware, shortlistCandidate);
router.put("/reject/:applicationId", authMiddleware, rejectCandidate);
router.put("/move/:applicationId", authMiddleware, MoveCandidateToApplied);
router.get("/getsingle/:applicationId", authMiddleware, getApplicationById);



export default router;