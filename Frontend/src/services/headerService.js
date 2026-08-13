import apiClient from "./apiClient";

const headerService = {
  search: async (query) => {
    const { data } = await apiClient.get("/api/header/search", {
      params: { q: query },
    });
    return data;
  },

  getNotifications: async () => {
    const { data } = await apiClient.get("/api/header/notifications");
    return data;
  },

  getContacts: async () => {
    const { data } = await apiClient.get("/api/header/contacts");
    return data;
  },
};

export default headerService;
