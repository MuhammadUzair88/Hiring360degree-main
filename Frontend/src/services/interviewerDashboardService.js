// src/services/interviewerDashboardService.js
// Wraps /api/interviewer/dash/* — everything on the interviewer's own
// workspace (dashboard, conduct interviews, evaluation).
import apiClient from "./apiClient";

const interviewerDashboardService = {
  /** GET /api/interviewer/dash/profile */
  getProfile: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/profile");
    return data;
  },

  /** GET /api/interviewer/dash/organization */
  getOrganization: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/organization");
    return data;
  },

  /** GET /api/interviewer/dash/dashboard/stats */
  getStats: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/dashboard/stats");
    return data;
  },

  /** GET /api/interviewer/dash/dashboard/chart */
  getChart: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/dashboard/chart");
    return data;
  },

  /** GET /api/interviewer/dash/dashboard/recent-interviews */
  getRecentInterviews: async () => {
    const { data } = await apiClient.get(
      "/api/interviewer/dash/dashboard/recent-interviews"
    );
    return data;
  },

  /** GET /api/interviewer/dash/dashboard/live-interviews */
  getLiveInterviews: async () => {
    const { data } = await apiClient.get(
      "/api/interviewer/dash/dashboard/live-interviews"
    );
    return data;
  },

  /** GET /api/interviewer/dash/candidates */
  getCandidates: async (params) => {
    const { data } = await apiClient.get("/api/interviewer/dash/candidates", { params });
    return data;
  },

  /** GET /api/interviewer/dash/candidates/:id */
  getCandidateById: async (id) => {
    const { data } = await apiClient.get(`/api/interviewer/dash/candidates/${id}`);
    return data;
  },

  /** GET /api/interviewer/dash/evaluations */
  getEvaluations: async (params) => {
    const { data } = await apiClient.get("/api/interviewer/dash/evaluations", { params });
    return data;
  },

  /** GET /api/interviewer/dash/evaluations/:id */
  getEvaluationById: async (id) => {
    const { data } = await apiClient.get(`/api/interviewer/dash/evaluations/${id}`);
    return data;
  },

  /** POST /api/interviewer/dash/evaluations/:id */
  submitEvaluation: async (id, payload) => {
    const { data } = await apiClient.post(`/api/interviewer/dash/evaluations/${id}`, payload);
    return data;
  },
};

export default interviewerDashboardService;
