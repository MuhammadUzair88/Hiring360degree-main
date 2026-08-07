// src/pages/interviewer/conductInterview/ConductInterviews.jsx

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ConductInterviewOverview from "../../../components/interviewer/conductInterviews/ConductInterviewOverview";
import { organization, interviewer, interviews as dummyInterviews } from "../../../components/interviewer/conductInterviews/data";

/**
 * Route: /interviewers/conduct
 *
 * This is the ONLY file that should change when the backend is wired
 * up — swap the three imports above for real state (fetched via
 * api.get("/api/interviewer/dash/organization") and
 * api.get("/api/interviewer/dash/candidates"), same as the old page),
 * pass loading/error through, and everything under
 * ConductInterviewOverview keeps working exactly as it does now with
 * dummy data.
 *
 * `location.state.filter` still opens the matching drawer directly
 * when arriving here from a dashboard metric card, same as before.
 */
export default function ConductInterviews() {
  const location = useLocation();

  const [interviews] = useState(dummyInterviews);
  const [loading] = useState(false);
  const [error] = useState(null);

  const initialStatusFilter = location.state?.filter
    ? capitalize(location.state.filter)
    : null;

  const handleJoinInterview = (interview) => {
    const link = interview.joinLink;
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="">
      <ConductInterviewOverview
        organization={organization}
        interviewer={interviewer}
        interviews={interviews}
        loading={loading}
        error={error}
        initialStatusFilter={initialStatusFilter}
        onJoinInterview={handleJoinInterview}
      />
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}