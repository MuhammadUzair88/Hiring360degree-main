// src/services/chatService.js
// Wraps /api/chat/* — Stream (video/chat) token issuance for the live
// interview room. Public: anyone joining a call (candidate or interviewer)
// needs a token before they have necessarily logged in to either portal.
import apiClient from "./apiClient";

const chatService = {
  /** POST /api/chat/stream-token */
  getStreamToken: async ({ userId, userName }) => {
    const { data } = await apiClient.post(
      "/api/chat/stream-token",
      { userId, userName },
      { tokenRole: "public" }
    );
    return data; // { success, token }
  },
};

export default chatService;
