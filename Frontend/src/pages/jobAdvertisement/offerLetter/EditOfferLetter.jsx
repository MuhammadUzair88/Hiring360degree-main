import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  OfferLetterContentEditor,
} from "../../../components/organization/jobAdvertisement/offerLetter";

import {
  getOfferLetterByApplicationId,
  saveOfferLetterContent,
  getOfferedCandidatesByJobId,
  getOfferLetterSettings,
  DEFAULT_OFFER_DESIGN,
} from "../../../components/organization/jobAdvertisement/offerLetter/data";
import { useAuth } from "../../../context/AuthContext";
import advertisementService from "../../../services/advertisementService";
import { extractErrorMessage } from "../../../services/apiClient";
import { useToast } from "../../../context/ToastContext";

export default function EditOfferLetter() {
  const { jobId, applicationId } = useParams();
  const navigate = useNavigate();
  const { organization } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [advertisement, setAdvertisement] = useState(null);
  const [otherCandidates, setOtherCandidates] = useState([]);
  const [offerData, setOfferData] = useState(null);
  const [design, setDesign] = useState(DEFAULT_OFFER_DESIGN);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [candidates, adData] = await Promise.all([
          getOfferedCandidatesByJobId(jobId),
          advertisementService.getById(jobId),
        ]);
        setAdvertisement(adData.advertisement || null);

        const selectedCandidate = candidates.find(
          (c) => c.applicationId === applicationId
        );

        if (!selectedCandidate) {
          setLoading(false);
          return;
        }

        setCandidate(selectedCandidate);

        setOtherCandidates(
          candidates
            .filter(
              (c) =>
                c.applicationId !== applicationId &&
                !c.hasOffer
            )
            .map((c) => ({
              id: c.applicationId,
              name: c.name,
              jobTitle: c.position,
            }))
        );

        const offer = await getOfferLetterByApplicationId(applicationId);

        setOfferData(offer);

        const settings = await getOfferLetterSettings(jobId);

        if (settings) {
          setDesign({
            theme: settings.template || DEFAULT_OFFER_DESIGN.theme,
            colors: settings.colors || DEFAULT_OFFER_DESIGN.colors,
            brandingPreference:
              settings.brandingPreference ||
              DEFAULT_OFFER_DESIGN.brandingPreference,
            logoSize:
              settings.logoSize ||
              DEFAULT_OFFER_DESIGN.logoSize,
            headingSize:
              settings.headingSize ||
              DEFAULT_OFFER_DESIGN.headingSize,
            bodyFontSize:
              settings.bodyFontSize ||
              DEFAULT_OFFER_DESIGN.bodyFontSize,
            signatureSize:
              settings.signatureSize ||
              DEFAULT_OFFER_DESIGN.signatureSize,
            spacing:
              settings.spacing ||
              DEFAULT_OFFER_DESIGN.spacing,
          });

          setSignature(settings.signature || null);
        }
      } catch (error) {
        toast.error(extractErrorMessage(error, "Failed to load the offer letter editor."));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId, applicationId]);

  const handleSave = async (
    applicationId,
    content,
    selectedIds = []
  ) => {
    try {
      await saveOfferLetterContent(
        applicationId,
        content,
        selectedIds
      );
      toast.success("Offer letter saved.");
      navigate(`/advertisement/job/${jobId}/offer-letter`);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to save this offer letter."));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-screen">
        Candidate not found.
      </div>
    );
  }

  return (
    <OfferLetterContentEditor
      candidate={candidate}
      organization={organization || {}}
      advertisement={advertisement || {}}
      theme={design.theme}
      colors={design.colors}
      brandingPreference={design.brandingPreference}
      logoSize={design.logoSize}
      headingSize={design.headingSize}
      bodyFontSize={design.bodyFontSize}
      signatureSize={design.signatureSize}
      spacing={design.spacing}
      signature={signature}
      initialJoiningDate={
        offerData?.content?.joiningDate ||
        candidate.joiningDate ||
        ""
      }
      initialEndingDate={
        offerData?.content?.endingDate ||
        candidate.endingDate ||
        ""
      }
      initialOfferContent={
        offerData?.content || null
      }
      otherCandidates={otherCandidates}
      isEditing
      onSave={handleSave}
      onCancel={() =>
        navigate(`/advertisement/job/${jobId}/offer-letter`)
      }
    />
  );
}