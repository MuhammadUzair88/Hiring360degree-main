import express from "express";
import {
  addInterviewer,
  getInterviewers,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer,
  loginInterviewer,
} from "../controllers/interviewerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";



const interviewerRouter = express.Router();

// Add interviewer
interviewerRouter.post(
  "/",
  authMiddleware,
  addInterviewer
);

// Get all interviewers of logged-in organization
interviewerRouter.get(
  "/",
  authMiddleware,
  getInterviewers
);

// Get interviewer by ID
interviewerRouter.get(
  "/:id",
  authMiddleware,
  getInterviewerById
);

// Update interviewer
interviewerRouter.put(
  "/:id",
  authMiddleware,
  updateInterviewer
);

// Delete interviewer
interviewerRouter.delete(
  "/:id",
  authMiddleware,
  deleteInterviewer
);


// performed by Interviewer
interviewerRouter.post(
  "/login",
  loginInterviewer
);


export default interviewerRouter;