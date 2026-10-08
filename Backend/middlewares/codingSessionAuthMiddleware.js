import jwt from "jsonwebtoken";
import { ScheduledInterview } from "../models/interviewModel.js";

export default async function codingSessionAuthMiddleware(req, res, next) {
  try {
    const token = req.get("x-coding-session-token");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Interview session authorization is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (
      decoded.callId !== req.params.callId ||
      !["interviewer", "candidate"].includes(decoded.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "This session token cannot access the coding room",
      });
    }

    const interview = await ScheduledInterview.findOne({
      callId: req.params.callId,
    }).select("interviewerId status codingSession");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview call not found",
      });
    }

    if (["Completed", "Cancelled", "No Show"].includes(interview.status)) {
      return res.status(410).json({
        success: false,
        message: "This interview session is no longer active",
      });
    }

    if (
      decoded.role === "interviewer" &&
      String(interview.interviewerId) !== String(decoded.interviewerId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this interview",
      });
    }

    req.codingSession = {
      role: decoded.role,
      interview,
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Interview session token expired"
          : "Invalid interview session token",
    });
  }
}
