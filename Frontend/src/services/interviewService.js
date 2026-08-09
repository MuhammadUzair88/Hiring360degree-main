// src/services/interviewService.js
// Wraps /api/interview/* — scheduling (organization-authenticated) and the
// live call room (public, since candidates join without an account).
import apiClient from "./apiClient";

const interviewService = {
  // ---- Scheduling (organization token) ----------------------------------

  /** GET /api/interview/check-availability?interviewerId=&date=&time= */
  checkAvailability: async (params) => {
    const { data } = await apiClient.get("/api/interview/check-availability", {
      params,
    });
    return data;
  },

  /** POST /api/interview/schedule */
  schedule: async (payload) => {
    const { data } = await apiClient.post("/api/interview/schedule", payload);
    return data;
  },

  /** PUT /api/interview/schedule/:scheduleId */
  updateSchedule: async (scheduleId, payload) => {
    
    const { data } = await apiClient.put(`/api/interview/schedule/${scheduleId}`, payload);
  
    return data;
  },

  /** GET /api/interview/schedule/:advertisementId — every scheduled interview for a job */
  getJobSchedules: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/interview/schedule/${advertisementId}`);
      console.log(data)
    return data;
  },

  /** POST /api/interview/resend-email/:scheduleId */
  resendEmail: async (scheduleId) => {
    const { data } = await apiClient.post(`/api/interview/resend-email/${scheduleId}`);
    return data;
  },

  /** PATCH /api/interview/decision/:scheduleId — advance/reject after a round */
  decideRoundOutcome: async (scheduleId, payload) => {
    const { data } = await apiClient.patch(`/api/interview/decision/${scheduleId}`, payload);
    return data;
  },

  /** GET /api/interview/round-pool/:advertisementId/:roundIndex */
  getRoundCandidates: async (advertisementId, roundIndex) => {
    const { data } = await apiClient.get(
      `/api/interview/round-pool/${advertisementId}/${roundIndex}`
    );
    return data;
  },

  // ---- Live call room (public — candidate + interviewer both use these) --

  /** GET /api/interview/call/:callId/details */
  getCallDetails: async (callId) => {
    const { data } = await apiClient.get(`/api/interview/call/${callId}/details`, {
      tokenRole: "public",
    });
    return data;
  },

  /** POST /api/interview/call/:callId/grant-permissions */
  grantPermissions: async (callId, payload) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/grant-permissions`,
      payload,
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/interview/call/:callId/revoke-permissions */
  revokePermissions: async (callId, payload) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/revoke-permissions`,
      payload,
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/interview/call/:callId/admit/:userId */
  admitCandidate: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/admit/${userId}`,
      {},
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/interview/call/:callId/remove/:userId */
  removeParticipant: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/remove/${userId}`,
      {},
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/interview/call/:callId/mute/:userId */
  muteParticipant: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/mute/${userId}`,
      {},
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/interview/call/:callId/end */
  endCall: async (callId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/end`,
      {},
      { tokenRole: "public" }
    );
    return data;
  },
};

export default interviewService;
