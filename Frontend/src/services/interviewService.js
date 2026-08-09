
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
    return data;
  },

  /** PATCH /api/interview/schedule/:scheduleId/cancel */
  cancelSchedule: async (scheduleId) => {
    const { data } = await apiClient.patch(`/api/interview/schedule/${scheduleId}/cancel`);
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

  // ---- Live call room ---------------------------------------------------

  /** GET /api/interview/call/:callId/details */
  getCallDetails: async (callId) => {
    const { data } = await apiClient.get(`/api/interview/call/${callId}/details`, {
      tokenRole: "public",
    });
    return data;
  },

  /** POST /api/interview/call/:callId/started — assigned interviewer only */
  markCallStarted: async (callId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/started`,
      {},
      { tokenRole: "interviewer" }
    );
    return data;
  },

  // Moderator actions are NOT public. Passing tokenRole explicitly makes the
  // Axios interceptor attach the interviewer JWT even though the candidate
  // details/started routes remain public.
  grantPermissions: async (callId, payload) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/grant-permissions`,
      payload,
      { tokenRole: "interviewer" }
    );
    return data;
  },

  revokePermissions: async (callId, payload) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/revoke-permissions`,
      payload,
      { tokenRole: "interviewer" }
    );
    return data;
  },

  admitCandidate: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/admit/${userId}`,
      {},
      { tokenRole: "interviewer" }
    );
    return data;
  },

  removeParticipant: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/remove/${userId}`,
      {},
      { tokenRole: "interviewer" }
    );
    return data;
  },

  muteParticipant: async (callId, userId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/mute/${userId}`,
      {},
      { tokenRole: "interviewer" }
    );
    return data;
  },

  endCall: async (callId) => {
    const { data } = await apiClient.post(
      `/api/interview/call/${callId}/end`,
      {},
      { tokenRole: "interviewer" }
    );
    return data;
  },
};

export default interviewService;
