// src/pages/interviewer/evaluation/CandidateEvaluation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CandidateEvaluationOverview from "../../../components/interviewer/evaluation/CandidateEvaluationOverview";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

const COMPETENCY_CATEGORIES = [
  { id: "technicalSkills", label: "Technical Skills", description: "Knowledge of core tools and technologies" },
  { id: "problemSolving", label: "Problem Solving", description: "Analytical thinking and debug efficiency" },
  { id: "communication", label: "Communication", description: "Clarity and articulation" },
  { id: "behavioralSkills", label: "Behavioral Skills", description: "Leadership and conflict management" },
  { id: "culturalFit", label: "Cultural Fit", description: "Alignment with core company values" },
];

const RECOMMENDATION_OPTIONS = [
  { id: "Strong Hire", label: "Strong Hire" },
  { id: "Hire", label: "Hire" },
  { id: "Hold", label: "Hold" },
  { id: "No Hire", label: "No Hire" },
];

function toEvaluationData(raw) {
  return {
    candidate: {
      id: raw.candidate.email,
      name: raw.candidate.name,
      email: raw.candidate.email,
      role: raw.assignedTargetRole,
      avatarUrl: "",
      status: raw.isSubmitted ? "Submitted" : "In Progress",
      assignedRole: raw.assignedTargetRole,
    },
    interviewFocus: [],
    competencyCategories: COMPETENCY_CATEGORIES.map((cat) => ({
      ...cat,
      rating: raw.evaluation?.ratings?.[cat.id] || 0,
    })),
    recommendationOptions: RECOMMENDATION_OPTIONS,
    evaluation: {
      strengths: raw.evaluation?.coreStrengths || "",
      improvements: raw.evaluation?.areasForImprovement || "",
      recommendation: raw.evaluation?.recommendation || "",
      finalComments: raw.evaluation?.finalComments || "",
      isSubmitted: raw.isSubmitted,
    },
  };
}

export default function CandidateEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setData(undefined);
    interviewerDashboardService
      .getEvaluationById(id)
      .then((raw) => {
        if (isActive) setData(toEvaluationData(raw));
      })
      .catch((err) => {
        if (isActive) {
          setData(null);
          setError(extractErrorMessage(err, "Failed to load this evaluation."));
        }
      });
    return () => {
      isActive = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    await interviewerDashboardService.submitEvaluation(id, payload);
  };

  if (data === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading evaluation…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-slate-900 text-lg font-semibold">Evaluation not found</p>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/interviewers/evaluation")}
          className="mt-2 px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Evaluations
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-8">
      <CandidateEvaluationOverview
        data={data}
        onBack={() => navigate("/interviewers/evaluation")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
