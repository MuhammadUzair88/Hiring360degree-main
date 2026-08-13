// // src/services/authService.js
// // Wraps /api/auth/* (organization authentication).
// import apiClient from "./apiClient";

// const authService = {
//   /** POST /api/auth/login */
//   login: async ({ email, password }) => {
//     const { data } = await apiClient.post(
//       "/api/auth/login",
//       { email, password },
//       { tokenRole: "public" }
//     );
//     return data; // { message, token, organizationId }
//   },

//   /** POST /api/auth/register */
//   register: async (payload) => {
//     const { data } = await apiClient.post("/api/auth/register", payload, {
//       tokenRole: "public",
//     });
//     return data; // { message, token, organizationId }
//   },

//   /** GET /api/auth/organization — current logged-in organization profile */
//   getProfile: async () => {
//     const { data } = await apiClient.get("/api/auth/organization");
//     return data;
//   },

//   /** PUT /api/auth/organization/update */
//   updateProfile: async (payload) => {
//     const { data } = await apiClient.put("/api/auth/organization/update", payload);
//     return data; // { success, message, organization }
//   },
// };

// export default authService;



// src/services/authService.js
// Wraps /api/auth/* (organization authentication + settings).
import apiClient from "./apiClient";

const authService = {
  /** POST /api/auth/login */
  login: async ({ email, password }) => {
    const { data } = await apiClient.post(
      "/api/auth/login",
      { email, password },
      { tokenRole: "public" }
    );
    return data;
  },

  /** POST /api/auth/register */
  register: async (payload) => {
    const { data } = await apiClient.post("/api/auth/register", payload, {
      tokenRole: "public",
    });
    return data;
  },

  /** GET /api/auth/organization */
  getProfile: async () => {
    const { data } = await apiClient.get("/api/auth/organization");
    return data;
  },

  /** PUT /api/auth/organization/update */
  updateProfile: async (payload) => {
    const { data } = await apiClient.put("/api/auth/organization/update", payload);
    return data;
  },

  /** PUT /api/auth/organization/password */
  updatePassword: async ({ currentPassword, newPassword }) => {
    const { data } = await apiClient.put("/api/auth/organization/password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

export default authService;
