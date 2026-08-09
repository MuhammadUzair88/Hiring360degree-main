
import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

const BASE_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Token attachment
// ---------------------------------------------------------------------------
// The backend issues two independent JWT "roles":
//   - organization token  -> most /api/* routes
//   - interviewer token   -> /api/interviewer/dash/*, interviewer login
// Public routes (candidate apply, interview call room, stream token, etc.)
// must NOT receive a token at all.
//
// Route -> token-role resolution is centralized here so individual service
// files never have to think about it.
const INTERVIEWER_ONLY_PATTERNS = [/^\/api\/interviewer\/dash/];

const PUBLIC_PATTERNS = [
 /^\/api\/interviewer\/login(?:\/|$)/,
  /^\/api\/auth\/login/,
  /^\/api\/auth\/register/,
  /^\/api\/form\/apply/,
  /^\/api\/application\/add/,
  /^\/api\/interview\/call/,
  /^\/api\/chat\/stream-token/,
];

function resolveTokenRole(url = "") {
  if (PUBLIC_PATTERNS.some((pattern) => pattern.test(url))) return "public";
  if (INTERVIEWER_ONLY_PATTERNS.some((pattern) => pattern.test(url))) {
    return "interviewer";
  }
  return "organization";
}

apiClient.interceptors.request.use((config) => {
  const url = config.url || "";
  const role = config.tokenRole || resolveTokenRole(url);

  if (role === "public") return config;

  const storageKey =
    role === "interviewer"
      ? STORAGE_KEYS.interviewerToken
      : STORAGE_KEYS.organizationToken;

  const token = localStorage.getItem(storageKey);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------------------------------------
// Response normalization
// ---------------------------------------------------------------------------
// Dispatch a browser event on 401s so a single place (AuthContext) can react
// (e.g. clear stale tokens) without every service needing to know about it.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", {
          detail: {
            url: error.config?.url || "",
            tokenRole:
              error.config?.tokenRole ||
              resolveTokenRole(error.config?.url || ""),
          },
        })
      );
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a consistent, user-friendly error message from any Axios error.
 */
export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (error.response?.data?.message) return error.response.data.message;
  if (typeof error.response?.data === "string") return error.response.data;
  if (error.response?.data?.extraDetails) return error.response.data.extraDetails;
  if (error.message === "Network Error") {
    return "Unable to reach the server. Please check your connection and try again.";
  }
  if (error.message) return error.message;
  return fallback;
}

export default apiClient;
