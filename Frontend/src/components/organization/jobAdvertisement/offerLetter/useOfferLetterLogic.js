import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOfferedCandidatesByJobId,
  getOfferLetterByApplicationId,
  getOfferLetterSettings,
  saveOfferLetterSettings,
  notifyCandidate,
  selectCandidatesWithOffers,
  buildOfferSnapshot,
  DEFAULT_OFFER_DESIGN,
} from "./data";
import { resolveOfferPalette } from "./Theme";
import { useToast } from "../../../../context/ToastContext";
import { extractErrorMessage } from "../../../../services/apiClient";

function makeDefaultDesign(theme = DEFAULT_OFFER_DESIGN.theme) {
  return {
    ...DEFAULT_OFFER_DESIGN,
    theme,
    colors: resolveOfferPalette(null, theme),
  };
}

export function useOfferLetterLogic(jobId) {
  const navigate = useNavigate();
  const toast = useToast();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [design, setDesign] = useState(() => makeDefaultDesign());
  const [signature, setSignature] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [step, setStep] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifyingId, setNotifyingId] = useState(null);
  const [notifyTab, setNotifyTab] = useState("pending");
  const [previewApplicationId, setPreviewApplicationId] = useState(null);

  const loadData = useCallback(async () => {
    if (!jobId) {
      setCandidates([]);
      setSelectedCandidateId(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [fetchedCandidates, settings] = await Promise.all([
        getOfferedCandidatesByJobId(jobId),
        getOfferLetterSettings(jobId),
      ]);

      setCandidates(fetchedCandidates);
      setSelectedCandidateId((previous) => {
        const stillExists = fetchedCandidates.some(
          (candidate) => String(candidate.applicationId) === String(previous)
        );
        return stillExists ? previous : fetchedCandidates[0]?.applicationId || null;
      });

      if (settings) {
        const theme = settings.template || DEFAULT_OFFER_DESIGN.theme;
        setDesign({
          ...makeDefaultDesign(theme),
          theme,
          colors: resolveOfferPalette(settings.colors, theme),
          brandingPreference:
            settings.brandingPreference || DEFAULT_OFFER_DESIGN.brandingPreference,
          logoSize: settings.logoSize ?? DEFAULT_OFFER_DESIGN.logoSize,
          headingSize: settings.headingSize ?? DEFAULT_OFFER_DESIGN.headingSize,
          bodyFontSize:
            settings.bodyFontSize ?? DEFAULT_OFFER_DESIGN.bodyFontSize,
          signatureSize:
            settings.signatureSize ?? DEFAULT_OFFER_DESIGN.signatureSize,
          spacing: settings.spacing ?? DEFAULT_OFFER_DESIGN.spacing,
        });
        setSignature(settings.signature || null);
        setIsConfigured(Boolean(settings.signature?.url));
      } else {
        setDesign(makeDefaultDesign());
        setSignature(null);
        setIsConfigured(false);
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load offer letter data."));
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const persistSettings = useCallback(
    async (patch = {}) => {
      if (!jobId) return null;

      const patchedTheme = patch.template || patch.theme || design.theme;
      const patchedColors = resolveOfferPalette(
        patch.colors ?? design.colors,
        patchedTheme
      );

      try {
        return await saveOfferLetterSettings(jobId, {
          template: patchedTheme,
          colors: patchedColors,
          brandingPreference:
            patch.brandingPreference ?? design.brandingPreference,
          logoSize: patch.logoSize ?? design.logoSize,
          headingSize: patch.headingSize ?? design.headingSize,
          bodyFontSize: patch.bodyFontSize ?? design.bodyFontSize,
          signatureSize: patch.signatureSize ?? design.signatureSize,
          spacing: patch.spacing ?? design.spacing,
          signature: Object.prototype.hasOwnProperty.call(patch, "signature")
            ? patch.signature
            : signature,
        });
      } catch (err) {
        const message = extractErrorMessage(
          err,
          "Failed to save your offer letter settings."
        );
        toast.error(message);
        throw err;
      }
    },
    [jobId, design, signature, toast]
  );

  const finalizeSetup = useCallback(
    async (signatureData) => {
      const saved = await persistSettings({ signature: signatureData });
      const nextSignature = saved?.signature || signatureData || null;
      setSignature(nextSignature);
      setIsConfigured(Boolean(nextSignature?.url));
    },
    [persistSettings]
  );

  const openStudio = useCallback(() => setStep("studio"), []);

  const closeStudio = useCallback(async () => {
    try {
      await persistSettings();
      setStep("dashboard");
    } catch {
      // persistSettings already displays the error.
    }
  }, [persistSettings]);

  const updateDesign = useCallback((patch) => {
    setDesign((previous) => {
      const nextTheme = patch.theme || previous.theme;
      const themeChanged = patch.theme && patch.theme !== previous.theme;
      const colors = themeChanged
        ? resolveOfferPalette(patch.colors, nextTheme)
        : resolveOfferPalette(patch.colors ?? previous.colors, nextTheme);

      return {
        ...previous,
        ...patch,
        theme: nextTheme,
        colors,
      };
    });
  }, []);

  const resetDesignColors = useCallback((themeKey) => {
    setDesign((previous) => ({
      ...previous,
      colors: resolveOfferPalette(null, themeKey || previous.theme),
    }));
  }, []);

  const saveSignature = useCallback(
    async (newSignature) => {
      const saved = await persistSettings({ signature: newSignature });
      const nextSignature = saved?.signature || newSignature || null;
      setSignature(nextSignature);
      setIsConfigured(Boolean(nextSignature?.url));
    },
    [persistSettings]
  );

  const selectCandidate = useCallback((applicationId) => {
    setSelectedCandidateId(applicationId);
  }, []);

  const activeCandidate = useMemo(
    () =>
      candidates.find(
        (candidate) =>
          String(candidate.applicationId) === String(selectedCandidateId)
      ) || null,
    [candidates, selectedCandidateId]
  );

  const openEditor = useCallback(
    (applicationId) => {
      if (!applicationId || !jobId) return;
      navigate(`/advertisement/job/${jobId}/offer-letter/${applicationId}/edit`);
    },
    [navigate, jobId]
  );

  const candidatesWithOffers = useMemo(
    () => selectCandidatesWithOffers(candidates),
    [candidates]
  );

  /**
   * Re-fetch the individual offer before notification so a stale candidate-list
   * response can never incorrectly produce "Save Offer First".
   */
  const triggerNotify = useCallback(
    async (applicationId) => {
      if (!applicationId) return;

      setNotifyingId(applicationId);
      setError(null);

      try {
        const freshOffer = await getOfferLetterByApplicationId(applicationId);

        if (!freshOffer) {
          throw new Error("Create and save the candidate's offer letter first.");
        }

        if (!freshOffer.offerLetterUrl) {
          throw new Error(
            "The saved offer does not have its email attachment yet. Open Edit Offer and save the current letter once."
          );
        }

        const result = await notifyCandidate(
          applicationId,
          freshOffer.offerLetterUrl
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to notify candidate.");
        }

        const returnedUrl =
          result.offerLetter?.offerLetterUrl || freshOffer.offerLetterUrl;

        setCandidates((previous) =>
          previous.map((candidate) =>
            String(candidate.applicationId) === String(applicationId)
              ? {
                  ...candidate,
                  notified: true,
                  status: "Notified",
                  notifiedAt: result.notifiedAt,
                  offerLetterUrl: returnedUrl,
                  hasDocument: Boolean(returnedUrl),
                }
              : candidate
          )
        );

        toast.success("Candidate notified successfully.");
      } catch (err) {
        const message = extractErrorMessage(err, "Failed to notify candidate.");
        setError(message);
        toast.error(message);
      } finally {
        setNotifyingId(null);
      }
    },
    [toast]
  );

  const openPreview = useCallback(
    (applicationId) => setPreviewApplicationId(applicationId),
    []
  );

  const closePreview = useCallback(() => setPreviewApplicationId(null), []);

  const previewCandidate = useMemo(
    () =>
      candidates.find(
        (candidate) =>
          String(candidate.applicationId) === String(previewApplicationId)
      ) || null,
    [candidates, previewApplicationId]
  );

  const getOfferForCandidate = useCallback(
    (applicationId) =>
      buildOfferSnapshot(
        candidates.find(
          (candidate) => String(candidate.applicationId) === String(applicationId)
        )
      ),
    [candidates]
  );

  return {
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
    notifyingId,
    notifyTab,
    setNotifyTab,
    triggerNotify,
    previewApplicationId,
    previewCandidate,
    openPreview,
    closePreview,
    getOfferForCandidate,
    loadData,
  };
}
