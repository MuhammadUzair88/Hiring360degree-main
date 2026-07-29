import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Bookmark, CheckCircle2 } from "lucide-react";
import CandidateIntakeStats from "./CandidateIntakeStats";
import CandidateColumn from "./CandidateColumn";
import CandidateCard from "./CandidateCard";
import CandidateDetailDrawer from "./CandidateDetailDrawer";
import RejectCandidateModal from "./RejectCandidateModal";
import { CANDIDATE_STATUS, getCandidatesByJobId } from "./data";

// Stand-in for a real network call. Swap the body for an actual
// `fetch`/`api.put` once the backend routes exist — everything that
// calls this already awaits it, so nothing else needs to change.
function simulateRequest(delay = 600) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Owns every piece of state for the Candidate Intake screen: the
 * candidate list, which card is busy mid-request, which one is open
 * in the drawer, which one is pending a reject confirmation, which
 * candidates have been AI analyzed, and drag-and-drop state.
 * Everything else in this folder is presentation-only and just
 * receives props from here.
 */
export default function CandidateIntakeOverview({ jobId: jobIdProp }) {
  const { id: jobIdFromRoute } = useParams();
  const jobId = jobIdProp || jobIdFromRoute;

  const [candidates, setCandidates] = useState(() => getCandidatesByJobId(jobId));
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidatePendingRejection, setCandidatePendingRejection] = useState(null);
  const [busyIds, setBusyIds] = useState({});

  // Tracks which candidates have been run through the AI analyzer.
  // Shared between the card and the drawer so the two stay in sync.
  const [analyzedIds, setAnalyzedIds] = useState({});
  const [analyzingIds, setAnalyzingIds] = useState({});

  // Drag-and-drop: which candidate is currently being dragged, and
  // which column is currently being hovered over (for the highlight).
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  // TODO: replace with a real GET /api/application/job/:jobId call —
  // for now the board reloads from the dummy dataset whenever the job changes.
  useEffect(() => {
    setCandidates(getCandidatesByJobId(jobId));
    setSelectedCandidateId(null);
    setAnalyzedIds({});
    setAnalyzingIds({});
    setDraggingId(null);
    setDragOverStatus(null);
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

  async function runStatusChange(candidate, { nextStatus, errorMessage }) {
    setBusy(candidate.id, true);
    try {
      // TODO: replace simulateRequest() with the real PUT call once the route exists.
      await simulateRequest();
      updateCandidateStatus(candidate.id, nextStatus);
    } catch (error) {
      alert(errorMessage);
    } finally {
      setBusy(candidate.id, false);
    }
  }

  const handleBookmark = (candidate) =>
    runStatusChange(candidate, {
      nextStatus: CANDIDATE_STATUS.BOOKMARKED,
      errorMessage: "Failed to bookmark candidate. Please try again.",
    });

  const handleShortlist = (candidate) =>
    runStatusChange(candidate, {
      nextStatus: CANDIDATE_STATUS.SHORTLISTED,
      errorMessage: "Failed to shortlist candidate. Please try again.",
    });

  const handleMoveToPending = (candidate) =>
    runStatusChange(candidate, {
      nextStatus: CANDIDATE_STATUS.PENDING,
      errorMessage: "Failed to move candidate. Please try again.",
    });

  const handleConfirmReject = async () => {
    if (!candidatePendingRejection) return;
    const candidate = candidatePendingRejection;
    setCandidatePendingRejection(null);
    setBusy(candidate.id, true);
    try {
      // TODO: replace simulateRequest() with the real PUT call once the route exists.
      await simulateRequest();
      removeCandidate(candidate.id);
      if (selectedCandidateId === candidate.id) setSelectedCandidateId(null);
    } catch (error) {
      alert("Failed to reject candidate. Please try again.");
    } finally {
      setBusy(candidate.id, false);
    }
  };

  // Runs the "AI analysis" for one candidate. In this dummy-data setup
  // the evaluation already lives on candidate.aiEvaluation — analyzing
  // just reveals it after a short simulated delay, standing in for the
  // real POST /api/application/analyze/:id call you'll add later.
  const handleAnalyze = async (candidate) => {
    if (analyzedIds[candidate.id] || analyzingIds[candidate.id]) return;
    setAnalyzingIds((prev) => ({ ...prev, [candidate.id]: true }));
    try {
      await simulateRequest(1400);
      setAnalyzedIds((prev) => ({ ...prev, [candidate.id]: true }));
    } finally {
      setAnalyzingIds((prev) => ({ ...prev, [candidate.id]: false }));
    }
  };

  // --- Drag-and-drop wiring -------------------------------------------
  // Dropping a card on a column routes to the exact same handlers the
  // card's own action buttons use, so a drag-move and a button-click
  // move both go through one code path (and one simulated PUT call).
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
              isAnalyzed={Boolean(analyzedIds[candidate.id])}
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
              isAnalyzed={Boolean(analyzedIds[candidate.id])}
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
              isAnalyzed={Boolean(analyzedIds[candidate.id])}
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
        isAnalyzed={selectedCandidate ? Boolean(analyzedIds[selectedCandidate.id]) : false}
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