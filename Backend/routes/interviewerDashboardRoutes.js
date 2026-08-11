// routes/interviewerDashboardRoutes.js
import express from "express";
import { requireInterviewerAuth } from "../middlewares/interviewerAuth-middleware.js";
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

// Every interviewer-workspace endpoint validates that the interviewer account
// still exists and still belongs to the organization encoded in the token.
router.use(requireInterviewerAuth);

router.get("/organization", getInterviewerOrganization);

router.get("/profile", (req, res) => {
  return res.status(200).json({
    success: true,
    interviewer: {
      id: String(req.interviewer._id),
      name: req.interviewer.name,
      email: req.interviewer.email,
      type: req.interviewer.type,
      organizationId: String(req.interviewer.organizationId),
    },
  });
});

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/chart", getDashboardChart);
router.get("/dashboard/recent-interviews", getRecentInterviews);
router.get("/dashboard/live-interviews", getLiveInterviews);

router.get("/candidates", getAllCandidates);
router.get("/candidates/:id", getCandidateById);

router.get("/evaluations", getAllEvaluations);
router.get("/evaluations/:id", getEvaluationById);
router.post("/evaluations/:id", submitEvaluation);

export default router;
