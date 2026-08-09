import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../../../context/AuthContext";
import { useJob } from "../../../context/JobContext";

export default function OfferLetterPage() {
  const navigate = useNavigate();
  const { jobId, job } = useJob();
  const { organization } = useAuth();

  const offerLetter = useOfferLetterLogic(jobId);
  const {
    isLoading,
    error,
    isConfigured,
    finalizeSetup,
    step,
    setStep,
    openStudio,
    closeStudio,
    openEditor,
    candidates,
    selectedCandidateId,
    selectCandidate,
    activeCandidate,
    candidatesWithOffers,
    design,
    updateDesign,
    resetDesignColors,
    signature,
    saveSignature,
    offerValidityDays,
    notifyingId,
    notifyTab,
    setNotifyTab,
    triggerNotify,
    previewApplicationId,
    previewCandidate,
    openPreview,
    closePreview,
    getOfferForCandidate,
  } = offerLetter;

  const [pendingSetupSkip, setPendingSetupSkip] = useState(false);

  const organizationForDisplay = organization || {};
  const advertisementForDisplay = job || {};

  // First visit for this job's offer letter settings: ask for a signature
  // before anything else can be generated (skippable — a candidate can
  // still be selected/reviewed without a signature yet).
  if (!isLoading && !isConfigured && !pendingSetupSkip) {
    return (
      <OfferLetterSetupModal
        onFinalize={(signatureData, validityDays) => finalizeSetup(signatureData, validityDays)}
        organizationName={organizationForDisplay.name || "Your Organization"}
      />
    );
  }

  if (step === "studio") {
    return (
      <OfferLetterStudio
        organizationName={organizationForDisplay.name || "Your Organization"}
        organization={organizationForDisplay}
        advertisement={advertisementForDisplay}
        previewCandidate={activeCandidate}
        design={design}
        onDesignChange={updateDesign}
        onResetColors={resetDesignColors}
        signature={signature}
        onSignatureChange={saveSignature}
        onBack={closeStudio}
      />
    );
  }

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

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          <div className="xl:col-span-1">
            <SelectedCandidatesCard
              candidates={candidates}
              selectedId={selectedCandidateId}
              onSelect={selectCandidate}
              onCreateOffer={(id) => openEditor(id)}
              isLoading={isLoading}
            />
          </div>

          <div className="xl:col-span-2">
            <OfferLetterCard
              candidate={activeCandidate}
              organization={organizationForDisplay}
              advertisement={advertisementForDisplay}
              design={design}
              signature={signature}
              offerValidityDays={offerValidityDays}
              totalCandidates={candidates.length}
              onCustomize={openStudio}
              onEdit={() => activeCandidate && openEditor(activeCandidate.applicationId)}
              onGenerate={() => activeCandidate && openEditor(activeCandidate.applicationId)}
            />
          </div>

          <div className="xl:col-span-1">
            <NotifyCandidatesCard
              candidates={candidatesWithOffers}
              activeTab={notifyTab}
              onTabChange={setNotifyTab}
              notifyingId={notifyingId}
              selectedId={selectedCandidateId}
              onSelect={selectCandidate}
              onEditCandidate={(id) => openEditor(id)}
              onNotify={(id) => triggerNotify(id)}
              onPreviewCandidate={openPreview}
            />
          </div>
        </div>
      </div>

      <OfferLetterPreviewModal
        isOpen={Boolean(previewApplicationId)}
        onClose={closePreview}
        candidate={previewCandidate}
        organization={organizationForDisplay}
        advertisement={advertisementForDisplay}
        design={design}
        signature={signature}
        offerValidityDays={offerValidityDays}
        offer={getOfferForCandidate(previewApplicationId)}
      />
    </>
  );
}
