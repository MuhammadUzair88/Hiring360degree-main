// src/pages/interviewer/evaluation/CandidateEvaluation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CandidateEvaluationOverview from "../../../components/interviewer/evaluation/CandidateEvaluationOverview";
import interviewerDashboardService from "../../../services/interviewerDashboardService";
import { extractErrorMessage } from "../../../services/apiClient";

const COMPETENCY_CATEGORIES = [
  {
    id: "technicalSkills",
    label: "Technical Skills",
    description: "Knowledge of core tools and technologies",
  },
  {
    id: "problemSolving",
    label: "Problem Solving",
    description: "Analytical thinking and debug efficiency",
  },
  {
    id: "communication",
    label: "Communication",
    description: "Clarity and articulation",
  },
  {
    id: "behavioralSkills",
    label: "Behavioral Skills",
    description: "Leadership and conflict management",
  },
  {
    id: "culturalFit",
    label: "Cultural Fit",
    description: "Alignment with core company values",
  },
];

const RECOMMENDATION_OPTIONS = [
  { id: "Strong Hire", label: "Strong Hire" },
  { id: "Hire", label: "Hire" },
  { id: "Hold", label: "Hold" },
  { id: "No Hire", label: "No Hire" },
];

function toEvaluationData(raw) {
  return {
    scheduleId: raw.scheduleId,
    applicationId: raw.applicationId,
    resumeUrl: raw.resumeUrl || "",
    roundName: raw.roundName || "Interview Round",
    interviewDate: raw.interviewDate || "",
    interviewTime: raw.interviewTime || "",
    candidate: {
      id: raw.candidate?.id || raw.candidate?.email || "",
      name: raw.candidate?.name || "Candidate",
      email: raw.candidate?.email || "",
      phone: raw.candidate?.phone || "",
      role: raw.assignedTargetRole || "N/A",
      avatarUrl: "",
      status: raw.isSubmitted ? "Submitted" : "In Progress",
      assignedRole: raw.assignedTargetRole || "N/A",
      department: raw.department || "N/A",
      employmentType: raw.employmentType || "N/A",
      workMode: raw.workMode || "N/A",
      workLocation: raw.workLocation || "N/A",
    },
    interviewFocus: [],
    competencyCategories: COMPETENCY_CATEGORIES.map((category) => ({
      ...category,
      rating: raw.evaluation?.ratings?.[category.id] || 0,
    })),
    recommendationOptions: RECOMMENDATION_OPTIONS,
    evaluation: {
      strengths: raw.evaluation?.coreStrengths || "",
      improvements: raw.evaluation?.areasForImprovement || "",
      recommendation: raw.evaluation?.recommendation || "",
      finalComments: raw.evaluation?.finalComments || "",
      isSubmitted: Boolean(raw.isSubmitted),
    },
  };
}

export default function CandidateEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setData(undefined);
    setError(null);

    interviewerDashboardService
      .getEvaluationById(id)
      .then((raw) => {
        if (isActive) setData(toEvaluationData(raw));
      })
      .catch((requestError) => {
        if (isActive) {
          setData(null);
          setError(
            extractErrorMessage(requestError, "Failed to load this evaluation.")
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    const response = await interviewerDashboardService.submitEvaluation(id, payload);

    setData((current) =>
      current
        ? {
            ...current,
            competencyCategories: current.competencyCategories.map((category) => ({
              ...category,
              rating: response?.evaluation?.ratings?.[category.id] || payload[category.id],
            })),
            evaluation: {
              strengths: response?.evaluation?.coreStrengths || payload.coreStrengths,
              improvements:
                response?.evaluation?.areasForImprovement || payload.areasForImprovement,
              recommendation:
                response?.evaluation?.recommendation || payload.recommendation,
              finalComments:
                response?.evaluation?.finalComments || payload.finalComments || "",
              isSubmitted: true,
            },
            candidate: {
              ...current.candidate,
              status: "Submitted",
            },
          }
        : current
    );

    return response;
  };

  const handleViewResume = () => {
    if (!data?.resumeUrl) return;
    window.open(data.resumeUrl, "_blank", "noopener,noreferrer");
  };

  const handleViewFullProfile = () => {
    if (!data?.scheduleId) return;
    navigate(`/interviewers/conduct-interviews/${data.scheduleId}`);
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
        onViewResume={data.resumeUrl ? handleViewResume : undefined}
        onViewFullProfile={handleViewFullProfile}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
