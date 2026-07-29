import { chatClient } from "../utils/stream.js";

// controllers/chatController.js
export const getStreamToken = async (req, res) => {
  try {
    const { userId, role, name } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        error: "userId and role are required",
      });
    }

    // Use the userId EXACTLY as passed - DON'T modify it
    const streamUserId = userId; // Already has format like "interviewer_abc123" or "candidate_xyz789"

    console.log("🎫 Generating token for:", streamUserId, "role:", role);

    const token = chatClient.createToken(streamUserId);

    res.status(200).json({
      token,
      userId: streamUserId,
      name,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};