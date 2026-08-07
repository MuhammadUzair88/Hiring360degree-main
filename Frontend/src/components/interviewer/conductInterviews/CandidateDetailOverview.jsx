// src/components/interviewerDashboard/conductInterview/CandidateDetailOverview.jsx

import React, { useState } from "react";
import CandidateDetailTopBar from "./CandidateDetailTopBar";
import CandidateProfileCard from "./CandidateProfileCard";
import RoundProgressCard from "./RoundProgressCard";
import FeedbackActionCard from "./FeedbackActionCard";
import AppliedPositionCard from "./AppliedPositionCard";
import CandidateDetailTabs from "./CandidateDetailTabs";
import ResumeDocumentPreview from "./ResumeDocumentPreview";
import JobDescriptionPanel from "./JobDescriptionPanel";
import FeedbackHistoryPanel from "./FeedbackHistoryPanel";

/**
 * The full Candidate Details page, composed exactly like the Figma
 * spec: a dedicated full-height top bar (not the shared dashboard
 * header — this is a focus-mode page for actually conducting the
 * interview), a left sidebar of context cards, and a tabbed main
 * panel (Resume / Job Description / Feedback).
 *
 * Takes the whole candidate record as one prop and owns only the
 * active-tab UI state — every visual piece below is a plain,
 * prop-driven component.
 */
export default function CandidateDetailOverview({ candidate, backTo, onJoinInterview, onSubmitFeedback, onViewFeedback }) {
  const [activeTab, setActiveTab] = useState("resume");

  const isCompleted = candidate.status === "Completed";
  const canJoin = !isCompleted && Boolean(candidate.meetingLink);
  const roundLabel = `${candidate.assignedStage} · Round ${candidate.roundIndex + 1} of ${candidate.totalRounds}`;

  return (
    <div className="self-stretch min-h-screen flex flex-col">
      <CandidateDetailTopBar
        candidate={candidate}
        roundLabel={roundLabel}
        canJoin={canJoin}
        onJoinInterview={onJoinInterview}
        backTo={backTo}
      />

      <div className="flex-1 bg-secondary-100 flex flex-col lg:flex-row">
        {/* Left sidebar */}
        <div className="w-full lg:w-80 shrink-0 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-secondary-300 flex flex-col gap-3">
          <CandidateProfileCard
            email={candidate.email}
            phone={candidate.phone}
            interviewDate={candidate.interviewDate}
            interviewTime={candidate.interviewTime}
          />

          <RoundProgressCard
            roundIndex={candidate.roundIndex}
            totalRounds={candidate.totalRounds}
            stageName={candidate.assignedStage}
          />

          {isCompleted && (
            <FeedbackActionCard
              isSubmitted={candidate.feedbackEvaluation === "Completed"}
              onSubmitFeedback={onSubmitFeedback}
              onViewFeedback={onViewFeedback}
            />
          )}

          <AppliedPositionCard
            jobTitleTarget={candidate.jobTitleTarget}
            departmentPool={candidate.departmentPool}
            employmentType={candidate.employmentType}
            workMode={candidate.workMode}
            experienceRequired={candidate.experienceRequired}
          />
        </div>

        {/* Main tabbed content */}
        <div className="flex-1 flex flex-col min-w-0">
          <CandidateDetailTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            feedbackCount={candidate.previousFeedbacks?.length || 0}
          />

          {activeTab === "resume" && (
            <ResumeDocumentPreview
              candidateName={candidate.candidateName}
              jobTitleTarget={candidate.jobTitleTarget}
              resume={candidate.resume}
            />
          )}

          {activeTab === "job" && (
            <JobDescriptionPanel
              requiredSkills={candidate.requiredSkills}
              experienceRequired={candidate.experienceRequired}
              jobDescription={candidate.jobDescription}
            />
          )}

          {activeTab === "feedback" && <FeedbackHistoryPanel feedbacks={candidate.previousFeedbacks} />}
        </div>
      </div>
    </div>
  );
}