

import React from "react";
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

  const organizationForDisplay = organization || {};
  const advertisementForDisplay = job || {};

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
        Loading offer letters…
      </div>
    );
  }

  if (!error && !isConfigured) {
    return (
      <OfferLetterSetupModal
        onFinalize={finalizeSetup}
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
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 bg-secondary-100 hover:bg-secondary-200/50 border border-secondary-300 text-slate-900 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-slate-900 text-xl sm:text-2xl font-semibold">
              Offer Letter
            </h1>
            <p className="text-gray-700 text-sm">
              Manage passed candidates, generate offer letters, and notify them.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          <div className="xl:col-span-1">
            <SelectedCandidatesCard
              candidates={candidates}
              selectedId={selectedCandidateId}
              onSelect={selectCandidate}
              onCreateOffer={openEditor}
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
              totalCandidates={candidates.length}
              onCustomize={openStudio}
              onEdit={() =>
                activeCandidate && openEditor(activeCandidate.applicationId)
              }
              onGenerate={() =>
                activeCandidate && openEditor(activeCandidate.applicationId)
              }
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
              onEditCandidate={openEditor}
              onNotify={triggerNotify}
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
        offer={getOfferForCandidate(previewApplicationId)}
      />
    </>
  );
}
