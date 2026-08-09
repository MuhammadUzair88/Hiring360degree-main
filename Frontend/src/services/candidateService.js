// src/services/candidateService.js
// Wraps /api/form/* — public candidate-facing endpoints used by the
// "apply to this job" page. No auth token is ever sent here.
import apiClient from "./apiClient";

const candidateService = {
  /** GET /api/form/apply/:id — job details shown on the public apply page */
  getJobById: async (id) => {
    const { data } = await apiClient.get(`/api/form/apply/${id}`, {
      tokenRole: "public",
    });
    return data; // { success, job }
  },
};

export default candidateService;
