import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CANDIDATE_OUTCOME, FEEDBACK_EVALUATION } from "./data";
import { convertTo24Hour, getTodayStringDate, isDateTimeInFuture, isValidTimeFormat } from "./utils";
import pipelineService from "../../../../services/pipelineService";
import interviewService from "../../../../services/interviewService";
import interviewerService from "../../../../services/interviewerService";
import { extractErrorMessage } from "../../../../services/apiClient";
import { useToast } from "../../../../context/ToastContext";

// ---- adapters: backend document -> the shape this folder's UI expects ----

function mapInterviewer(iv) {
  return { id: iv._id, name: iv.name, email: iv.email, type: iv.type };
}

function mapRoundCandidate(candidate) {
  return {
    id: candidate.id,
    candidateId: candidate.id,
    applicationId: candidate.applicationId,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    matchScore: candidate.matchScore,
  };
}

function mapSchedule(sch) {
  const feedbackStatus =
    sch.feedback?.status || FEEDBACK_EVALUATION.PENDING;

  return {
    id: sch._id,
    applicationId: sch.applicationId?._id || null,
    candidateId:
      sch.applicationId?.candidateId?._id ||
      sch.applicationId?.candidateId ||
      null,

    candidateName: sch.candidateName,
    candidateEmail: sch.candidateEmail,

    interviewerId: sch.interviewerId,
    interviewerName:
      sch.interviewerDetails?.name || "Unknown Interviewer",

    roundIndex: sch.roundIndex,
    roundName: sch.roundName,

    date: sch.interviewDate,
    time: sch.interviewTime,

    status: sch.status,

    notified: true,

    feedbackEvaluation:
      sch.feedbackEvaluation || FEEDBACK_EVALUATION.PENDING,

    feedback: sch.feedback,

    passed:
      feedbackStatus === "Passed"
        ? true
        : feedbackStatus === "Failed"
        ? false
        : null,
  };
}

/**
 * Owns every piece of state for the Interview Rounds workspace: the
 * round framework itself (names, and whether it's been configured
 * yet), which round tab is active, the per-round candidate pools,
 * every scheduled interview, and the in-progress scheduling form.
 * Everything in this folder is presentation-only and receives its
 * data as explicit props from RoundsOverview, which is the only
 * place that talks to this hook directly.
 */
