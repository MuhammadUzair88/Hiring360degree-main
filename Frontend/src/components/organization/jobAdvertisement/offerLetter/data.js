import offerLetterService from "../../../../services/offerLetterService";
import { DEFAULT_OFFER_COLORS, resolveOfferPalette } from "./Theme";

export function normalizeDateInputValue(value) {
  if (!value) return "";

  const raw = String(value);
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export const DEFAULT_OFFER_DESIGN = {
  theme: "corporate",
  colors: { ...DEFAULT_OFFER_COLORS.corporate },
  brandingPreference: "logo-name",
  logoSize: 145,
  headingSize: 145,
  bodyFontSize: 150,
  signatureSize: 120,
  spacing: 100,
};

export const CONTRACT_TYPES = [
  "Contract",
  "Internship",
  "Paid Internship",
  "Unpaid Internship",
];

export const NOTIFICATION_STATUS = {
  PENDING: "Pending",
  NOTIFIED: "Notified",
};

/** Candidates in the Offered application stage for one job. */
export async function getOfferedCandidatesByJobId(jobId) {
  if (!jobId) return [];

  const data = await offerLetterService.getOfferedCandidates(jobId);

  return (data?.candidates || []).map((candidate) => {
    const offerLetterUrl = candidate?.offerLetterUrl || null;

    return {
      ...candidate,
      applicationId: String(candidate.applicationId),
      id: String(candidate.applicationId),
      jobId: String(jobId),
      joiningDate: normalizeDateInputValue(candidate.joiningDate),
      endingDate: normalizeDateInputValue(candidate.endingDate),
      notified:
        candidate.notified === true ||
        candidate.status === NOTIFICATION_STATUS.NOTIFIED,
      offerContent: candidate.offerContent || null,
      offerLetterUrl,
      hasDocument: Boolean(offerLetterUrl),
      notifiedAt: candidate.notifiedAt || null,
    };
  });
}

/** One candidate's saved offer letter. */
export async function getOfferLetterByApplicationId(applicationId) {
  if (!applicationId) return null;

  const data = await offerLetterService.getCandidateOfferLetter(applicationId);
  const offerLetter = data?.offerLetter;
  if (!offerLetter) return null;

  const offerLetterUrl = offerLetter.offerLetterUrl || null;

  return {
    content: {
      joiningDate: normalizeDateInputValue(offerLetter.content?.joiningDate),
      endingDate: normalizeDateInputValue(offerLetter.content?.endingDate),
      paragraph1: offerLetter.content?.paragraph1 || "",
      paragraph2: offerLetter.content?.paragraph2 || "",
      paragraph3: offerLetter.content?.paragraph3 || "",
      fieldsSectionLabel: offerLetter.content?.fieldsSectionLabel || "",
      additionalFields: Array.isArray(offerLetter.content?.additionalFields)
        ? offerLetter.content.additionalFields
        : [],
    },
    status: offerLetter.status || NOTIFICATION_STATUS.PENDING,
    offerLetterUrl,
    hasDocument: Boolean(offerLetterUrl),
    notifiedAt: offerLetter.notifiedAt || null,
  };
}

/**
 * Save one personalized offer letter.
 * Bulk-selected candidates receive the same text/date content, but not the
 * active candidate's PNG because that image contains the active candidate's name.
 */
export async function saveOfferLetterContent(
  applicationId,
  data,
  bulkApplicationIds = []
) {
  if (!applicationId) {
    throw new Error("Application ID is missing.");
  }

  if (!data?.offerLetterImageUrl) {
    throw new Error("The personalized offer-letter image was not generated.");
  }

  const targetIds = [
    ...new Set(
      [applicationId, ...bulkApplicationIds]
        .filter(Boolean)
        .map((id) => String(id))
    ),
  ];

  const basePayload = {
    joiningDate: normalizeDateInputValue(data.joiningDate),
    endingDate: normalizeDateInputValue(data.endingDate) || null,
    paragraph1: data.offerContent?.paragraph1 || "",
    paragraph2: data.offerContent?.paragraph2 || "",
    paragraph3: data.offerContent?.paragraph3 || "",
    fieldsSectionLabel: data.offerContent?.fieldsSectionLabel || "",
    additionalFields: Array.isArray(data.offerContent?.additionalFields)
      ? data.offerContent.additionalFields
      : [],
  };

  const results = await Promise.all(
    targetIds.map((id) =>
      offerLetterService.customizeCandidateOfferLetter(id, {
        ...basePayload,
        offerLetterImageUrl:
          id === String(applicationId) ? data.offerLetterImageUrl : undefined,
      })
    )
  );

  const primaryResult = results[0];
  const primaryUrl = primaryResult?.offerLetter?.offerLetterUrl || null;

  if (!primaryUrl) {
    throw new Error(
      "Offer content was saved, but the personalized document URL was not stored."
    );
  }

  return {
    success: true,
    updatedIds: targetIds,
    primaryOffer: primaryResult.offerLetter,
  };
}

export async function notifyCandidate(applicationId, offerLetterImageUrl = null) {
  try {
    const data = await offerLetterService.notifyCandidate(
      applicationId,
      offerLetterImageUrl ? { offerLetterImageUrl } : {}
    );

    return {
      success: true,
      notifiedAt:
        data?.offerLetter?.notifiedAt ||
        data?.offerLetter?.updatedAt ||
        new Date().toISOString(),
      offerLetter: data?.offerLetter || null,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to notify candidate",
    };
  }
}

export function selectCandidatesWithOffers(candidates = []) {
  return candidates.filter((candidate) => candidate.hasOffer);
}

export function buildOfferSnapshot(candidate) {
  if (!candidate) return null;

  return {
    joiningDate: normalizeDateInputValue(candidate.joiningDate),
    endingDate: normalizeDateInputValue(candidate.endingDate),
    offerContent: candidate.offerContent || null,
    offerLetterUrl: candidate.offerLetterUrl || null,
    hasDocument: Boolean(candidate.offerLetterUrl),
  };
}

export async function getOfferLetterSettings(advertisementId) {
  if (!advertisementId) return null;
  const data = await offerLetterService.getSettings(advertisementId);
  return data?.settings || null;
}

export async function saveOfferLetterSettings(advertisementId, settings) {
  if (!advertisementId) return null;

  const theme = settings.template || DEFAULT_OFFER_DESIGN.theme;
  const colors = resolveOfferPalette(settings.colors, theme);

  const data = await offerLetterService.updateSettings(advertisementId, {
    template: theme,
    colors,
    brandingPreference: settings.brandingPreference,
    logoSize: settings.logoSize,
    headingSize: settings.headingSize,
    bodyFontSize: settings.bodyFontSize,
    signatureSize: settings.signatureSize,
    spacing: settings.spacing,
    signatureUrl: settings.signature?.url || null,
  });

  return data?.settings || null;
}
