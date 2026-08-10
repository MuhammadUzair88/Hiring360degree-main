// // context/AuthContext.jsx
// //
// // Coordinates BOTH auth "roles" the app supports — organization and
// // interviewer — as two parallel, independent sessions. All actual network
// // calls live in services/authService.js and services/interviewerService.js;
// // this context only owns state + persistence + exposing simple actions.
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import authService from "../services/authService";
// import interviewerService from "../services/interviewerService";
// import { extractErrorMessage } from "../services/apiClient";
// import { STORAGE_KEYS } from "../utils/constants";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   // ---- Organization session ----------------------------------------------
//   const [orgToken, setOrgToken] = useState(
//     () => localStorage.getItem(STORAGE_KEYS.organizationToken) || ""
//   );
//   const [organization, setOrganization] = useState(null);
//   const [isOrgLoading, setIsOrgLoading] = useState(!!orgToken);

//   // ---- Interviewer session ------------------------------------------------
//   const [interviewerToken, setInterviewerToken] = useState(
//     () => localStorage.getItem(STORAGE_KEYS.interviewerToken) || ""
//   );
//   const [interviewer, setInterviewer] = useState(null);
//   const [isInterviewerLoading, setIsInterviewerLoading] = useState(!!interviewerToken);

//   // ════════════════════════════════
//   // ORGANIZATION AUTH
//   // ════════════════════════════════
//   const persistOrgToken = (serverToken) => {
//     setOrgToken(serverToken);
//     localStorage.setItem(STORAGE_KEYS.organizationToken, serverToken);
//   };

//   const logoutOrganization = useCallback(() => {
//     setOrgToken("");
//     setOrganization(null);
//     localStorage.removeItem(STORAGE_KEYS.organizationToken);
//   }, []);

//   const loginOrganization = useCallback(async (credentials) => {
//     try {
//       const data = await authService.login(credentials);
//       persistOrgToken(data.token);
//       return { success: true, data };
//     } catch (error) {
//       return { success: false, message: extractErrorMessage(error, "Invalid email or password.") };
//     }
//   }, []);

//   const registerOrganization = useCallback(async (payload) => {
//     try {
//       const data = await authService.register(payload);
//       persistOrgToken(data.token);
//       return { success: true, data };
//     } catch (error) {
//       return { success: false, message: extractErrorMessage(error, "Registration failed.") };
//     }
//   }, []);

//   const refreshOrganization = useCallback(async () => {
//     if (!localStorage.getItem(STORAGE_KEYS.organizationToken)) return;
//     setIsOrgLoading(true);
//     try {
//       const data = await authService.getProfile();
//       setOrganization(data);
//     } catch (error) {
//       if (error.response?.status === 401 || error.response?.status === 404) {
//         logoutOrganization();
//       }
//     } finally {
//       setIsOrgLoading(false);
//     }
//   }, [logoutOrganization]);

//   const updateOrganizationProfile = useCallback(async (payload) => {
//     try {
//       const data = await authService.updateProfile(payload);
//       if (data?.organization) setOrganization(data.organization);
//       return { success: true, data };
//     } catch (error) {
//       return { success: false, message: extractErrorMessage(error, "Failed to update profile.") };
//     }
//   }, []);

//   // ════════════════════════════════
//   // INTERVIEWER AUTH
//   // ════════════════════════════════
//   const persistInterviewerToken = (serverToken) => {
//     setInterviewerToken(serverToken);
//     localStorage.setItem(STORAGE_KEYS.interviewerToken, serverToken);
//   };

//   const logoutInterviewer = useCallback(() => {
//     setInterviewerToken("");
//     setInterviewer(null);
//     localStorage.removeItem(STORAGE_KEYS.interviewerToken);
//   }, []);

//   const loginInterviewer = useCallback(async (credentials) => {
//     try {
//       const data = await interviewerService.login(credentials);
      
