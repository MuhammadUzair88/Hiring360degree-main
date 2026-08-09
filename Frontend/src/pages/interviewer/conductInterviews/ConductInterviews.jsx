// src/pages/interviewer/conductInterviews/ConductInterviews.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConductInterviewOverview from "../../../components/interviewer/conductInterviews/ConductInterviewOverview";
import { useAuth } from "../../../context/AuthContext";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** Route: /interviewers/conduct-interviews */
export default function ConductInterviews() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewer } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [orgData, candidatesData] = await Promise.all([
          interviewerDashboardService.getOrganization(),
          interviewerDashboardService.getCandidates(),
        ]);
        if (!isActive) return;
        setOrganization(orgData.organization);
        // Joining a call needs the schedule's callId, which this list
        // endpoint doesn't return — the Join action routes to the
        // candidate detail page instead, where the real call link lives.
        setInterviews((candidatesData.candidates || []).map((item) => ({ ...item, joinLink: null })));
      } catch (err) {
        if (isActive) setError(extractErrorMessage(err, "Failed to load your interview schedule."));
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const initialStatusFilter = location.state?.filter
    ? capitalize(location.state.filter)
    : null;

  const handleJoinInterview = (interview) => {
    navigate(`/interviewers/conduct-interviews/${interview.scheduleId}`);
  };

  return (
    <div className="">
      <ConductInterviewOverview
        organization={organization || {}}
        interviewer={{ name: interviewer?.name || "Interviewer" }}
        interviews={interviews}
        loading={loading}
        error={error}
        initialStatusFilter={initialStatusFilter}
        onJoinInterview={handleJoinInterview}
      />
    </div>
  );
}
