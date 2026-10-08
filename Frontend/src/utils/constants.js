// src/utils/constants.js

export const STORAGE_KEYS = {
  organizationToken: "h360_org_token",
  interviewerToken: "h360_interviewer_token",
};

export const USER_ROLES = {
  ORGANIZATION: "organization",
  INTERVIEWER: "interviewer",
};

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  REJECTED: "rejected",
  BOOKMARKED: "bookmarked",
  OFFERED: "offered",
};

export const INTERVIEW_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const ADVERTISEMENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CLOSED: "closed",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  INTERVIEWER_LOGIN: "/interviewers/login",
  INTERVIEWER_DASHBOARD: "/interviewers/dashboard",
};
