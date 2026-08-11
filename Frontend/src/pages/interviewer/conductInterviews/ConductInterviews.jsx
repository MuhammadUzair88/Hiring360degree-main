// src/pages/interviewer/conductInterviews/ConductInterviews.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConductInterviewOverview from "../../../components/interviewer/conductInterviews/ConductInterviewOverview";
import { useAuth } from "../../../context/AuthContext";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

const REFRESH_INTERVAL_MS = 15000;

function capitalize(value = "") {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function ConductInterviews() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewer } = useAuth();
  const mountedRef = useRef(true);

  const [organization, setOrganization] = useState(null);
  const [profile, setProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoster = useCallback(async ({ initial = false } = {}) => {
    if (initial) setLoading(true);
    setError(null);

    try {
      const [orgData, profileData, candidatesData] = await Promise.all([
        interviewerDashboardService.getOrganization(),
        interviewerDashboardService.getProfile(),
        interviewerDashboardService.getCandidates(),
      ]);

      if (!mountedRef.current) return;

      setOrganization(orgData?.organization || null);
      setProfile(profileData?.interviewer || null);
      setInterviews(candidatesData?.candidates || []);
    } catch (requestError) {
      if (mountedRef.current) {
        setError(
          extractErrorMessage(
            requestError,
            "Failed to load your interview schedule."
          )
        );
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadRoster({ initial: true });

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadRoster();
      }
    }, REFRESH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRoster();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadRoster]);

  const initialStatusFilter = location.state?.filter
    ? capitalize(location.state.filter)
    : null;

  const handleJoinInterview = (interviewItem) => {
    if (interviewItem.callId) {
      navigate(`/interview/${interviewItem.callId}`);
      return;
    }

    if (interviewItem.joinLink) {
      window.open(interviewItem.joinLink, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(`/interviewers/conduct-interviews/${interviewItem.scheduleId}`);
  };

  return (
    <ConductInterviewOverview
      organization={organization || {}}
      interviewer={{
        name: profile?.name || interviewer?.name || "Interviewer",
      }}
      interviews={interviews}
      loading={loading}
      error={error}
      initialStatusFilter={initialStatusFilter}
      onRefresh={() => loadRoster()}
      onJoinInterview={handleJoinInterview}
    />
  );
}
