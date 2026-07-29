import express from "express";
import {
  getOfferedCandidates,
  customizeOfferLetterSettings,
  customizeCandidateOfferLetter,
  notifyCandidate,
  getOfferLetterSettings, 
  getCandidateOfferLetter 
} from "../controllers/offerLetterControllers.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET routes
router.get("/candidates/:advertisementId", authMiddleware, getOfferedCandidates);
router.get("/settings/:advertisementId", authMiddleware, getOfferLetterSettings); 
router.get("/letter/:applicationId", authMiddleware, getCandidateOfferLetter); 

// PUT / POST routes
router.put("/settings/:advertisementId", authMiddleware, customizeOfferLetterSettings);
router.put("/customize/:applicationId", authMiddleware, customizeCandidateOfferLetter);
router.post("/notify/:applicationId", authMiddleware, notifyCandidate);

export default router;