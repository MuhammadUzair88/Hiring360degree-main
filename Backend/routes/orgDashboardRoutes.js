// routes/dashboardRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getDashboardData,
  getScheduleByDate,
  getInterviewDetails,
  getApplicationAnalytics,
  getPipelineMetrics,
  getInterviewerMetrics
} from '../controllers/orgDashboardController.js';

const router = express.Router();

// Main dashboard data
router.get('/dashboard', authMiddleware, getDashboardData);

// Schedule by date
router.get('/schedule/:date', authMiddleware, getScheduleByDate);

// Interview details
router.get('/interview/:applicationId', authMiddleware, getInterviewDetails);

// Analytics endpoints
router.get('/analytics/applications', authMiddleware, getApplicationAnalytics);
router.get('/analytics/pipeline', authMiddleware, getPipelineMetrics);
router.get('/analytics/interviewers', authMiddleware, getInterviewerMetrics);

export default router;