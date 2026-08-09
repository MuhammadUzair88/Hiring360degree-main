


import apiClient from "./apiClient";

const offerLetterService = {
  getOfferedCandidates: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/offer/candidates/${advertisementId}`);
    return data;
  },

  getSettings: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/offer/settings/${advertisementId}`);
    return data;
  },

  updateSettings: async (advertisementId, payload) => {
    const { data } = await apiClient.put(`/api/offer/settings/${advertisementId}`, payload);
    return data;
  },

  getCandidateOfferLetter: async (applicationId) => {
    const { data } = await apiClient.get(`/api/offer/letter/${applicationId}`);
    return data;
  },

  customizeCandidateOfferLetter: async (applicationId, payload) => {
    const { data } = await apiClient.put(`/api/offer/customize/${applicationId}`, payload);
    return data;
  },

  notifyCandidate: async (applicationId, payload = {}) => {
    const { data } = await apiClient.post(`/api/offer/notify/${applicationId}`, payload);
    return data;
  },
};

export default offerLetterService;
