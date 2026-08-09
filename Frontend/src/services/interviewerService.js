// src/services/interviewerService.js
// Wraps /api/interviewer/* — organization-side interviewer management
// plus the interviewer's own login.
import apiClient from "./apiClient";

const interviewerService = {
  /** POST /api/interviewer/login (public, returns interviewer token) */
  login: async ({ email, password }) => {
    const { data } = await apiClient.post(
      "/api/interviewer/login",
      { email, password },
      { tokenRole: "public" }
    );
    return data; // { success, token, interviewer }
  },

  /** GET /api/interviewer — organization's interviewer roster */
  getAll: async () => {
    const { data } = await apiClient.get("/api/interviewer");
    return data; // { success, interviewers }
  },

  /** GET /api/interviewer/:id */
  getById: async (id) => {
    const { data } = await apiClient.get(`/api/interviewer/${id}`);
    return data; // { success, interviewer }
  },

  /** POST /api/interviewer */
  create: async (payload) => {
    const { data } = await apiClient.post("/api/interviewer", payload);
    return data; // { success, message, interviewer }
  },

  /** PUT /api/interviewer/:id */
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/api/interviewer/${id}`, payload);
    return data;
  },

  /** DELETE /api/interviewer/:id */
  remove: async (id) => {
    const { data } = await apiClient.delete(`/api/interviewer/${id}`);
    return data;
  },
};

export default interviewerService;
