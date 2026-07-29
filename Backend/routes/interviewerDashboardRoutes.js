// routes/interviewerDashboardRoutes.js
import express from "express";
import { requireInterviewerAuth, requireInterviewerTokenOnly } from "../middlewares/interviewerAuth-middleware.js";
import {
  getDashboardStats,
  getDashboardChart,
  getRecentInterviews,
  getLiveInterviews,
  getAllCandidates,
  getCandidateById,
  getAllEvaluations,
  getEvaluationById,
  submitEvaluation,
  getInterviewerOrganization,
} from "../controllers/interviewerDashboardController.js";

const router = express.Router();


router.get("/organization", requireInterviewerAuth, getInterviewerOrganization);

// Profile endpoint - needs full DB check to return interviewer data
router.get("/profile", requireInterviewerAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    interviewer: {
      id: req.interviewer._id,
      name: req.interviewer.name,
      email: req.interviewer.email,
      type: req.interviewer.type,
      organizationId: req.interviewer.organizationId,
    },
  });
});

// Dashboard stats - high traffic, use lighter middleware
router.get("/dashboard/stats", requireInterviewerTokenOnly, getDashboardStats);
router.get("/dashboard/chart", requireInterviewerTokenOnly, getDashboardChart);
router.get("/dashboard/recent-interviews", requireInterviewerTokenOnly, getRecentInterviews);
router.get("/dashboard/live-interviews", requireInterviewerTokenOnly, getLiveInterviews);

// Candidate management - needs full auth for security
router.get("/candidates", requireInterviewerAuth, getAllCandidates);
router.get("/candidates/:id", requireInterviewerAuth, getCandidateById);

// Evaluations - needs full auth for data integrity
router.get("/evaluations", requireInterviewerAuth, getAllEvaluations);
router.get("/evaluations/:id", requireInterviewerAuth, getEvaluationById);
router.post("/evaluations/:id", requireInterviewerAuth, submitEvaluation);

export default router;