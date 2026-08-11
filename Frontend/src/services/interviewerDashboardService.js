// src/services/interviewerDashboardService.js
// Real interviewer-workspace API client. No mock/dummy data is used here.
import apiClient from "./apiClient";

const interviewerDashboardService = {
  getProfile: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/profile");
    return data;
  },

  getOrganization: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/organization");
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get("/api/interviewer/dash/dashboard/stats");
    return data;
  },

  getChart: async (params = {}) => {
    const { data } = await apiClient.get("/api/interviewer/dash/dashboard/chart", {
      params,
    });
    return data;
  },

  getRecentInterviews: async (params = {}) => {
    const { data } = await apiClient.get(
      "/api/interviewer/dash/dashboard/recent-interviews",
      { params }
    );
    return data;
  },

  getLiveInterviews: async () => {
    const { data } = await apiClient.get(
      "/api/interviewer/dash/dashboard/live-interviews"
    );
    return data;
  },

  getCandidates: async (params = {}) => {
    const { data } = await apiClient.get("/api/interviewer/dash/candidates", {
      params,
    });
    return data;
  },

  getCandidateById: async (id) => {
    const { data } = await apiClient.get(`/api/interviewer/dash/candidates/${id}`);
    return data;
  },

  getEvaluations: async (params = {}) => {
    const { data } = await apiClient.get("/api/interviewer/dash/evaluations", {
      params,
    });
    return data;
  },

  getEvaluationById: async (id) => {
    const { data } = await apiClient.get(`/api/interviewer/dash/evaluations/${id}`);
    return data;
  },

  submitEvaluation: async (id, payload) => {
    const { data } = await apiClient.post(
      `/api/interviewer/dash/evaluations/${id}`,
      payload
    );
    return data;
  },
};

export default interviewerDashboardService;