//       persistInterviewerToken(data.token);
//       if (data.interviewer) setInterviewer(data.interviewer);
//       return { success: true, data };
//     } catch (error) {
//       return { success: false, message: extractErrorMessage(error, "Invalid email or password.") };
//     }
//   }, []);

//   const refreshInterviewer = useCallback(async () => {
//     if (!localStorage.getItem(STORAGE_KEYS.interviewerToken)) return;
//     setIsInterviewerLoading(true);
//     try {
//       const data = await interviewerDashboardProfile();
//       if (data?.interviewer) setInterviewer(data.interviewer);
//     } catch (error) {
//       if (error.response?.status === 401 || error.response?.status === 404) {
//         logoutInterviewer();
//       }
//     } finally {
//       setIsInterviewerLoading(false);
//     }
//   }, [logoutInterviewer]);

//   // Kept as a tiny local import-free helper to avoid a circular import with
//   // interviewerDashboardService (which itself doesn't depend on this file,
//   // but keeping profile-fetch colocated with the rest of the auth check
//   // logic makes the flow easier to follow).
//   const interviewerDashboardProfile = async () => {
//     const { default: interviewerDashboardService } = await import(
//       "../services/interviewerDashboardService"
//     );
//     return interviewerDashboardService.getProfile();
//   };

//   // ════════════════════════════════
//   // Bootstrap sessions on mount + react to 401s from the API client
//   // ════════════════════════════════
//   useEffect(() => {
//     if (orgToken) refreshOrganization();
//     else setIsOrgLoading(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orgToken]);

//   useEffect(() => {
//     if (interviewerToken) refreshInterviewer();
//     else setIsInterviewerLoading(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [interviewerToken]);

//   useEffect(() => {
//     const handleUnauthorized = (event) => {
//       const url = event.detail?.url || "";
//       if (url.includes("/api/interviewer/dash")) {
//         logoutInterviewer();
//       } else if (!url.includes("/api/interview/call")) {
//         logoutOrganization();
//       }
//     };
//     window.addEventListener("auth:unauthorized", handleUnauthorized);
//     return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
//   }, [logoutOrganization, logoutInterviewer]);

//   const value = {
//     // Organization
//     organization,
//     token: orgToken,
//     isLoggedIn: !!orgToken,
//     isOrgLoading,
//     loginOrganization,
//     registerOrganization,
//     logoutOrganization,
//     refreshOrganization,
//     updateOrganizationProfile,

//     // Interviewer
//     interviewer,
//     interviewerToken,
//     isInterviewerLogin: !!interviewerToken,
//     isInterviewerLoading,
//     loginInterviewer,
//     logoutInterviewer,
//     refreshInterviewer,

//     // Combined convenience flag used while the app decides which
//     // (if any) session is active on first paint.
//     isLoading: isOrgLoading || isInterviewerLoading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }


