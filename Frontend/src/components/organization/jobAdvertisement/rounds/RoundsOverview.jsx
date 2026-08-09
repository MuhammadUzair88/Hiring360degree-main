import React from "react";
import { useParams } from "react-router-dom";
import { useRoundsLogic } from "./Useroundslogic";
import RoundsSetupModal from "./RoundsSetupModal";
import RoundTabs from "./RoundTabs";
import RoundCandidatePool from "./RoundCandidatePool";
import ScheduleInterviewForm from "./ScheduleInterviewForm";
import RoundScheduleList from "./RoundScheduleList";
import InterviewFeedbackModal from "./InterviewFeedbackModal";
import AddInterviewerModal from "./AddInterviewerModal";
import DeleteScheduleConfirmModal from "./DeleteScheduleConfirmModal";


export default function RoundsOverview({ jobId: jobIdProp }) {
  const { id: jobIdFromRoute } = useParams();
  const jobId = jobIdProp || jobIdFromRoute;

  const rounds = useRoundsLogic(jobId);

  if (rounds.isLoadingPipeline) {
    return (
      <div className="w-full flex items-center justify-center py-24 text-gray-500 text-sm">
        Loading interview pipeline…
      </div>
    );
  }

  if (!rounds.isConfigured) {
    return <RoundsSetupModal onFinalize={rounds.finalizeRoundsConfig} />;
  }
 

  return (
    <div className="w-full flex flex-col gap-6">
      <RoundTabs rounds={rounds.rounds} activeIndex={rounds.activeRoundIndex} counts={rounds.poolCounts} onSelect={rounds.setActiveRoundIndex} />

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <RoundCandidatePool
          roundName={rounds.activeRoundName}
          pool={rounds.activeRoundPool}
          scheduledCandidateIds={rounds.scheduledCandidateIds}
          selectedCandidateId={rounds.selectedCandidateId}
          onSelectCandidate={rounds.selectCandidateForScheduling}
        />

        <ScheduleInterviewForm
          roundName={rounds.activeRoundName}
          selectedCandidate={rounds.selectedCandidate}
          onClearSelectedCandidate={rounds.clearSelectedCandidate}
          editingSchedule={rounds.editingSchedule}
          onCancelEdit={rounds.cancelEdit}
          interviewers={rounds.interviewers}
          onOpenAddInterviewer={rounds.openAddInterviewer}
          interviewerId={rounds.interviewerId}
          onInterviewerChange={rounds.setInterviewerId}
          date={rounds.date}
          onDateChange={rounds.setDate}
          time={rounds.time}
          onTimeChange={rounds.handleTimeChange}
          onTimeBlur={rounds.handleTimeBlur}
          availabilityConflict={rounds.availabilityConflict}
          formError={rounds.formError}
          isSubmitting={rounds.isSubmitting}
          onSubmit={rounds.submitSchedule}
        />

        <RoundScheduleList
          roundName={rounds.activeRoundName}
          activeTab={rounds.activeTab}
          onTabChange={rounds.setActiveTab}
          upcomingInterviews={rounds.upcomingInterviews}
          reviewInterviews={rounds.reviewInterviews}
          sendingEmailIds={rounds.sendingEmailIds}
          onNotify={rounds.triggerNotify}
          onEdit={rounds.startEditSchedule}
          onDelete={rounds.requestDeleteSchedule}
          onOpenFeedback={(item) => rounds.openFeedback(item.id)}
        />
      </div>

      <InterviewFeedbackModal
        schedule={rounds.feedbackSchedule}
        isLastRound={rounds.isLastRound}
        onClose={rounds.closeFeedback}
        onAccept={rounds.acceptCandidate}
        onReject={rounds.rejectCandidate}
        onDirectOffer={rounds.directOfferCandidate}
      />

      <AddInterviewerModal isOpen={rounds.isAddInterviewerOpen} onClose={rounds.closeAddInterviewer} onSubmit={rounds.addInterviewer} />

      <DeleteScheduleConfirmModal isOpen={Boolean(rounds.deleteConfirmId)} onCancel={rounds.cancelDeleteSchedule} onConfirm={rounds.confirmDeleteSchedule} />
    </div>
  );
}