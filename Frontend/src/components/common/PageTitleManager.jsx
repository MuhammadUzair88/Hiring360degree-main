import React, { useEffect, useMemo } from "react";
import {
  matchPath,
  useLocation,
} from "react-router-dom";

const APP_NAME = "Hiring360°";

/*
 * Order matters:
 * Put more-specific routes BEFORE generic routes.
 */
const PAGE_TITLES = [
  // =====================================================
  // PUBLIC / AUTH
  // =====================================================

  {
    path: "/login",
    title: "Organization Sign In",
  },
  {
    path: "/register",
    title: "Create Organization",
  },
  {
    path: "/interviewers/login",
    title: "Interviewer Sign In",
  },

  // =====================================================
  // LIVE INTERVIEW
  // =====================================================

  {
    path: "/interview/:callId",
    title: "Interview Room",
  },

  // =====================================================
  // INTERVIEWER PORTAL
  // =====================================================

  {
    path: "/interviewers/dashboard",
    title: "Interviewer Dashboard",
  },
  {
    path: "/interviewers/conduct-interviews",
    title: "Conduct Interviews",
  },
  {
    path: "/interviewers/conduct-interviews/:id",
    title: "Candidate Interview",
  },
  {
    path: "/interviewers/conduct-interviews/:id/:section",
    title: "Candidate Interview",
  },
  {
    path: "/interviewers/evaluation",
    title: "Candidate Evaluations",
  },
  {
    path: "/interviewers/evaluation/:id",
    title: "Candidate Evaluation",
  },

  // =====================================================
  // ORGANIZATION — ADVERTISEMENTS
  // =====================================================

  {
    path: "/advertisement/add",
    title: "Post New Job",
  },
  {
    path: "/advertisement",
    title: "Job Advertisements",
  },

  // Candidate intake
  {
    path: "/advertisement/job/:jobId/candidate-intake",
    title: "Candidate Intake",
  },
  {
    path: "/advertisement/job/:jobId/candidate-intake/:applicationId",
    title: "Candidate Analysis",
  },

  // Interview pipeline / rounds
  {
    path: "/advertisement/job/:jobId/rounds",
    title: "Interview Rounds",
  },
  {
    path: "/advertisement/job/:jobId/interview-rounds",
    title: "Interview Rounds",
  },

  // Pamphlet
  {
    path: "/advertisement/job/:jobId/pamphlet",
    title: "Job Pamphlet",
  },

  // Offer letters
  {
    path: "/advertisement/job/:jobId/offer-letter/:applicationId/edit",
    title: "Edit Offer Letter",
  },
  {
    path: "/advertisement/job/:jobId/offer-letter",
    title: "Offer Letters",
  },

  // Generic job page — keep after specific job pages
  {
    path: "/advertisement/job/:jobId",
    title: "Job Details",
  },

  // =====================================================
  // ORGANIZATION — INTERVIEWERS
  // =====================================================

  {
    path: "/interviewer/add",
    title: "Add Interviewer",
  },
  {
    path: "/interviewer/:id/edit",
    title: "Edit Interviewer",
  },
  {
    path: "/interviewer",
    title: "Interviewers",
  },

  // =====================================================
  // ORGANIZATION — OTHER
  // =====================================================

  {
    path: "/connect-account",
    title: "Connected Accounts",
  },
  {
    path: "/settings",
    title: "Settings",
  },

  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    path: "/",
    title: "Hiring360",
  },
];

function getStaticPageTitle(pathname) {
  const matchedRoute =
    PAGE_TITLES.find((route) =>
      matchPath(
        {
          path: route.path,
          end: true,
        },
        pathname
      )
    );

  return matchedRoute?.title || null;
}

function prettifySegment(value = "") {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function getFallbackTitle(pathname) {
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return "Hiring360";
  }

  /*
   * Avoid using Mongo IDs / application IDs as browser titles.
   */
  const lastReadableSegment = [...segments]
    .reverse()
    .find(
      (segment) =>
        !/^[a-f0-9]{24}$/i.test(segment) &&
        !segment.startsWith("interview_")
    );

  return lastReadableSegment
    ? prettifySegment(lastReadableSegment)
    : "Hiring Workspace";
}

export default function PageTitleManager() {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    /*
     * Special handling for interview room.
     *
     * Your interview URLs already contain:
     * ?role=interviewer&name=...
     */
    const interviewMatch = matchPath(
      {
        path: "/interview/:callId",
        end: true,
      },
      location.pathname
    );

    if (interviewMatch) {
      const params = new URLSearchParams(
        location.search
      );

      const participantName =
        params.get("name")?.trim();

      const role =
        params.get("role")?.trim();

      if (participantName) {
        if (role === "interviewer") {
          return `Interview with ${participantName}`;
        }

        if (role === "candidate") {
          return `${participantName} - Interview`;
        }
      }

      return "Interview Room";
    }

    return (
      getStaticPageTitle(location.pathname) ||
      getFallbackTitle(location.pathname)
    );
  }, [
    location.pathname,
    location.search,
  ]);

  useEffect(() => {
    document.title =
      `${pageTitle} | ${APP_NAME}`;
  }, [pageTitle]);

  return null;
}
