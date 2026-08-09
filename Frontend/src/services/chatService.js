

// src/services/chatService.js
// Server-minted Stream credentials scoped to a real scheduled interview.
// The browser never chooses the Stream user id.
import apiClient from "./apiClient";

const chatService = {
  /** POST /api/chat/stream-token */
  getStreamToken: async ({ callId, role }) => {
    const { data } = await apiClient.post(
      "/api/chat/stream-token",
      { callId, role },
      {
        // Candidate joins from the emailed public link. Interviewer joins must
        // carry the interviewer JWT so the backend can verify assignment.
        tokenRole: role === "interviewer" ? "interviewer" : "public",
      }
    );

    return data;
    // {
    //   success, apiKey, videoToken, chatToken, user,
    //   callId, scheduleId, applicationId, streamHostId, streamCandidateId
    // }
  },
};

export default chatService;
