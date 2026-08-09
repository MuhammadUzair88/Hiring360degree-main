import jwt from "jsonwebtoken";
import { ScheduledInterview } from "../models/interviewModel.js";

/**
 * Only the interviewer assigned to this scheduled interview may perform host
 * moderation actions (end/mute/remove/grant/revoke/admit).
 */
export default async function interviewCallHostMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Interviewer authentication is required",
      });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (decoded.role !== "interviewer" || !decoded.interviewerId) {
      return res.status(403).json({
        success: false,
        message: "Only the assigned interviewer can manage this call",
      });
    }

    const interview = await ScheduledInterview.findOne({
      callId: req.params.callId,
    }).select("interviewerId callId status feedbackEvaluation");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview call not found",
      });
    }

    if (String(interview.interviewerId) !== String(decoded.interviewerId)) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this interview",
      });
    }

    req.interviewerId = decoded.interviewerId;
    req.callInterview = interview;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired interviewer session",
    });
  }
}