export function useRoundsLogic(jobId) {
  const navigate = useNavigate();
  const toast = useToast();

  // -- Pipeline (round framework) config ---------------------------------
  const [rounds, setRounds] = useState([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [isLoadingPipeline, setIsLoadingPipeline] = useState(true);

  // -- Reference data -------------------------------------------------------
  const [interviewers, setInterviewers] = useState([]);
  const [roundPool, setRoundPool] = useState([]);
  const [roundPoolCounts, setRoundPoolCounts] = useState([]);
  const [isLoadingPool, setIsLoadingPool] = useState(true);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  // candidateId -> "Offered" | "Rejected". Derived from decisions already
  // reflected in scheduledInterviews (a schedule with passed=true on the
  // pipeline's last round means "Offered"; passed=false means "Rejected").
  const [candidateOutcomes, setCandidateOutcomes] = useState({});

  // -- Scheduling form ------------------------------------------------------
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [interviewerId, setInterviewerId] = useState("");
  const [date, setDate] = useState(getTodayStringDate());
  const [time, setTime] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -- Misc UI state ----------------------------------------------------------
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sendingEmailIds, setSendingEmailIds] = useState(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedbackScheduleId, setFeedbackScheduleId] = useState(null);
  const [isAddInterviewerOpen, setIsAddInterviewerOpen] = useState(false);

  const resetFormFields = () => {
    setInterviewerId("");
    setDate(getTodayStringDate());
    setTime("");
    setFormError("");
  };

  const loadSchedules = useCallback(async () => {
    if (!jobId) return;
    try {
      const data = await interviewService.getJobSchedules(jobId);
    
      const mapped = (data.schedules || []).map(mapSchedule);
      setScheduledInterviews(mapped);

      // A candidate is "Offered" the moment they clear the pipeline's last
      // round, and "Rejected" the moment any round marks them failed.
      setCandidateOutcomes((prev) => {
        const next = { ...prev };
        mapped.forEach((item) => {
          if (item.passed === false) next[item.candidateId] = CANDIDATE_OUTCOME.REJECTED;
        });
        return next;
      });
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to load scheduled interviews."));
    }
  }, [jobId, toast]);

  // Load the unscheduled pool size for every configured round. The tab badge
  // later combines this with scheduled/review candidates so it reflects the
  // real number of candidates associated with each round instead of always 0.
  const loadRoundPoolCounts = useCallback(async (roundCount) => {
    if (!jobId || !roundCount) {
      setRoundPoolCounts([]);
      return;
    }

    const results = await Promise.allSettled(
      Array.from({ length: roundCount }, (_, roundIndex) =>
        interviewService.getRoundCandidates(jobId, roundIndex)
      )
    );

    setRoundPoolCounts(
      results.map((result) =>
        result.status === "fulfilled"
          ? (result.value?.candidates || []).length
          : 0
      )
    );
  }, [jobId]);

  const loadRoundPool = useCallback(
    async (roundIndex) => {
      if (!jobId || rounds.length === 0) return;
      setIsLoadingPool(true);
      try {
        const data = await interviewService.getRoundCandidates(jobId, roundIndex);
        const candidates = data.candidates || [];
        setRoundPool(candidates.map(mapRoundCandidate));
        setRoundPoolCounts((previous) => {
          const next = [...previous];
          next[roundIndex] = candidates.length;
          return next;
        });
      } catch (error) {
        // A 404 here just means the pipeline isn't saved yet — not an error worth toasting.
        setRoundPool([]);
      } finally {
        setIsLoadingPool(false);
      }
    },
    [jobId, rounds.length]
  );

  // Reload everything whenever the job changes.
  useEffect(() => {
    let isActive = true;
    setSelectedCandidateId(null);
    setEditingScheduleId(null);
    setActiveTab("upcoming");
    setDeleteConfirmId(null);
    setFeedbackScheduleId(null);
    setActiveRoundIndex(0);
    resetFormFields();

    (async () => {
      setIsLoadingPipeline(true);
      try {
        const [pipelineData, interviewerData] = await Promise.all([
          pipelineService.getPipeline(jobId),
          interviewerService.getAll(),
        ]);
        if (!isActive) return;
        const fetchedRounds = pipelineData.rounds || [];
        setRounds(fetchedRounds);
        setIsConfigured(fetchedRounds.length > 0);
        setInterviewers((interviewerData.interviewers || []).map(mapInterviewer));
        await loadRoundPoolCounts(fetchedRounds.length);
      } catch (error) {
        if (isActive) toast.error(extractErrorMessage(error, "Failed to load the interview pipeline."));
      } finally {
        if (isActive) setIsLoadingPipeline(false);
      }
    })();

    loadSchedules();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // Reload this round's candidate pool whenever the active round (or the
  // pipeline itself) changes.
  useEffect(() => {
    loadRoundPool(activeRoundIndex);
  }, [activeRoundIndex, loadRoundPool]);

  const activeRoundName = rounds[activeRoundIndex] || "";
  const isLastRound = activeRoundIndex === rounds.length - 1;
  // Candidates already sitting on an undecided slot for this round don't
  // belong in the "still needs scheduling" pool.
  const scheduledCandidateIds = new Set(
    scheduledInterviews
      .filter((item) => item.roundIndex === activeRoundIndex && item.passed === null)
      .map((item) => item.candidateId)
  );
  const activeRoundPool = roundPool.filter(
    (candidate) => !candidateOutcomes[candidate.id]
  );
  const poolCounts = rounds.map((_, roundIndex) => {
    const scheduledIds = new Set(
      scheduledInterviews
        .filter(
          (item) =>
            item.roundIndex === roundIndex &&
            item.status !== "Cancelled"
        )
        .map((item) =>
          String(item.applicationId || item.candidateId || item.id)
        )
    );

    return Number(roundPoolCounts[roundIndex] || 0) + scheduledIds.size;
  });

  const activeRoundSchedules = scheduledInterviews.filter((item) => item.roundIndex === activeRoundIndex);
  // const upcomingInterviews = activeRoundSchedules.filter((item) => !isInterviewFinished(item));
  // const reviewInterviews = activeRoundSchedules.filter((item) => isInterviewFinished(item));
const upcomingInterviews = activeRoundSchedules.filter(
  (item) =>
    item.status === "Scheduled" &&
    item.feedbackEvaluation !== FEEDBACK_EVALUATION.COMPLETED &&
    item.passed === null
);

const reviewInterviews = activeRoundSchedules.filter(
  (item) =>
    item.feedbackEvaluation === FEEDBACK_EVALUATION.COMPLETED ||
    item.passed !== null
);
  const editingSchedule = scheduledInterviews.find((item) => item.id === editingScheduleId) || null;
  const selectedCandidate = activeRoundPool.find((candidate) => candidate.id === selectedCandidateId) || null;
  const feedbackSchedule = scheduledInterviews.find((item) => item.id === feedbackScheduleId) || null;

  const normalizedTime = convertTo24Hour(time);
  // The backend itself rejects double-bookings (409) at submit time with a
  // precise message, so we surface that instead of duplicating the
  // conflict-detection logic on the client.
  const availabilityConflict = null;

  // -- Pipeline setup -----------------------------------------------------------
  const finalizeRoundsConfig = async (roundNames) => {
    const cleaned = roundNames.map((name) => name.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    try {
      await pipelineService.createPipeline(jobId, { rounds: cleaned });
      setRounds(cleaned);
      setIsConfigured(true);
      setActiveRoundIndex(0);
      await loadRoundPoolCounts(cleaned.length);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to save the interview pipeline."));
    }
  };

  // -- Candidate selection --------------------------------------------------------
  const selectCandidateForScheduling = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setFormError("");
  };
  const clearSelectedCandidate = () => setSelectedCandidateId(null);

  // -- Scheduling form handlers -----------------------------------------------------
  const handleTimeChange = (value) => {
    let next = value;
    if (next.length === 4 && !next.includes(":")) next = `${next.slice(0, 2)}:${next.slice(2)}`;
    setTime(next);
  };
  const handleTimeBlur = () => {
    if (time && isValidTimeFormat(convertTo24Hour(time))) setTime(convertTo24Hour(time));
  };

  const startEditSchedule = (item) => {
    setEditingScheduleId(item.id);
    setInterviewerId(item.interviewerId);
    setDate(item.date);
    setTime(item.time);
    setFormError("");
  };
  const cancelEdit = () => {
    setEditingScheduleId(null);
    resetFormFields();
  };

  const submitSchedule = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!interviewerId || !date || !time) return setFormError("Interviewer, date and time are all required.");
    if (!isValidTimeFormat(normalizedTime)) return setFormError("Enter a valid time, like 14:30.");

    if (editingScheduleId) {
      setIsSubmitting(true);
      try {
        await interviewService.updateSchedule(editingScheduleId, {
          interviewerId,
          interviewDate: date,
          interviewTime: normalizedTime,
        });
        await loadSchedules();
        cancelEdit();
      } catch (error) {
        setFormError(extractErrorMessage(error, "Failed to update this interview."));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!selectedCandidateId) return setFormError("Pick a candidate from the list first.");
    if (!isDateTimeInFuture(date, normalizedTime)) return setFormError("Interviews can't be scheduled in the past.");

    const candidate = activeRoundPool.find((item) => item.id === selectedCandidateId);
    if (!candidate?.applicationId) return setFormError("This candidate's application couldn't be found.");

    setIsSubmitting(true);
    try {
      await interviewService.schedule({
        applicationId: candidate.applicationId,
        interviewerId,
        roundIndex: activeRoundIndex,
        interviewDate: date,
        interviewTime: normalizedTime,
      });
      await Promise.all([
        loadSchedules(),
        loadRoundPool(activeRoundIndex),
        loadRoundPoolCounts(rounds.length),
      ]);
      resetFormFields();
      setSelectedCandidateId(null);
      toast.success(`Interview scheduled with ${candidate.name}.`);
    } catch (error) {
      setFormError(extractErrorMessage(error, "Failed to schedule this interview."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -- Interviewer directory -----------------------------------------------------
  const openAddInterviewer = () => setIsAddInterviewerOpen(true);
  const closeAddInterviewer = () => setIsAddInterviewerOpen(false);
  const addInterviewer = async (details) => {
    try {
      const data = await interviewerService.create(details);
      const interviewer = mapInterviewer(data.interviewer);
      setInterviewers((prev) => [interviewer, ...prev]);
      setInterviewerId(interviewer.id);
      setIsAddInterviewerOpen(false);
      toast.success(`${interviewer.name} added to your interviewer directory.`);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to add this interviewer."));
    }
  };

  // -- Notifications ------------------------------------------------------------------
  const triggerNotify = async (scheduleId) => {
    if (sendingEmailIds.has(scheduleId)) return;
    setSendingEmailIds((prev) => new Set(prev).add(scheduleId));
    try {
      await interviewService.resendEmail(scheduleId);
      toast.success("Interview invitation resent.");
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to resend the invitation."));
    } finally {
      setSendingEmailIds((prev) => {
        const next = new Set(prev);
        next.delete(scheduleId);
        return next;
      });
    }
  };

  // -- Delete ------------------------------------------------------------------------------
  // NOTE: the backend doesn't expose a cancel/delete endpoint for a
  // scheduled interview (only create / reschedule / decide). Confirming
  // here removes the card from view; ask an admin to cancel the meeting
  // on the video-call side if it's already been sent out.
  const requestDeleteSchedule = (scheduleId) => setDeleteConfirmId(scheduleId);
  const cancelDeleteSchedule = () => setDeleteConfirmId(null);
  const confirmDeleteSchedule = () => {
    setScheduledInterviews((prev) => prev.filter((item) => item.id !== deleteConfirmId));
    if (editingScheduleId === deleteConfirmId) cancelEdit();
    setDeleteConfirmId(null);
    toast.info("Removed from this view. This does not cancel the meeting invite already sent.");
  };

  // -- Feedback + decisions ----------------------------------------------------------------
  const openFeedback = (scheduleId) => setFeedbackScheduleId(scheduleId);
  const closeFeedback = () => setFeedbackScheduleId(null);

  const acceptCandidate = async (scheduleId) => {
    const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
    if (!schedule) return;
    try {
      const data = await interviewService.decideRoundOutcome(scheduleId, { decision: "accept" });
      await Promise.all([
        loadSchedules(),
        loadRoundPoolCounts(rounds.length),
      ]);
      if (data.isOffered) {
        setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.OFFERED }));
        toast.success(`${schedule.candidateName} has cleared every round and is ready for an offer.`);
        navigate(`/advertisement/job/${jobId}/offer-letter`);
      } else {
        toast.success(`${schedule.candidateName} moves on to ${data.nextRoundName}.`);
        setActiveRoundIndex(data.nextRoundIndex);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to record this decision."));
    } finally {
      closeFeedback();
    }
  };

  const rejectCandidate = async (scheduleId) => {
    const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
    if (!schedule) return;
    try {
      await interviewService.decideRoundOutcome(scheduleId, { decision: "reject" });
      await Promise.all([
        loadSchedules(),
        loadRoundPoolCounts(rounds.length),
      ]);
      setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.REJECTED }));
      toast.info(`${schedule.candidateName} has been rejected.`);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to record this decision."));
    } finally {
      closeFeedback();
    }
  };

  // The backend's decision endpoint only supports accept/reject for the
  // current round — there's no dedicated "skip straight to offer" action,
  // so this accepts the current round like normal and lets the pipeline's
  // own "last round" check decide whether that means an offer.
  // const directOfferCandidate = async (scheduleId) => acceptCandidate(scheduleId);
  const directOfferCandidate = async (scheduleId) => {
  const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
  if (!schedule) return;
  try {
    await interviewService.decideRoundOutcome(scheduleId, { decision: "directOffer" });
    await Promise.all([
      loadSchedules(),
      loadRoundPoolCounts(rounds.length),
    ]);
    setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.OFFERED }));
    toast.success(`${schedule.candidateName} is ready for an offer.`);
    closeFeedback();
    navigate(`/advertisement/job/${jobId}/offer-letter`);
  } catch (error) {
    toast.error(extractErrorMessage(error, "Failed to send this candidate to the offer stage."));
    closeFeedback();
  }
};

  return {
    // pipeline
    rounds,
    isConfigured,
    isLoadingPipeline,
    finalizeRoundsConfig,
    activeRoundIndex,
    setActiveRoundIndex,
    activeRoundName,
    isLastRound,
    poolCounts,
    // pool
    activeRoundPool,
    isLoadingPool,
    scheduledCandidateIds,
    selectedCandidateId,
    selectedCandidate,
    selectCandidateForScheduling,
    clearSelectedCandidate,
    // interviewers
    interviewers,
    isAddInterviewerOpen,
    openAddInterviewer,
    closeAddInterviewer,
    addInterviewer,
    // scheduling form
    interviewerId,
    setInterviewerId,
    date,
    setDate,
    time,
    handleTimeChange,
    handleTimeBlur,
    editingScheduleId,
    editingSchedule,
    startEditSchedule,
    cancelEdit,
    submitSchedule,
    formError,
    isSubmitting,
    availabilityConflict,
    // schedule list
    activeTab,
    setActiveTab,
    upcomingInterviews,
    reviewInterviews,
    sendingEmailIds,
    triggerNotify,
    // delete
    deleteConfirmId,
    requestDeleteSchedule,
    cancelDeleteSchedule,
    confirmDeleteSchedule,
    // feedback + decisions
    feedbackSchedule,
    openFeedback,
    closeFeedback,
    acceptCandidate,
    rejectCandidate,
    directOfferCandidate,
  };
}
