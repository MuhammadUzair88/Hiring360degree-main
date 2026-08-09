import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOfferedCandidatesByJobId,
  getOfferLetterSettings,
  saveOfferLetterSettings,
  notifyCandidate,
  selectCandidatesWithOffers,
  buildOfferSnapshot,
  DEFAULT_OFFER_DESIGN,
  DEFAULT_OFFER_VALIDITY_DAYS,
} from "./data";
import { DEFAULT_OFFER_COLORS } from "./Theme";
import { useToast } from "../../../../context/ToastContext";
import { extractErrorMessage } from "../../../../services/apiClient";

/**
 * Main state hook for the Offer Letter system. Every property/action
 * OfferLetterOverview.jsx reads off `offerLetter.*` is returned here —
 * if you add a new button/card that needs hook state, add it here
 * first, then wire the component to it.
 */
export function useOfferLetterLogic(jobId) {
  const navigate = useNavigate();
  const toast = useToast();

  // ─── Core state ─────────────────────────────────────────────
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [design, setDesign] = useState(DEFAULT_OFFER_DESIGN);
  const [signature, setSignature] = useState(null);
  const [offerValidityDays, setOfferValidityDays] = useState(DEFAULT_OFFER_VALIDITY_DAYS);
  const [isConfigured, setIsConfigured] = useState(false);
  const [step, setStep] = useState("dashboard"); // "dashboard" | "studio"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Notify state ───────────────────────────────────────────
  const [notifyingId, setNotifyingId] = useState(null);
  const [notifyTab, setNotifyTab] = useState("pending");

  // ─── Preview modal state ────────────────────────────────────
  const [previewApplicationId, setPreviewApplicationId] = useState(null);

  // ─── Load candidates + saved settings ──────────────────────
  const loadData = useCallback(async () => {
    if (!jobId) return;
    setIsLoading(true);
    setError(null);

    try {
      const fetchedCandidates = await getOfferedCandidatesByJobId(jobId);
      setCandidates(fetchedCandidates);
      setSelectedCandidateId((prev) => prev || fetchedCandidates[0]?.applicationId || null);

      const settings = await getOfferLetterSettings(jobId);
      if (settings) {
        setDesign({
          theme: settings.template || DEFAULT_OFFER_DESIGN.theme,
          colors: settings.colors || DEFAULT_OFFER_COLORS,
          brandingPreference: settings.brandingPreference || DEFAULT_OFFER_DESIGN.brandingPreference,
          logoSize: settings.logoSize || DEFAULT_OFFER_DESIGN.logoSize,
          headingSize: settings.headingSize || DEFAULT_OFFER_DESIGN.headingSize,
          bodyFontSize: settings.bodyFontSize || DEFAULT_OFFER_DESIGN.bodyFontSize,
          signatureSize: settings.signatureSize || DEFAULT_OFFER_DESIGN.signatureSize,
          spacing: settings.spacing || DEFAULT_OFFER_DESIGN.spacing,
        });
        setSignature(settings.signature || null);
        setOfferValidityDays(settings.offerValidityDays || DEFAULT_OFFER_VALIDITY_DAYS);
        setIsConfigured(Boolean(settings.signature?.url));
      } else {
        setIsConfigured(false);
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load offer letter data"));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persists the current design/signature/validity to storage. Called
  // whenever the studio closes or a setting changes "live".
  const persistSettings = useCallback(
    async (patch = {}) => {
      if (!jobId) return;
      const ok = await saveOfferLetterSettings(jobId, {
        template: design.theme,
        colors: design.colors,
        brandingPreference: design.brandingPreference,
        logoSize: design.logoSize,
        headingSize: design.headingSize,
        bodyFontSize: design.bodyFontSize,
        signatureSize: design.signatureSize,
        spacing: design.spacing,
        signature,
        offerValidityDays,
        ...patch,
      });
      if (!ok) toast.error("Failed to save your offer letter settings. Please try again.");
    },
    [jobId, design, signature, offerValidityDays, toast]
  );

  // ─── First-time setup ───────────────────────────────────────
  const finalizeSetup = useCallback(
    async (signatureData, validityDays = DEFAULT_OFFER_VALIDITY_DAYS) => {
      setSignature(signatureData);
      setOfferValidityDays(validityDays);
      await persistSettings({ signature: signatureData, offerValidityDays: validityDays });
      setIsConfigured(true);
    },
    [persistSettings]
  );

  // ─── Studio (design + signature) ────────────────────────────
  const openStudio = useCallback(() => setStep("studio"), []);

  // Design changes apply live; "closing" the studio just persists
  // whatever's currently in state and returns to the dashboard.
  const closeStudio = useCallback(async () => {
    await persistSettings();
    setStep("dashboard");
  }, [persistSettings]);

  const updateDesign = useCallback((patch) => {
    setDesign((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDesignColors = useCallback((themeKey) => {
    setDesign((prev) => ({
      ...prev,
      colors: { ...prev.colors, [themeKey]: { ...DEFAULT_OFFER_COLORS[themeKey] } },
    }));
  }, []);

  const saveSignature = useCallback(
    async (newSignature) => {
      setSignature(newSignature);
      await persistSettings({ signature: newSignature });
    },
    [persistSettings]
  );

  // ─── Candidate selection ─────────────────────────────────────
  const selectCandidate = useCallback((applicationId) => {
    setSelectedCandidateId(applicationId);
  }, []);

  const activeCandidate = useMemo(
    () => candidates.find((c) => c.applicationId === selectedCandidateId) || null,
    [candidates, selectedCandidateId]
  );

  // ─── Editor (standalone route) ──────────────────────────────
  // "Create Offer" / "Generate" / "Edit" all push to the standalone
  // Edit Offer Letter page rather than toggling local state. Adjust
  // this path if EditOfferLetter.jsx is mounted at a different route.
  const openEditor = useCallback(
    (applicationId) => {
      navigate(`/advertisement/job/${jobId}/offer-letter/${applicationId}/edit`);
    },
    [navigate, jobId]
  );

  // ─── Notify ──────────────────────────────────────────────────
  const candidatesWithOffers = useMemo(() => selectCandidatesWithOffers(candidates), [candidates]);

  const triggerNotify = useCallback(async (applicationId, offerLetterImageUrl) => {
    setNotifyingId(applicationId);
    setError(null);
    try {
      const result = await notifyCandidate(applicationId, offerLetterImageUrl);
      if (result.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.applicationId === applicationId
              ? { ...c, notified: true, status: "Notified", notifiedAt: result.notifiedAt }
              : c
          )
        );
      } else {
        setError(result.error || "Failed to notify candidate.");
        toast.error(result.error || "Failed to notify candidate.");
      }
    } catch (err) {
      const message = extractErrorMessage(err, "Failed to notify candidate.");
      setError(message);
      toast.error(message);
    } finally {
      setNotifyingId(null);
    }
  }, [toast]);

  // ─── Preview modal ───────────────────────────────────────────
  const openPreview = useCallback((applicationId) => setPreviewApplicationId(applicationId), []);
  const closePreview = useCallback(() => setPreviewApplicationId(null), []);

  const previewCandidate = useMemo(
    () => candidates.find((c) => c.applicationId === previewApplicationId) || null,
    [candidates, previewApplicationId]
  );

  const getOfferForCandidate = useCallback(
    (applicationId) => buildOfferSnapshot(candidates.find((c) => c.applicationId === applicationId)),
    [candidates]
  );

  return {
    // Loading / config
    isLoading,
    error,
    isConfigured,
    finalizeSetup,

    // Navigation
    step,
    setStep,
    openStudio,
    closeStudio,
    openEditor,

    // Candidates
    candidates,
    selectedCandidateId,
    selectCandidate,
    activeCandidate,
    candidatesWithOffers,

    // Design + signature
    design,
    updateDesign,
    resetDesignColors,
    signature,
    saveSignature,
    offerValidityDays,

    // Notify
    notifyingId,
    notifyTab,
    setNotifyTab,
    triggerNotify,

    // Preview
    previewApplicationId,
    previewCandidate,
    openPreview,
    closePreview,
    getOfferForCandidate,

    // Manual refresh (e.g. after returning from the edit page)
    loadData,
  };
}