// context/AuthContext.jsx
//
// Coordinates BOTH auth "roles" the app supports — organization and
// interviewer — as two parallel, independent sessions. All actual network
// calls live in services/authService.js and services/interviewerService.js;
// this context only owns state + persistence + exposing simple actions.
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import interviewerService from "../services/interviewerService";
import { extractErrorMessage } from "../services/apiClient";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ---- Organization session ----------------------------------------------
  const [orgToken, setOrgToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.organizationToken) || ""
  );
  const [organization, setOrganization] = useState(null);
  const [isOrgLoading, setIsOrgLoading] = useState(!!orgToken);

  // ---- Interviewer session ------------------------------------------------
  const [interviewerToken, setInterviewerToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.interviewerToken) || ""
  );
  const [interviewer, setInterviewer] = useState(null);
  const [isInterviewerLoading, setIsInterviewerLoading] = useState(!!interviewerToken);

  // ════════════════════════════════
  // ORGANIZATION AUTH
  // ════════════════════════════════
  const persistOrgToken = (serverToken) => {
    setOrgToken(serverToken);
    localStorage.setItem(STORAGE_KEYS.organizationToken, serverToken);
  };

  const logoutOrganization = useCallback(() => {
    setOrgToken("");
    setOrganization(null);
    localStorage.removeItem(STORAGE_KEYS.organizationToken);
  }, []);

  const loginOrganization = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      persistOrgToken(data.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Invalid email or password.") };
    }
  }, []);

  const registerOrganization = useCallback(async (payload) => {
    try {
      const data = await authService.register(payload);
      persistOrgToken(data.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Registration failed.") };
    }
  }, []);

  const refreshOrganization = useCallback(async () => {
    if (!localStorage.getItem(STORAGE_KEYS.organizationToken)) return;
    setIsOrgLoading(true);
    try {
      const data = await authService.getProfile();
      setOrganization(data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        logoutOrganization();
      }
    } finally {
      setIsOrgLoading(false);
    }
  }, [logoutOrganization]);

  const updateOrganizationProfile = useCallback(async (payload) => {
    try {
      const data = await authService.updateProfile(payload);
      if (data?.organization) setOrganization(data.organization);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Failed to update profile.") };
    }
  }, []);

  // ════════════════════════════════
  // INTERVIEWER AUTH
  // ════════════════════════════════
  const persistInterviewerToken = (serverToken) => {
    setInterviewerToken(serverToken);
    localStorage.setItem(STORAGE_KEYS.interviewerToken, serverToken);
  };

  const logoutInterviewer = useCallback(() => {
    setInterviewerToken("");
    setInterviewer(null);
    localStorage.removeItem(STORAGE_KEYS.interviewerToken);
  }, []);

  const loginInterviewer = useCallback(async (credentials) => {
    try {
      const data = await interviewerService.login(credentials);
      
      persistInterviewerToken(data.token);
      if (data.interviewer) setInterviewer(data.interviewer);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Invalid email or password.") };
    }
  }, []);

  const refreshInterviewer = useCallback(async () => {
    if (!localStorage.getItem(STORAGE_KEYS.interviewerToken)) return;
    setIsInterviewerLoading(true);
    try {
      const data = await interviewerDashboardProfile();
      if (data?.interviewer) setInterviewer(data.interviewer);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        logoutInterviewer();
      }
    } finally {
      setIsInterviewerLoading(false);
    }
  }, [logoutInterviewer]);

  // Kept as a tiny local import-free helper to avoid a circular import with
  // interviewerDashboardService (which itself doesn't depend on this file,
  // but keeping profile-fetch colocated with the rest of the auth check
  // logic makes the flow easier to follow).
  const interviewerDashboardProfile = async () => {
    const { default: interviewerDashboardService } = await import(
      "../services/interviewerDashboardService"
    );
    return interviewerDashboardService.getProfile();
  };

  // ════════════════════════════════
  // Bootstrap sessions on mount + react to 401s from the API client
  // ════════════════════════════════
  useEffect(() => {
    if (orgToken) refreshOrganization();
    else setIsOrgLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgToken]);

  useEffect(() => {
    if (interviewerToken) refreshInterviewer();
    else setIsInterviewerLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewerToken]);

  useEffect(() => {
    const handleUnauthorized = (event) => {
      const url = event.detail?.url || "";
      const tokenRole = event.detail?.tokenRole;

      if (
        tokenRole === "interviewer" ||
        url.includes("/api/interviewer/dash")
      ) {
        logoutInterviewer();
        return;
      }

      if (tokenRole === "organization") {
        logoutOrganization();
      }
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logoutOrganization, logoutInterviewer]);

  const value = {
    // Organization
    organization,
    token: orgToken,
    isLoggedIn: !!orgToken,
    isOrgLoading,
    loginOrganization,
    registerOrganization,
    logoutOrganization,
    refreshOrganization,
    updateOrganizationProfile,

    // Interviewer
    interviewer,
    interviewerToken,
    isInterviewerLogin: !!interviewerToken,
    isInterviewerLoading,
    loginInterviewer,
    logoutInterviewer,
    refreshInterviewer,

    // Combined convenience flag used while the app decides which
    // (if any) session is active on first paint.
    isLoading: isOrgLoading || isInterviewerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
