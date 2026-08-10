import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { OfferLetterContentEditor } from "../../../components/organization/jobAdvertisement/offerLetter";
import {
  getOfferLetterByApplicationId,
  saveOfferLetterContent,
  getOfferedCandidatesByJobId,
  getOfferLetterSettings,
  DEFAULT_OFFER_DESIGN,
} from "../../../components/organization/jobAdvertisement/offerLetter/data";
import { resolveOfferPalette } from "../../../components/organization/jobAdvertisement/offerLetter/Theme";
import { useAuth } from "../../../context/AuthContext";
import advertisementService from "../../../services/advertisementService";
import { extractErrorMessage } from "../../../services/apiClient";
import { useToast } from "../../../context/ToastContext";

export default function EditOfferLetter() {
  const params = useParams();
  const jobId = params.id || params.jobId || null;
  const applicationId = params.applicationId || null;

  const navigate = useNavigate();
  const { organization } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [advertisement, setAdvertisement] = useState(null);
  const [otherCandidates, setOtherCandidates] = useState([]);
  const [offerData, setOfferData] = useState(null);
  const [design, setDesign] = useState(() => ({
    ...DEFAULT_OFFER_DESIGN,
    colors: resolveOfferPalette(
      DEFAULT_OFFER_DESIGN.colors,
      DEFAULT_OFFER_DESIGN.theme
    ),
  }));
  const [signature, setSignature] = useState(null);
  const [loadError, setLoadError] = useState("");

  const backTo = jobId
    ? `/advertisement/job/${jobId}/offer-letter`
    : "/advertisement";

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError("");

      if (!jobId || !applicationId) {
        if (active) {
          setLoadError("The offer letter route is missing the job or application ID.");
          setLoading(false);
        }
        return;
      }

      try {
        const [candidates, adData, settings, offer] = await Promise.all([
          getOfferedCandidatesByJobId(jobId),
          advertisementService.getById(jobId),
          getOfferLetterSettings(jobId),
          getOfferLetterByApplicationId(applicationId),
        ]);

        if (!active) return;

        const selectedCandidate = candidates.find(
          (item) => String(item.applicationId) === String(applicationId)
        );

        setAdvertisement(adData?.advertisement || null);
        setOfferData(offer || null);

        if (!selectedCandidate) {
          setCandidate(null);
          setOtherCandidates([]);
          return;
        }

        setCandidate(selectedCandidate);

        setOtherCandidates(
          candidates
            .filter(
              (item) =>
                String(item.applicationId) !== String(applicationId) &&
                !item.hasOffer
            )
            .map((item) => ({
              id: String(item.applicationId),
              name: item.name,
              jobTitle: item.position,
            }))
        );

        if (settings) {
          const theme = settings.template || DEFAULT_OFFER_DESIGN.theme;

          setDesign({
            ...DEFAULT_OFFER_DESIGN,
            theme,
            colors: resolveOfferPalette(settings.colors, theme),
            brandingPreference:
              settings.brandingPreference ||
              DEFAULT_OFFER_DESIGN.brandingPreference,
            logoSize: settings.logoSize ?? DEFAULT_OFFER_DESIGN.logoSize,
            headingSize:
              settings.headingSize ?? DEFAULT_OFFER_DESIGN.headingSize,
            bodyFontSize:
              settings.bodyFontSize ?? DEFAULT_OFFER_DESIGN.bodyFontSize,
            signatureSize:
              settings.signatureSize ?? DEFAULT_OFFER_DESIGN.signatureSize,
            spacing: settings.spacing ?? DEFAULT_OFFER_DESIGN.spacing,
          });

          setSignature(settings.signature || null);
        } else {
          setDesign({
            ...DEFAULT_OFFER_DESIGN,
            colors: resolveOfferPalette(
              DEFAULT_OFFER_DESIGN.colors,
              DEFAULT_OFFER_DESIGN.theme
            ),
          });
          setSignature(null);
        }
      } catch (error) {
        if (!active) return;

        const message = extractErrorMessage(
          error,
          "Failed to load the offer letter editor."
        );

        setLoadError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [jobId, applicationId, toast]);

  const handleSave = async (
    targetApplicationId,
    content,
    selectedIds = []
  ) => {
    try {
      if (!targetApplicationId) {
        throw new Error("Application ID is missing.");
      }

      if (!content?.offerLetterImageUrl) {
        throw new Error(
          "The offer letter image was not generated. Please try saving again."
        );
      }

      await saveOfferLetterContent(
        targetApplicationId,
        content,
        selectedIds
      );

      // Verify the document URL actually reached MongoDB before leaving the editor.
      const savedOffer = await getOfferLetterByApplicationId(
        targetApplicationId
      );

      if (!savedOffer?.offerLetterUrl) {
        throw new Error(
          "The offer content was saved, but the email attachment URL was not stored."
        );
      }

      toast.success("Offer letter and email attachment saved successfully.");

      // Replace prevents returning to a stale editor page with browser back.
      navigate(backTo, {
        replace: true,
        state: {
          refreshOffers: true,
          savedApplicationId: String(targetApplicationId),
          offerLetterUrl: savedOffer.offerLetterUrl,
        },
      });
    } catch (error) {
      console.error("Offer letter save failed:", error);
      toast.error(
        extractErrorMessage(
          error,
          "Failed to save this offer letter."
        )
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
        Loading offer letter…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-red-700">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="px-4 py-2 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Offer Letters
        </button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-gray-500">
          Candidate not found or is no longer in the Offered stage.
        </p>
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="px-4 py-2 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Offer Letters
        </button>
      </div>
    );
  }

  return (
    <OfferLetterContentEditor
      candidate={candidate}
      organization={organization || {}}
      advertisement={advertisement || {}}
      design={design}
      signature={signature}
      initialJoiningDate={
        offerData?.content?.joiningDate || candidate.joiningDate || ""
      }
      initialEndingDate={
        offerData?.content?.endingDate || candidate.endingDate || ""
      }
      initialOfferContent={offerData?.content || null}
      otherCandidates={otherCandidates}
      isEditing={Boolean(offerData)}
      onSave={handleSave}
      onCancel={() => navigate(backTo)}
    />
  );
}