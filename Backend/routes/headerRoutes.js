import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getRecentCandidateContacts,
  getWorkspaceNotifications,
  searchWorkspace,
} from "../controllers/headerController.js";

const router = express.Router();

router.get("/search", authMiddleware, searchWorkspace);
router.get("/notifications", authMiddleware, getWorkspaceNotifications);
router.get("/contacts", authMiddleware, getRecentCandidateContacts);

export default router;
