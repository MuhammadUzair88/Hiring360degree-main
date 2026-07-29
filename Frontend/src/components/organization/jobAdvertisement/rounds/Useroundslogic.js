import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CANDIDATE_OUTCOME,
  FEEDBACK_EVALUATION,
  SCHEDULE_STATUS,
  getInterviewers,
  getInterviewPipelineByJobId,
  getScheduledInterviewsByJobId,
  getShortlistedCandidatesByJobId,
} from "./data";
import { convertTo24Hour, findAvailabilityConflict, getTodayStringDate, isDateTimeInFuture, isValidTimeFormat, isInterviewFinished } from "./utils";

const PIPELINE_STORAGE_KEY_PREFIX = "rounds-pipeline:";

// Stand-in for a real network call — every write below awaits this
// instead, so swapping in `api.post(...)` etc. later is a one-line
// change per handler rather than a rewrite.
function simulateRequest(delay = 600) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function readStoredRounds(jobId) {
  try {
    const raw = window.localStorage.getItem(`${PIPELINE_STORAGE_KEY_PREFIX}${jobId}`);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.rounds) && parsed.rounds.length > 0 ? parsed.rounds : null;
  } catch {
    return null;
  }
}

function writeStoredRounds(jobId, rounds) {
  try {
    window.localStorage.setItem(`${PIPELINE_STORAGE_KEY_PREFIX}${jobId}`, JSON.stringify({ rounds }));
  } catch {
    // Storage can fail (private browsing, quota, etc.) — the round
    // config just won't survive a refresh; not worth blocking on.
  }
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

  // -- Pipeline (round framework) config ---------------------------------
  const [rounds, setRounds] = useState([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  // -- Reference data -------------------------------------------------------
  const [interviewers, setInterviewers] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  // candidateId -> "Offered" | "Rejected". Once a candidate lands here
  // they're done with the pipeline and drop out of every round's pool.
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

  // Reload everything whenever the job changes — mirrors the
  // Candidate Intake board's own "board resets when job changes" rule.
  useEffect(() => {
    const storedRounds = readStoredRounds(jobId) || getInterviewPipelineByJobId(jobId)?.rounds || null;
    setRounds(storedRounds || []);
    setIsConfigured(Boolean(storedRounds));
    setActiveRoundIndex(0);
    setInterviewers(getInterviewers());
    setShortlistedCandidates(getShortlistedCandidatesByJobId(jobId));
    setScheduledInterviews(getScheduledInterviewsByJobId(jobId));
    setCandidateOutcomes({});
    setSelectedCandidateId(null);
    setEditingScheduleId(null);
    setActiveTab("upcoming");
    setDeleteConfirmId(null);
    setFeedbackScheduleId(null);
    resetFormFields();
  }, [jobId]);

  // -- Derived: per-round candidate pools --------------------------------
  // A candidate sits in round N's pool once they've passed round N-1 (or
  // in round 0 by default), and disappears entirely once they've been
  // offered or rejected at any point.
  const roundPools = useMemo(() => {
    const pools = rounds.map(() => []);
    shortlistedCandidates.forEach((candidate) => {
      if (candidateOutcomes[candidate.candidateId]) return;
      const ownSchedules = scheduledInterviews.filter((item) => item.candidateId === candidate.candidateId);
      const passedRounds = ownSchedules.filter((item) => item.passed === true).map((item) => item.roundIndex);
      const targetRound = passedRounds.length > 0 ? Math.max(...passedRounds) + 1 : 0;
      if (pools[targetRound]) pools[targetRound].push(candidate);
    });
    return pools;
  }, [rounds, shortlistedCandidates, scheduledInterviews, candidateOutcomes]);

  const activeRoundName = rounds[activeRoundIndex] || "";
  const isLastRound = activeRoundIndex === rounds.length - 1;
  const activeRoundPool = roundPools[activeRoundIndex] || [];
  const poolCounts = roundPools.map((pool) => pool.length);

  const activeRoundSchedules = scheduledInterviews.filter((item) => item.roundIndex === activeRoundIndex);
  const upcomingInterviews = activeRoundSchedules.filter((item) => !isInterviewFinished(item));
  const reviewInterviews = activeRoundSchedules.filter((item) => isInterviewFinished(item));

  // Candidates already sitting in a not-yet-decided slot for this round
  // — used to grey out their "Schedule" button in the pool panel.
  const scheduledCandidateIds = new Set(
    activeRoundSchedules.filter((item) => item.passed === null).map((item) => item.candidateId)
  );

  const editingSchedule = scheduledInterviews.find((item) => item.id === editingScheduleId) || null;
  const selectedCandidate = activeRoundPool.find((candidate) => candidate.id === selectedCandidateId) || null;
  const feedbackSchedule = scheduledInterviews.find((item) => item.id === feedbackScheduleId) || null;

  const normalizedTime = convertTo24Hour(time);
  const availabilityConflict = findAvailabilityConflict({
    scheduledInterviews,
    interviewerId,
    date,
    time: normalizedTime,
    excludeScheduleId: editingScheduleId,
  });

  // -- Pipeline setup -----------------------------------------------------------
  const finalizeRoundsConfig = (roundNames) => {
    const cleaned = roundNames.map((name) => name.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    writeStoredRounds(jobId, cleaned);
    setRounds(cleaned);
    setIsConfigured(true);
    setActiveRoundIndex(0);
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
      await simulateRequest();
      const interviewer = interviewers.find((item) => item.id === interviewerId);
      setScheduledInterviews((prev) =>
        prev.map((item) =>
          item.id === editingScheduleId
            ? { ...item, interviewerId, interviewerName: interviewer?.name || item.interviewerName, date, time: normalizedTime, notified: false }
            : item
        )
      );
      setIsSubmitting(false);
      cancelEdit();
      return;
    }

    if (!selectedCandidateId) return setFormError("Pick a candidate from the list first.");
    if (!isDateTimeInFuture(date, normalizedTime)) return setFormError("Interviews can't be scheduled in the past.");
    if (availabilityConflict) return setFormError(`${availabilityConflict.interviewerName} already has a slot at that time.`);

    setIsSubmitting(true);
    await simulateRequest();
    const candidate = activeRoundPool.find((item) => item.id === selectedCandidateId);
    const interviewer = interviewers.find((item) => item.id === interviewerId);
    const newSchedule = {
      id: `sch-${Date.now()}`,
      jobId,
      candidateId: candidate.candidateId,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      interviewerId,
      interviewerName: interviewer?.name,
      roundIndex: activeRoundIndex,
      date,
      time: normalizedTime,
      status: SCHEDULE_STATUS.SCHEDULED,
      notified: false,
      feedbackEvaluation: FEEDBACK_EVALUATION.PENDING,
      feedback: null,
      passed: null,
    };
    setScheduledInterviews((prev) => [...prev, newSchedule]);
    setIsSubmitting(false);
    resetFormFields();
    setSelectedCandidateId(null);
  };

  // -- Interviewer directory -----------------------------------------------------
  const openAddInterviewer = () => setIsAddInterviewerOpen(true);
  const closeAddInterviewer = () => setIsAddInterviewerOpen(false);
  const addInterviewer = async (details) => {
    await simulateRequest(400);
    const interviewer = { id: `int-${Date.now()}`, ...details };
    setInterviewers((prev) => [interviewer, ...prev]);
    setInterviewerId(interviewer.id);
    setIsAddInterviewerOpen(false);
  };

  // -- Notifications ------------------------------------------------------------------
  const triggerNotify = async (scheduleId) => {
    if (sendingEmailIds.has(scheduleId)) return;
    setSendingEmailIds((prev) => new Set(prev).add(scheduleId));
    await simulateRequest(700);
    setScheduledInterviews((prev) => prev.map((item) => (item.id === scheduleId ? { ...item, notified: true } : item)));
    setSendingEmailIds((prev) => {
      const next = new Set(prev);
      next.delete(scheduleId);
      return next;
    });
  };

  // -- Delete ------------------------------------------------------------------------------
  const requestDeleteSchedule = (scheduleId) => setDeleteConfirmId(scheduleId);
  const cancelDeleteSchedule = () => setDeleteConfirmId(null);
  const confirmDeleteSchedule = () => {
    setScheduledInterviews((prev) => prev.filter((item) => item.id !== deleteConfirmId));
    if (editingScheduleId === deleteConfirmId) cancelEdit();
    setDeleteConfirmId(null);
  };

  // -- Feedback + decisions ----------------------------------------------------------------
  const openFeedback = (scheduleId) => setFeedbackScheduleId(scheduleId);
  const closeFeedback = () => setFeedbackScheduleId(null);

  const acceptCandidate = async (scheduleId) => {
    const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
    if (!schedule) return;
    if (!window.confirm("Move this candidate on to the next round?")) return;
    await simulateRequest();
    setScheduledInterviews((prev) => prev.map((item) => (item.id === scheduleId ? { ...item, passed: true } : item)));
    const nextRoundIndex = schedule.roundIndex + 1;
    if (nextRoundIndex >= rounds.length) {
      setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.OFFERED }));
      window.alert(`${schedule.candidateName} has cleared every round and is ready for an offer.`);
      navigate(`/advertisement/job/${jobId}/offer-letter`);
    } else {
      window.alert(`${schedule.candidateName} moves on to ${rounds[nextRoundIndex]}.`);
      setActiveRoundIndex(nextRoundIndex);
    }
    closeFeedback();
  };

  const rejectCandidate = async (scheduleId) => {
    const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
    if (!schedule) return;
    await simulateRequest();
    setScheduledInterviews((prev) => prev.map((item) => (item.id === scheduleId ? { ...item, passed: false } : item)));
    setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.REJECTED }));
    window.alert(`${schedule.candidateName} has been rejected.`);
    closeFeedback();
  };

  const directOfferCandidate = async (scheduleId) => {
    const schedule = scheduledInterviews.find((item) => item.id === scheduleId);
    if (!schedule) return;
    if (!window.confirm(`Send ${schedule.candidateName} straight to the offer letter, skipping any remaining rounds?`)) return;
    await simulateRequest();
    setScheduledInterviews((prev) => prev.map((item) => (item.id === scheduleId ? { ...item, passed: true } : item)));
    setCandidateOutcomes((prev) => ({ ...prev, [schedule.candidateId]: CANDIDATE_OUTCOME.OFFERED }));
    window.alert(`${schedule.candidateName} is on the way to the offer letter.`);
    closeFeedback();
    navigate(`/advertisement/job/${jobId}/offer-letter`);
  };

  return {
    // pipeline
    rounds,
    isConfigured,
    finalizeRoundsConfig,
    activeRoundIndex,
    setActiveRoundIndex,
    activeRoundName,
    isLastRound,
    poolCounts,
    // pool
    activeRoundPool,
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