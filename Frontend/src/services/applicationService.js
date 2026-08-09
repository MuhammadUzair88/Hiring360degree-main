// src/services/applicationService.js
// Wraps /api/application/* — candidate applications pipeline (intake stage).
import apiClient from "./apiClient";

const applicationService = {
  /** POST /api/application/add/:advertisementId (public — candidate submits) */
  submit: async (advertisementId, payload) => {
    const { data } = await apiClient.post(
      `/api/application/add/${advertisementId}`,
      payload,
      { tokenRole: "public" }
    );
    return data; // { success, message, application }
  },

  /** GET /api/application/get/:advertisementId — all applicants for a job */
  getByAdvertisement: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/application/get/${advertisementId}`);
 
    return data;
  },

  /** GET /api/application/getsingle/:applicationId */
  getById: async (applicationId) => {
    const { data } = await apiClient.get(`/api/application/getsingle/${applicationId}`);
    return data;
  },

  /** GET /api/application/stats/:advertisementId */
  getStats: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/application/stats/${advertisementId}`);
    return data;
  },

  /** POST /api/application/analyze/:applicationId — trigger AI resume analysis */
  analyzeResume: async (applicationId) => {
    const { data } = await apiClient.post(`/api/application/analyze/${applicationId}`);
    return data;
  },

  /** PUT /api/application/bookmark/:applicationId */
  bookmark: async (applicationId) => {
    const { data } = await apiClient.put(`/api/application/bookmark/${applicationId}`);
    return data;
  },

  /** PUT /api/application/shortlist/:applicationId */
  shortlist: async (applicationId) => {
    const { data } = await apiClient.put(`/api/application/shortlist/${applicationId}`);
    return data;
  },

  /** PUT /api/application/reject/:applicationId */
  reject: async (applicationId, reason) => {
    const { data } = await apiClient.put(`/api/application/reject/${applicationId}`, {
      reason,
    });
    return data;
  },

  /** PUT /api/application/move/:applicationId — move candidate into "applied" pool */
  moveToApplied: async (applicationId) => {
    const { data } = await apiClient.put(`/api/application/move/${applicationId}`);
    return data;
  },
};

export default applicationService;
