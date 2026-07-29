// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { Organization } from "../models/organizationModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: No token provided" 
      });
    }

    const jwtToken = authHeader.startsWith("Bearer ") 
      ? authHeader.slice(7) 
      : authHeader;

    if (!jwtToken) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Invalid token format" 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(jwtToken, process.env.JWT_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          data: "Token expired",
          message: "Token expired. Please login again." 
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ 
          success: false,
          message: "Invalid token. Please login again." 
        });
      }
      throw err;
    }

    // ✅ REJECT INTERVIEWER TOKENS
    if (decoded.role === "interviewer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This is an interviewer token, not an organization token.",
      });
    }

    // Find organization - try by organizationId first, then by email
    let orgData;
    if (decoded.organizationId) {
      orgData = await Organization.findById(decoded.organizationId).select({ password: 0 });
    }
    if (!orgData && decoded.email) {
      orgData = await Organization.findOne({ email: decoded.email }).select({ password: 0 });
    }

    if (!orgData) {
      return res.status(404).json({ 
        success: false,
        message: "Organization not found" 
      });
    }

    req.organization = orgData;
    req.token = jwtToken;
    req.organizationId = orgData._id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error during authentication" 
    });
  }
};

export default authMiddleware;