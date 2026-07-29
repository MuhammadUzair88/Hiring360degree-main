import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useOfferLetterLogic,
  SelectedCandidatesCard,
  OfferLetterCard,
  NotifyCandidatesCard,
  OfferLetterPreviewModal,
  OfferLetterSetupModal,
  OfferLetterStudio,
} from "../../../components/organization/jobAdvertisement/offerLetter";
import { mockOrganization, mockAdvertisement } from "../../../components/organization/jobAdvertisement/offerLetter/data";

export default function OfferLetterPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const logic = useOfferLetterLogic(jobId);

  const {
    candidates,
    selectedCandidateId,
    selectedOfferData,
    activeCandidate,
    hasCandidates,
    isLoading,
    error,
    step,
    isFirstRun,
    isSetupComplete,
    design,
    signature,
    updateDesign,
    updateColor,
    resetColors,
    updateSignature,
    setStep,
    setSelectedCandidateId,
    handleSetupComplete,
    saveStudioSettings,
    openEditor,
    saveEditorContent,
    notifyingId,
    notifyTab,
    setNotifyTab,
    handleNotify,
  } = logic;

  const [previewModal, setPreviewModal] = React.useState({
    isOpen: false,
    candidate: null,
    offerLetterUrl: null,
  });

  const handlePreviewCandidate = (applicationId) => {
    const candidate = candidates.find(c => c.applicationId === applicationId);
    if (!candidate) return;
    const offerLetterUrl = candidate.offerLetterUrl || null;
    setPreviewModal({
      isOpen: true,
      candidate,
      offerLetterUrl,
    });
  };

  // If first run, show setup modal
  if (isFirstRun && step === "setup") {
    return (
      <OfferLetterSetupModal
        isOpen={true}
        onClose={() => {
          // User can skip, go to dashboard with no signature
          setStep("dashboard");
        }}
        onComplete={(sig) => {
          // Handle the signature completion
          handleSetupComplete(sig);
        }}
        organizationName={mockOrganization?.name || "Your Organization"}
      />
    );
  }

  // If in studio mode, show the studio
  if (step === "studio") {
    return (
      <OfferLetterStudio
        isFirstRun={false}
        organizationName={mockOrganization?.name || "Your Organization"}
        previewCandidate={activeCandidate || null}
        organization={mockOrganization || {}}
        advertisement={mockAdvertisement || {}}
        design={design}
        onDesignChange={updateDesign}
        onResetColors={resetColors}
        signature={signature}
        onSignatureChange={updateSignature}
        onSave={saveStudioSettings}
        onBack={() => setStep("dashboard")}
      />
    );
  }

  // Main dashboard
  return (
    <>
      <div className="space-y-6 animate-fadeIn font-sans text-slate-900 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-secondary-100 hover:bg-secondary-200/50 border border-secondary-300 text-slate-900 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Offer Letter</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage passed candidates, generate offer letters, and notify them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          <div className="xl:col-span-1">
            <SelectedCandidatesCard
              candidates={candidates}
              selectedId={selectedCandidateId}
              onSelect={setSelectedCandidateId}
              onCreateOffer={(id) => openEditor(id, false)}
              isLoading={isLoading}
            />
          </div>

          <div className="xl:col-span-2">
            <OfferLetterCard
              candidate={activeCandidate}
              organization={mockOrganization || {}}
              advertisement={mockAdvertisement || {}}
              design={design}
              signature={signature}
              totalCandidates={candidates.length}
              offer={selectedOfferData || { joiningDate: "", endingDate: "", offerContent: null }}
              onCustomize={() => setStep("studio")}
              onEdit={() => activeCandidate && openEditor(activeCandidate.applicationId, true)}
              onGenerate={() => activeCandidate && openEditor(activeCandidate.applicationId, false)}
              isLoading={isLoading}
            />
          </div>

          <div className="xl:col-span-1">
            <NotifyCandidatesCard
              candidates={candidates.filter(c => c.hasOffer)}
              activeTab={notifyTab}
              onTabChange={setNotifyTab}
              notifyingId={notifyingId}
              selectedId={selectedCandidateId}
              onSelect={setSelectedCandidateId}
              onEditCandidate={(id) => openEditor(id, true)}
              onNotify={handleNotify}
              onPreviewCandidate={handlePreviewCandidate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <OfferLetterPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, candidate: null, offerLetterUrl: null })}
        offerLetterUrl={previewModal.offerLetterUrl}
        candidateName={previewModal.candidate?.name}
      />
    </>
  );
}