// src/services/offerLetterService.js
// Wraps /api/offer/* — offer letter studio.
import apiClient from "./apiClient";

const offerLetterService = {
  /** GET /api/offer/candidates/:advertisementId — candidates ready for an offer */
  getOfferedCandidates: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/offer/candidates/${advertisementId}`);
    return data;
  },

  /** GET /api/offer/settings/:advertisementId — job-level offer letter template settings */
  getSettings: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/offer/settings/${advertisementId}`);
    return data;
  },

  /** PUT /api/offer/settings/:advertisementId */
  updateSettings: async (advertisementId, payload) => {
    const { data } = await apiClient.put(`/api/offer/settings/${advertisementId}`, payload);
    return data;
  },

  /** GET /api/offer/letter/:applicationId — one candidate's offer letter */
  getCandidateOfferLetter: async (applicationId) => {
    const { data } = await apiClient.get(`/api/offer/letter/${applicationId}`);
    return data;
  },

  /** PUT /api/offer/customize/:applicationId */
  customizeCandidateOfferLetter: async (applicationId, payload) => {
    const { data } = await apiClient.put(`/api/offer/customize/${applicationId}`, payload);
    return data;
  },

  /** POST /api/offer/notify/:applicationId — email the offer letter to the candidate */
  notifyCandidate: async (applicationId, payload) => {
    const { data } = await apiClient.post(`/api/offer/notify/${applicationId}`, payload);
    return data;
  },
};

export default offerLetterService;
