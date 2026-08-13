
// context/AuthContext.jsx

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";
import interviewerService from "../services/interviewerService";
import { extractErrorMessage } from "../services/apiClient";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  // =====================================================
  // ORGANIZATION SESSION
  // =====================================================

  const [
    orgToken,
    setOrgToken,
  ] = useState(
    () =>
      localStorage.getItem(
        STORAGE_KEYS.organizationToken
      ) || ""
  );

  const [
    organization,
    setOrganization,
  ] = useState(null);

  /*
   * Full-screen organization loading should only be used
   * during initial auth/session validation.
   */
  const [
    isOrgLoading,
    setIsOrgLoading,
  ] = useState(Boolean(orgToken));

  // =====================================================
  // INTERVIEWER SESSION
  // =====================================================

  const [
    interviewerToken,
    setInterviewerToken,
  ] = useState(
    () =>
      localStorage.getItem(
        STORAGE_KEYS.interviewerToken
      ) || ""
  );

  const [
    interviewer,
    setInterviewer,
  ] = useState(null);

  const [
    isInterviewerLoading,
    setIsInterviewerLoading,
  ] = useState(
    Boolean(interviewerToken)
  );

  // =====================================================
  // TOKEN HELPERS
  // =====================================================

  const persistOrgToken =
    useCallback(
      (serverToken) => {
        if (!serverToken) return;

        localStorage.setItem(
          STORAGE_KEYS.organizationToken,
          serverToken
        );

        setOrgToken(serverToken);
      },
      []
    );

  const persistInterviewerToken =
    useCallback(
      (serverToken) => {
        if (!serverToken) return;

        localStorage.setItem(
          STORAGE_KEYS.interviewerToken,
          serverToken
        );

        setInterviewerToken(
          serverToken
        );
      },
      []
    );

  // =====================================================
  // ORGANIZATION LOGOUT
  // =====================================================

  const logoutOrganization =
    useCallback(() => {
      localStorage.removeItem(
        STORAGE_KEYS.organizationToken
      );

      setOrgToken("");
      setOrganization(null);
      setIsOrgLoading(false);
    }, []);

  // =====================================================
  // ORGANIZATION LOGIN
  // =====================================================

  const loginOrganization =
    useCallback(
      async (credentials) => {
        try {
          const data =
            await authService.login(
              credentials
            );

          if (!data?.token) {
            return {
              success: false,
              message:
                "Authentication token was not returned by the server.",
            };
          }

          /*
           * If login response already contains organization data,
           * keep it immediately to avoid unnecessary empty state.
           */
          if (data.organization) {
            setOrganization(
              data.organization
            );
          }

          persistOrgToken(
            data.token
          );

          return {
            success: true,
            data,
          };
        } catch (error) {
          return {
            success: false,
            message:
              extractErrorMessage(
                error,
                "Invalid email or password."
              ),
          };
        }
      },
      [persistOrgToken]
    );

  // =====================================================
  // ORGANIZATION REGISTER
  // =====================================================

  const registerOrganization =
    useCallback(
      async (payload) => {
        try {
          const data =
            await authService.register(
              payload
            );

          if (!data?.token) {
            return {
              success: false,
              message:
                "Registration succeeded but no authentication token was returned.",
            };
          }

          if (data.organization) {
            setOrganization(
              data.organization
            );
          }

          persistOrgToken(
            data.token
          );

          return {
            success: true,
            data,
          };
        } catch (error) {
          return {
            success: false,
            message:
              extractErrorMessage(
                error,
                "Registration failed."
              ),
          };
        }
      },
      [persistOrgToken]
    );

  // =====================================================
  // ORGANIZATION REFRESH
  // =====================================================

  /*
   * `showLoader` defaults to false.
   *
   * This is VERY important.
   * Profile refreshes from Settings/Header should NOT
   * trigger ProtectedRoute's full-screen loader.
   */
  const refreshOrganization =
    useCallback(
      async ({
        showLoader = false,
      } = {}) => {
        const storedToken =
          localStorage.getItem(
            STORAGE_KEYS.organizationToken
          );

        if (!storedToken) {
          if (showLoader) {
            setIsOrgLoading(false);
          }

          return null;
        }

        if (showLoader) {
          setIsOrgLoading(true);
        }

        try {
          const data =
            await authService.getProfile();

          /*
           * Support either backend response shape:
           *
           * { organization: {...} }
           *
           * OR
           *
           * {...organization fields}
           */
          const nextOrganization =
            data?.organization ||
            data ||
            null;

          if (
            nextOrganization &&
            typeof nextOrganization ===
              "object"
          ) {
            setOrganization(
              nextOrganization
            );
          }

          return nextOrganization;
        } catch (error) {
          const status =
            error?.response?.status;

          if (
            status === 401 ||
            status === 404
          ) {
            logoutOrganization();
          }

          throw error;
        } finally {
          if (showLoader) {
            setIsOrgLoading(false);
          }
        }
      },
      [logoutOrganization]
    );

  // =====================================================
  // UPDATE ORGANIZATION PROFILE
  // =====================================================

  const updateOrganizationProfile =
    useCallback(
      async (payload) => {
        try {
          const data =
            await authService.updateProfile(
              payload
            );

          const updatedOrganization =
            data?.organization ||
            data;

          if (
            updatedOrganization &&
            typeof updatedOrganization ===
              "object"
          ) {
            setOrganization(
              updatedOrganization
            );
          }

          return {
            success: true,
            data,
          };
        } catch (error) {
          return {
            success: false,
            message:
              extractErrorMessage(
                error,
                "Failed to update profile."
              ),
          };
        }
      },
      []
    );

  // =====================================================
  // INTERVIEWER LOGOUT
  // =====================================================

  const logoutInterviewer =
    useCallback(() => {
      localStorage.removeItem(
        STORAGE_KEYS.interviewerToken
      );

      setInterviewerToken("");
      setInterviewer(null);
      setIsInterviewerLoading(
        false
      );
    }, []);

  // =====================================================
  // INTERVIEWER LOGIN
  // =====================================================

  const loginInterviewer =
    useCallback(
      async (credentials) => {
        try {
          const data =
            await interviewerService.login(
              credentials
            );

          if (!data?.token) {
            return {
              success: false,
              message:
                "Authentication token was not returned.",
            };
          }

          if (data.interviewer) {
            setInterviewer(
              data.interviewer
            );
          }

          persistInterviewerToken(
            data.token
          );

          return {
            success: true,
            data,
          };
        } catch (error) {
          return {
            success: false,
            message:
              extractErrorMessage(
                error,
                "Invalid email or password."
              ),
          };
        }
      },
      [
        persistInterviewerToken,
      ]
    );

  // =====================================================
  // INTERVIEWER DASHBOARD PROFILE HELPER
  // =====================================================

  const interviewerDashboardProfile =
    useCallback(async () => {
      const {
        default:
          interviewerDashboardService,
      } = await import(
        "../services/interviewerDashboardService"
      );

      return interviewerDashboardService.getProfile();
    }, []);

  // =====================================================
  // REFRESH INTERVIEWER
  // =====================================================

  const refreshInterviewer =
    useCallback(
      async ({
        showLoader = false,
      } = {}) => {
        const storedToken =
          localStorage.getItem(
            STORAGE_KEYS.interviewerToken
          );

        if (!storedToken) {
          if (showLoader) {
            setIsInterviewerLoading(
              false
            );
          }

          return null;
        }

        if (showLoader) {
          setIsInterviewerLoading(
            true
          );
        }

        try {
          const data =
            await interviewerDashboardProfile();

          const nextInterviewer =
            data?.interviewer ||
            data ||
            null;

          if (nextInterviewer) {
            setInterviewer(
              nextInterviewer
            );
          }

          return nextInterviewer;
        } catch (error) {
          const status =
            error?.response?.status;

          if (
            status === 401 ||
            status === 404
          ) {
            logoutInterviewer();
          }

          throw error;
        } finally {
          if (showLoader) {
            setIsInterviewerLoading(
              false
            );
          }
        }
      },
      [
        interviewerDashboardProfile,
        logoutInterviewer,
      ]
    );

  // =====================================================
  // INITIAL ORGANIZATION SESSION BOOTSTRAP
  // =====================================================

  useEffect(() => {
    if (!orgToken) {
      setIsOrgLoading(false);
      return;
    }

    let cancelled = false;

    const bootstrap =
      async () => {
        try {
          await refreshOrganization({
            showLoader: true,
          });
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Organization session bootstrap failed:",
              error
            );
          }
        }
      };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    orgToken,
    refreshOrganization,
  ]);

  // =====================================================
  // INITIAL INTERVIEWER SESSION BOOTSTRAP
  // =====================================================

  useEffect(() => {
    if (!interviewerToken) {
      setIsInterviewerLoading(
        false
      );

      return;
    }

    let cancelled = false;

    const bootstrap =
      async () => {
        try {
          await refreshInterviewer({
            showLoader: true,
          });
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Interviewer session bootstrap failed:",
              error
            );
          }
        }
      };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    interviewerToken,
    refreshInterviewer,
  ]);

  // =====================================================
  // GLOBAL 401 HANDLER
  // =====================================================

  useEffect(() => {
    const handleUnauthorized = (
      event
    ) => {
      const url =
        event.detail?.url ||
        "";

      const tokenRole =
        event.detail?.tokenRole;

      if (
        tokenRole ===
          "interviewer" ||
        url.includes(
          "/api/interviewer/dash"
        )
      ) {
        logoutInterviewer();
        return;
      }

      if (
        tokenRole ===
        "organization"
      ) {
        logoutOrganization();
      }
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, [
    logoutOrganization,
    logoutInterviewer,
  ]);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = useMemo(
    () => ({
      // Organization
      organization,

      token: orgToken,

      isLoggedIn:
        Boolean(orgToken),

      isOrgLoading,

      loginOrganization,

      registerOrganization,

      logoutOrganization,

      refreshOrganization,

      updateOrganizationProfile,

      // Interviewer
      interviewer,

      interviewerToken,

      isInterviewerLogin:
        Boolean(
          interviewerToken
        ),

      isInterviewerLoading,

      loginInterviewer,

      logoutInterviewer,

      refreshInterviewer,

      // Combined
      isLoading:
        isOrgLoading ||
        isInterviewerLoading,
    }),
    [
      organization,
      orgToken,
      isOrgLoading,
      loginOrganization,
      registerOrganization,
      logoutOrganization,
      refreshOrganization,
      updateOrganizationProfile,
      interviewer,
      interviewerToken,
      isInterviewerLoading,
      loginInterviewer,
      logoutInterviewer,
      refreshInterviewer,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}