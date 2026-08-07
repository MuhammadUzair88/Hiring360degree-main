// src/pages/interviewerDashboard/CandidateEvaluation.jsx
//
// Front-end only page. Data currently comes from the local mock in
// src/data/candidateEvaluationData.js — once a backend exists, replace
// `candidateEvaluationData` below with the result of a fetch keyed off
// the route param (id) and everything downstream keeps working as-is.

import React from "react";
import { useNavigate } from "react-router-dom";
import CandidateEvaluationOverview from "../../../components/interviewer/evaluation/CandidateEvaluationOverview";
import candidateEvaluationData from "../../../components/interviewer/evaluation/candidateEvaluationData";

export default function CandidateEvaluation() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8">
      <CandidateEvaluationOverview
        data={candidateEvaluationData}
        onBack={() => navigate("/interviewers/evaluation")}
      />
    </div>
  );
}
