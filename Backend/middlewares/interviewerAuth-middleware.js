// middlewares/interviewerAuth-middleware.js
import jwt from "jsonwebtoken";
import { Interviewer } from "../models/interviewerModel.js";

export const requireInterviewerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // ✅ REJECT ORGANIZATION TOKENS
    if (!decoded.role || decoded.role !== "interviewer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This is not an interviewer token.",
      });
    }

    const interviewer = await Interviewer.findById(decoded.interviewerId);
    
    if (!interviewer) {
      return res.status(401).json({
        success: false,
        message: "Interviewer account not found or has been deactivated.",
      });
    }

    if (interviewer.organizationId.toString() !== decoded.organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Organization mismatch. Access denied.",
      });
    }

    req.interviewerId = decoded.interviewerId;
    req.organizationId = decoded.organizationId;
    req.interviewer = interviewer;

    next();
  } catch (error) {
    console.error("Interviewer Auth Middleware Error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired." });
    }
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const requireInterviewerTokenOnly = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // ✅ REJECT ORGANIZATION TOKENS
    if (!decoded.role || decoded.role !== "interviewer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This is not an interviewer token.",
      });
    }

    req.interviewerId = decoded.interviewerId;
    req.organizationId = decoded.organizationId;

    next();
  } catch (error) {
    console.error("Interviewer Token Auth Error:", error.message);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};