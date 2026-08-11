import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Bookmark, CheckCircle2 } from "lucide-react";
import CandidateIntakeStats from "./CandidateIntakeStats";
import CandidateColumn from "./CandidateColumn";
import CandidateCard from "./CandidateCard";
import CandidateDetailDrawer from "./CandidateDetailDrawer";
import RejectCandidateModal from "./RejectCandidateModal";
import { CANDIDATE_STATUS } from "./data";
import applicationService from "../../../../services/applicationService";
import { extractErrorMessage } from "../../../../services/apiClient";
import { useToast } from "../../../../context/ToastContext";
import { mapApplicationToCandidate } from "../../../../utils/adapters";

/**
 * Owns every piece of state for the Candidate Intake screen: the
 * candidate list, which card is busy mid-request, which one is open
 * in the drawer, which one is pending a reject confirmation, and
 * drag-and-drop state. Everything else in this folder is
 * presentation-only and just receives props from here.
 */
export default function CandidateIntakeOverview({ jobId: jobIdProp }) {
  const { id: jobIdFromRoute } = useParams();
  const jobId = jobIdProp || jobIdFromRoute;
  const toast = useToast();

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidatePendingRejection, setCandidatePendingRejection] = useState(null);
  const [busyIds, setBusyIds] = useState({});
  const [analyzingIds, setAnalyzingIds] = useState({});

  // Drag-and-drop: which candidate is currently being dragged, and
  // which column is currently being hovered over (for the highlight).
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const loadCandidates = async () => {
    if (!jobId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await applicationService.getByAdvertisement(jobId);
      const applications = data.applications || [];
      setCandidates(applications.map(mapApplicationToCandidate));
    } catch (error) {
      setLoadError(extractErrorMessage(error, "Failed to load candidates for this job."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCandidateId(null);
    setDraggingId(null);
    setDragOverStatus(null);
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const setBusy = (candidateId, value) => setBusyIds((prev) => ({ ...prev, [candidateId]: value }));
  const isBusy = (candidateId) => Boolean(busyIds[candidateId]);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedCandidateId) || null,
    [candidates, selectedCandidateId]
  );

  const updateCandidateStatus = (candidateId, status) =>
    setCandidates((prev) => prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, status } : candidate)));

  const removeCandidate = (candidateId) => setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId));

  async function runStatusChange(candidate, { apiCall, nextStatus, errorMessage }) {
    setBusy(candidate.id, true);
    try {
      await apiCall(candidate.id);
      updateCandidateStatus(candidate.id, nextStatus);
    } catch (error) {
      toast.error(extractErrorMessage(error, errorMessage));
    } finally {
      setBusy(candidate.id, false);
    }
  }

  const handleBookmark = (candidate) =>
    runStatusChange(candidate, {
      apiCall: applicationService.bookmark,
      nextStatus: CANDIDATE_STATUS.BOOKMARKED,
      errorMessage: "Failed to bookmark candidate. Please try again.",
    });

  const handleShortlist = (candidate) =>
    runStatusChange(candidate, {
      apiCall: applicationService.shortlist,
      nextStatus: CANDIDATE_STATUS.SHORTLISTED,
      errorMessage: "Failed to shortlist candidate. Please try again.",
    });

  const handleMoveToPending = (candidate) =>
    runStatusChange(candidate, {
      apiCall: applicationService.moveToApplied,
      nextStatus: CANDIDATE_STATUS.PENDING,
      errorMessage: "Failed to move candidate. Please try again.",
    });

  const handleConfirmReject = async () => {
    if (!candidatePendingRejection) return;
    const candidate = candidatePendingRejection;
    setCandidatePendingRejection(null);
    setBusy(candidate.id, true);
    try {
      await applicationService.reject(candidate.id);
      removeCandidate(candidate.id);
      if (selectedCandidateId === candidate.id) setSelectedCandidateId(null);
      toast.success(`${candidate.name} has been rejected.`);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to reject candidate. Please try again."));
    } finally {
      setBusy(candidate.id, false);
    }
  };

  // Runs AI resume analysis for one candidate via POST /api/application/analyze/:id,
  // then refreshes that candidate's record in place with the real result.
  const handleAnalyze = async (candidate) => {
    if (candidate.aiEvaluation || analyzingIds[candidate.id]) return;
    setAnalyzingIds((prev) => ({ ...prev, [candidate.id]: true }));
    try {
      const data = await applicationService.analyzeResume(candidate.id);
      if (data.application) {
        const mapped = mapApplicationToCandidate(data.application);

        // The analyze endpoint used to return an unpopulated candidateId,
        // which temporarily changed the UI name to "Unknown candidate" until
        // a full refresh. Preserve identity/resume from the already-loaded row
        // if a deployment returns a partial application object.
        const updated = {
          ...candidate,
          ...mapped,
          name:
            mapped.name && mapped.name !== "Unknown candidate"
              ? mapped.name
              : candidate.name,
          email: mapped.email || candidate.email,
          resume: mapped.resume?.url ? mapped.resume : candidate.resume,
        };

        setCandidates((prev) =>
          prev.map((item) => (item.id === candidate.id ? updated : item))
        );
      } else {
        // Some deployments only return the aiResult — refetch the row to stay in sync.
        await loadCandidates();
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to analyze this resume. Please try again."));
    } finally {
      setAnalyzingIds((prev) => ({ ...prev, [candidate.id]: false }));
    }
  };

  // --- Drag-and-drop wiring -------------------------------------------
  // Dropping a card on a column routes to the exact same handlers the
  // card's own action buttons use, so a drag-move and a button-click
  // move both go through one code path (and one real API call).
  const handleDragStart = (candidateId) => setDraggingId(candidateId);

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStatus(null);
  };

  const handleDragEnter = (status) => setDragOverStatus(status);

  const handleDragLeave = (status) =>
    setDragOverStatus((prev) => (prev === status ? null : prev));

  const handleDropCandidate = (candidateId, targetStatus) => {
    setDraggingId(null);
    setDragOverStatus(null);
    if (!candidateId) return;

    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate || candidate.status === targetStatus) return;

    if (targetStatus === CANDIDATE_STATUS.BOOKMARKED) handleBookmark(candidate);
    else if (targetStatus === CANDIDATE_STATUS.SHORTLISTED) handleShortlist(candidate);
    else if (targetStatus === CANDIDATE_STATUS.PENDING) handleMoveToPending(candidate);
  };
  // ----------------------------------------------------------------------

  const pending = candidates.filter((candidate) => candidate.status === CANDIDATE_STATUS.PENDING);
  const bookmarked = candidates.filter((candidate) => candidate.status === CANDIDATE_STATUS.BOOKMARKED);
  const shortlisted = candidates.filter((candidate) => candidate.status === CANDIDATE_STATUS.SHORTLISTED);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <CandidateIntakeStats
        total={candidates.length}
        pending={pending.length}
        bookmarked={bookmarked.length}
        shortlisted={shortlisted.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CandidateColumn
          title="Pending Review"
          subtitle="Awaiting evaluation"
          count={pending.length}
          badgeClassName="bg-warning-100 text-warning-700"
          emptyIcon={Clock}
          emptyMessage="No pending candidates"
          isEmpty={pending.length === 0}
          status={CANDIDATE_STATUS.PENDING}
          isDragOver={dragOverStatus === CANDIDATE_STATUS.PENDING}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropCandidate}
        >
          {pending.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isBusy={isBusy(candidate.id)}
              isAnalyzed={Boolean(candidate.aiEvaluation)}
              isAnalyzing={Boolean(analyzingIds[candidate.id])}
              isDragging={draggingId === candidate.id}
              onAnalyze={() => handleAnalyze(candidate)}
              onOpenProfile={() => setSelectedCandidateId(candidate.id)}
              onBookmark={() => handleBookmark(candidate)}
              onShortlist={() => handleShortlist(candidate)}
              onReject={() => setCandidatePendingRejection(candidate)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </CandidateColumn>

        <CandidateColumn
          title="Bookmarked"
          subtitle="Saved for later"
          count={bookmarked.length}
          badgeClassName="bg-info-100 text-info-700"
          emptyIcon={Bookmark}
          emptyMessage="No bookmarked candidates"
          isEmpty={bookmarked.length === 0}
          status={CANDIDATE_STATUS.BOOKMARKED}
          isDragOver={dragOverStatus === CANDIDATE_STATUS.BOOKMARKED}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropCandidate}
        >
          {bookmarked.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isBusy={isBusy(candidate.id)}
              isAnalyzed={Boolean(candidate.aiEvaluation)}
              isAnalyzing={Boolean(analyzingIds[candidate.id])}
              isDragging={draggingId === candidate.id}
              onAnalyze={() => handleAnalyze(candidate)}
              onOpenProfile={() => setSelectedCandidateId(candidate.id)}
              onUnbookmark={() => handleMoveToPending(candidate)}
              onShortlist={() => handleShortlist(candidate)}
              onReject={() => setCandidatePendingRejection(candidate)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </CandidateColumn>

        <CandidateColumn
          title="Shortlisted"
          subtitle="Ready for interview"
          count={shortlisted.length}
          badgeClassName="bg-success-100 text-success-700"
          emptyIcon={CheckCircle2}
          emptyMessage="No shortlisted candidates yet"
          isEmpty={shortlisted.length === 0}
          status={CANDIDATE_STATUS.SHORTLISTED}
          isDragOver={dragOverStatus === CANDIDATE_STATUS.SHORTLISTED}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropCandidate}
        >
          {shortlisted.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isBusy={isBusy(candidate.id)}
              isAnalyzed={Boolean(candidate.aiEvaluation)}
              isAnalyzing={Boolean(analyzingIds[candidate.id])}
              isDragging={draggingId === candidate.id}
              onAnalyze={() => handleAnalyze(candidate)}
              onOpenProfile={() => setSelectedCandidateId(candidate.id)}
              onUnshortlist={() => handleMoveToPending(candidate)}
              onReject={() => setCandidatePendingRejection(candidate)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </CandidateColumn>
      </div>

      <CandidateDetailDrawer
        candidate={selectedCandidate}
        isBusy={selectedCandidate ? isBusy(selectedCandidate.id) : false}
        isAnalyzed={selectedCandidate ? Boolean(selectedCandidate.aiEvaluation) : false}
        isAnalyzing={selectedCandidate ? Boolean(analyzingIds[selectedCandidate.id]) : false}
        onAnalyze={() => selectedCandidate && handleAnalyze(selectedCandidate)}
        onClose={() => setSelectedCandidateId(null)}
        onBookmark={() => handleBookmark(selectedCandidate)}
        onUnbookmark={() => handleMoveToPending(selectedCandidate)}
        onShortlist={() => handleShortlist(selectedCandidate)}
        onUnshortlist={() => handleMoveToPending(selectedCandidate)}
        onReject={() => setCandidatePendingRejection(selectedCandidate)}
      />

      <RejectCandidateModal
        candidate={candidatePendingRejection}
        isSubmitting={candidatePendingRejection ? isBusy(candidatePendingRejection.id) : false}
        onClose={() => setCandidatePendingRejection(null)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
