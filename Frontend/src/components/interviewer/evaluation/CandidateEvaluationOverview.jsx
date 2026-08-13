// src/components/interviewer/evaluation/CandidateEvaluationOverview.jsx
//
// Composition root for the Candidate Evaluation screen. Owns all form
// state and hands plain data + callbacks down to each presentational
// sub-component as props. `data` is normalized by the page
// (pages/interviewer/evaluation/CandidateEvaluation.jsx) from
// GET /api/interviewer/dash/evaluations/:id, and `onSubmit` posts the
// completed scorecard to POST /api/interviewer/dash/evaluations/:id.

import React, { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import CandidateProfileCard from "./CandidateProfileCard";
import InterviewFocusCard from "./InterviewFocusCard";
import CompetencyAssessment from "./CompetencyAssessment";
import StrengthsImprovementsSection from "./StrengthsImprovementsSection";
import FinalRecommendationCard from "./FinalRecommendationCard";
import { useToast } from "../../../context/ToastContext";

export default function CandidateEvaluationOverview({ data, onBack, onViewResume, onViewFullProfile, onSubmit }) {
  const toast = useToast();
  const { candidate, interviewFocus, competencyCategories, recommendationOptions, evaluation } = data;

  const initialRatings = competencyCategories.reduce((acc, cat) => {
    acc[cat.id] = evaluation.isSubmitted ? cat.rating : 0;
    return acc;
  }, {});

  const [ratings, setRatings] = useState(initialRatings);
  const [strengths, setStrengths] = useState(evaluation.strengths);
  const [improvements, setImprovements] = useState(evaluation.improvements);
  const [recommendation, setRecommendation] = useState(evaluation.recommendation);
  const [finalComments, setFinalComments] = useState(evaluation.finalComments);

  const [isSubmitted, setIsSubmitted] = useState(evaluation.isSubmitted);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRatingChange = (categoryId, value) => {
    setRatings((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleSubmit = async () => {
    const allRated = competencyCategories.every((cat) => ratings[cat.id] > 0);

    if (!allRated) {
      window.alert("Please rate all categories before submitting.");
      return;
    }
    if (!strengths.trim()) {
      window.alert("Please enter core strengths.");
      return;
    }
    if (!improvements.trim()) {
      window.alert("Please enter areas for improvement.");
      return;
    }
    if (!recommendation) {
      window.alert("Please select an Overall Recommendation verdict before submitting.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to finalize this evaluation for ${candidate.name}?\n\nThis will be submitted to HR records and cannot be changed.`
    );
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        ...ratings,
        coreStrengths: strengths,
        areasForImprovement: improvements,
        recommendation,
        finalComments,
      });
      setIsSubmitted(true);
      setShowSuccess(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit this evaluation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {showSuccess && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-primary-800 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-800">Evaluation submitted successfully</p>
            <p className="text-xs text-primary-700/80">
              This scorecard has been recorded against {candidate.name}&rsquo;s profile.
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-800 transition-colors mb-1 w-fit"
            >
              <ArrowLeft size={14} /> Candidates
              <span className="text-gray-300">/</span>
              <span className="text-slate-700">{candidate.name}</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-slate-900">{data.roundName || "Interview"} Evaluation</h1>
          <p className="text-gray-600">Record your assessment for {candidate.name}.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onViewResume}
            disabled={!onViewResume}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-gray-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            View Resume
          </button>
          <button
            type="button"
            onClick={onViewFullProfile}
            disabled={!onViewFullProfile}
            className="px-4 py-2 rounded-lg bg-primary-800 hover:bg-primary-900 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Full Profile
          </button>
        </div>
      </div>

      {/* Body: 1/4 candidate rail + 3/4 evaluation form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CandidateProfileCard
            candidate={{ ...candidate, status: isSubmitted ? "Submitted" : candidate.status }}
          />
          {/* <InterviewFocusCard items={interviewFocus} /> */}
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <CompetencyAssessment
            categories={competencyCategories}
            ratings={ratings}
            onRatingChange={handleRatingChange}
            readOnly={isSubmitted}
          />

          <StrengthsImprovementsSection
            strengths={strengths}
            improvements={improvements}
            onStrengthsChange={setStrengths}
            onImprovementsChange={setImprovements}
            readOnly={isSubmitted}
          />

          <FinalRecommendationCard
            options={recommendationOptions}
            recommendation={recommendation}
            onRecommendationChange={setRecommendation}
            finalComments={finalComments}
            onFinalCommentsChange={setFinalComments}
            readOnly={isSubmitted}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
