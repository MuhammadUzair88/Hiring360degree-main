// src/services/pipelineService.js
// Wraps /api/round/* — interview pipeline (rounds) configuration for a job.
import apiClient from "./apiClient";

const pipelineService = {
  /** GET /api/round/:advertisementId */
  getPipeline: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/round/${advertisementId}`);
    return data; // { success, pipeline }
  },

  /** POST /api/round/add/:advertisementId */
  createPipeline: async (advertisementId, payload) => {
    const { data } = await apiClient.post(`/api/round/add/${advertisementId}`, payload);
    return data;
  },
};

export default pipelineService;
