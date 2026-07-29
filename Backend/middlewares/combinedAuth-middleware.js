// middlewares/combinedAuth.js
import jwt from "jsonwebtoken";
import { Organization } from "../models/organizationModel.js";
import { Interviewer } from "../models/interviewerModel.js";

export const combinedAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // Check if it's an organization token
    if (decoded.organizationId && decoded.email && !decoded.role) {
      const orgData = await Organization.findById(decoded.organizationId).select({ password: 0 });
      if (orgData) {
        req.organization = orgData;
        req.organizationId = orgData._id;
        req.userType = "organization";
        return next();
      }
    }

    // Check if it's an interviewer token
    if (decoded.role === "interviewer" && decoded.interviewerId) {
      const interviewer = await Interviewer.findById(decoded.interviewerId);
      if (interviewer) {
        req.interviewer = interviewer;
        req.interviewerId = interviewer._id;
        req.organizationId = decoded.organizationId;
        req.userType = "interviewer";
        return next();
      }
    }

    return res.status(401).json({ message: "Invalid token" });
  } catch (error) {
    return res.status(401).json({ message: "Token error" });
  }
};