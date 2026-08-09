// src/services/orgDashboardService.js
// Wraps /api/v1/* — the organization's main dashboard & analytics.
import apiClient from "./apiClient";

const orgDashboardService = {
  /** GET /api/v1/dashboard */
  getDashboardData: async () => {
    const { data } = await apiClient.get("/api/v1/dashboard");
    return data;
  },

  /** GET /api/v1/schedule/:date */
  getScheduleByDate: async (date) => {
    const { data } = await apiClient.get(`/api/v1/schedule/${date}`);
    return data;
  },

  /** GET /api/v1/interview/:applicationId */
  getInterviewDetails: async (applicationId) => {
    const { data } = await apiClient.get(`/api/v1/interview/${applicationId}`);
    return data;
  },

  /** GET /api/v1/analytics/applications */
  getApplicationAnalytics: async () => {
    const { data } = await apiClient.get("/api/v1/analytics/applications");
    return data;
  },

  /** GET /api/v1/analytics/pipeline */
  getPipelineMetrics: async () => {
    const { data } = await apiClient.get("/api/v1/analytics/pipeline");
    return data;
  },

  /** GET /api/v1/analytics/interviewers */
  getInterviewerMetrics: async () => {
    const { data } = await apiClient.get("/api/v1/analytics/interviewers");
    return data;
  },
};

export default orgDashboardService;
