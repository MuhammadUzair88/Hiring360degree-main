// src/services/advertisementService.js
// Wraps /api/advertisement/* — job posting CRUD.
import apiClient from "./apiClient";

const advertisementService = {
  /** GET /api/advertisement — all postings for the logged-in organization */
  getAll: async () => {
    const { data } = await apiClient.get("/api/advertisement");
   
    return data; // { success, count, advertisements }
  },

  /** GET /api/advertisement/:advertisementId */
  getById: async (advertisementId) => {
    const { data } = await apiClient.get(`/api/advertisement/${advertisementId}`);
    return data; // { success, advertisement, pamphlet }
  },

  /** POST /api/advertisement/add */
  create: async (payload) => {
    const { data } = await apiClient.post("/api/advertisement/add", payload);
    return data; // { success, advertisement, pamphlet }
  },

  /** PUT /api/advertisement/edit/:advertisementId */
  update: async (advertisementId, payload) => {
    const { data } = await apiClient.put(
      `/api/advertisement/edit/${advertisementId}`,
      payload
    );
    return data;
  },

  /** DELETE /api/advertisement/:advertisementId */
  remove: async (advertisementId) => {
    const { data } = await apiClient.delete(`/api/advertisement/${advertisementId}`);
     
    return data;
  },
};

export default advertisementService;
