import offerLetterService from "../../../../services/offerLetterService";

/* ────────────────────────────────────────────────────────────────────
   1. IDS & STORAGE KEYS
──────────────────────────────────────────────────────────────────── */

// Used when this module is rendered outside a route (e.g. Storybook/demo).
export const SAMPLE_JOB_ID = "6a6505edf4f0af318b5084d0";

// localStorage namespaces (mirrors the pattern used by rounds/data.js).
export const OFFER_STORAGE_KEY_PREFIX = "offer-settings:"; // design + signature + validity
export const OFFER_LETTERS_STORAGE_KEY_PREFIX = "offer-letters:"; // per-candidate saved content

/* ────────────────────────────────────────────────────────────────────
   2. DESIGN DEFAULTS
──────────────────────────────────────────────────────────────────── */

export const DEFAULT_OFFER_DESIGN = {
  theme: "corporate",
  colors: null, // falls back to DEFAULT_OFFER_COLORS from Theme.jsx
  brandingPreference: "logo-name",
  logoSize: 140,
  headingSize: 140,
  bodyFontSize: 140,
  signatureSize: 125,
  spacing: 125,
};

// How many days a candidate has to accept, counted from the letter date.
export const DEFAULT_OFFER_VALIDITY_DAYS = 7;

/* ────────────────────────────────────────────────────────────────────
   3. EMPLOYMENT-TYPE RULES
──────────────────────────────────────────────────────────────────── */

// Employment types that require an ending date on the offer letter.
export const CONTRACT_TYPES = ["Contract", "Internship", "Paid Internship", "Unpaid Internship"];

export const DEFAULT_ROUND_NAMES = ["Technical Round", "HR Round"];

/* ────────────────────────────────────────────────────────────────────
   4. STATUS CONSTANTS
──────────────────────────────────────────────────────────────────── */

export const NOTIFICATION_STATUS = {
  PENDING: "Pending",
  NOTIFIED: "Notified",
  FAILED: "Failed",
};

export const OFFER_STATUS = {
  DRAFT: "Draft",
  GENERATED: "Generated",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
};

/* ────────────────────────────────────────────────────────────────────
   5. REFERENCE / MOCK DATA
──────────────────────────────────────────────────────────────────── */

export const interviewerList = [
  { id: "int-01", name: "Elena Rodriguez", email: "elena.rodriguez@hrcore.com", type: "Senior HR Partner" },
  { id: "int-02", name: "David Chen", email: "david.chen@hrcore.com", type: "Engineering Lead" },
  { id: "int-03", name: "Sarah Jenkins", email: "sarah.jenkins@hrcore.com", type: "Core Engineering" },
];

export const mockOrganization = {
  name: "HireHub Inc.",
  logo: null,
  location: "123 Business Avenue, Suite 400, Hyderabad, Sindh, PK",
  email: "hr@hirehub.com",
  phone: "+92 300 1234567",
  website: "www.hirehub.com",
};

export const mockAdvertisement = {
  _id: SAMPLE_JOB_ID,
  jobTitle: "Senior Frontend Engineer",
  department: "Engineering",
  employmentType: "Full-time",
  workMode: "Hybrid",
  location: "Hyderabad, Pakistan",
  salary: "$85,000 - $120,000 / year",
  internshipPaid: "",
  internshipDuration: "",
  experience: "Senior",
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
  description: "We are looking for a Senior Frontend Engineer to lead our product development team.",
};

export const QUICK_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

/**
 * @typedef {Object} OfferCandidate
 * @property {string} id
 * @property {string} applicationId
 * @property {string} jobId
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} position
 * @property {boolean} hasOffer        - an offer letter has been generated
 * @property {boolean} notified        - convenience flag, mirrors status === "Notified"
 * @property {string} status           - one of NOTIFICATION_STATUS / OFFER_STATUS values
 * @property {string|null} joiningDate - ISO date (yyyy-mm-dd)
 * @property {string|null} endingDate  - ISO date, only for contract/internship roles
 * @property {Object|null} offerContent - { paragraph1, paragraph2, paragraph3, fieldsSectionLabel, additionalFields }
 * @property {string|null} offerLetterUrl
 * @property {string|null} notifiedAt  - ISO timestamp
 */

// Mock candidates that have passed every interview round (ready for an offer).
export const offeredCandidatesList = [
  {
    id: "off-01",
    applicationId: "6b1f0a2c4f0af318b5084e02",
    jobId: SAMPLE_JOB_ID,
    name: "Sumit Sharma",
    email: "sharma.sumit.6574@gmail.com",
    phone: "+92 301 2223344",
    position: "Senior Frontend Engineer",
    hasOffer: false,
    notified: false,
    status: NOTIFICATION_STATUS.PENDING,
    joiningDate: null,
    endingDate: null,
    offerContent: null,
    offerLetterUrl: null,
    notifiedAt: null,
  },
  {
    id: "off-02",
    applicationId: "6b1f0a2c4f0af318b5084e03",
    jobId: SAMPLE_JOB_ID,
    name: "Ayesha Khan",
    email: "ayesha.khan.dev@gmail.com",
    phone: "+92 302 5556677",
    position: "Full Stack Developer",
    hasOffer: true,
    notified: true,
    status: NOTIFICATION_STATUS.NOTIFIED,
    joiningDate: "2026-08-15",
    endingDate: null,
    offerContent: null,
    offerLetterUrl: null,
    notifiedAt: "2026-07-20T09:12:00.000Z",
  },
  {
    id: "off-03",
    applicationId: "6b1f0a2c4f0af318b5084e05",
    jobId: SAMPLE_JOB_ID,
    name: "Marcus Vane",
    email: "marcus.vane@gmail.com",
    phone: "+92 303 8889900",
    position: "Product Designer",
    hasOffer: false,
    notified: false,
    status: NOTIFICATION_STATUS.PENDING,
    joiningDate: null,
    endingDate: null,
    offerContent: null,
    offerLetterUrl: null,
    notifiedAt: null,
  },
];

/* ────────────────────────────────────────────────────────────────────
   7. API — CANDIDATES
──────────────────────────────────────────────────────────────────── */

/**
 * GET /api/offer/candidates/:advertisementId
 * Returns candidates who have passed all interview rounds (status
 * "Offered") for this job, each annotated with whether an offer letter
 * has already been generated/sent for them.
 * @returns {Promise<OfferCandidate[]>}
 */
export async function getOfferedCandidatesByJobId(jobId) {
  if (!jobId) return [];
  const data = await offerLetterService.getOfferedCandidates(jobId);
  return (data.candidates || []).map((c) => ({
    ...c,
    id: c.applicationId,
    jobId,
    notified: c.status === NOTIFICATION_STATUS.NOTIFIED,
    offerContent: null,
    offerLetterUrl: null,
    notifiedAt: null,
  }));
}

/**
 * GET /api/offer/letter/:applicationId
 * Returns one candidate's saved offer letter content, if any.
 */
export async function getOfferLetterByApplicationId(applicationId) {
  const data = await offerLetterService.getCandidateOfferLetter(applicationId);
  const offerLetter = data.offerLetter;
  if (!offerLetter) return null;

  return {
    content: {
      joiningDate: offerLetter.content?.joiningDate || "",
      endingDate: offerLetter.content?.endingDate || "",
      paragraph1: offerLetter.content?.paragraph1 || "",
      paragraph2: offerLetter.content?.paragraph2 || "",
      paragraph3: offerLetter.content?.paragraph3 || "",
      fieldsSectionLabel: offerLetter.content?.fieldsSectionLabel || "",
      additionalFields: offerLetter.content?.additionalFields || [],
    },
    status: offerLetter.status || NOTIFICATION_STATUS.PENDING,
    offerLetterUrl: offerLetter.offerLetterUrl || null,
  };
}

/**
 * PUT /api/offer/customize/:applicationId
 * Saves joining/ending dates + letter content for one candidate. The
 * backend only supports one application at a time, so a bulk selection
 * is applied with one request per candidate.
 *
 * @param {string} applicationId
 * @param {{joiningDate:string, endingDate:string, offerContent:Object}} data
 * @param {string[]} [bulkApplicationIds]
 */
export async function saveOfferLetterContent(applicationId, data, bulkApplicationIds = []) {
  const targetIds = [applicationId, ...bulkApplicationIds];
  const payload = {
    joiningDate: data.joiningDate,
    endingDate: data.endingDate || null,
    paragraph1: data.offerContent?.paragraph1,
    paragraph2: data.offerContent?.paragraph2,
    paragraph3: data.offerContent?.paragraph3,
    additionalFields: data.offerContent?.additionalFields || [],
  };

  await Promise.all(targetIds.map((id) => offerLetterService.customizeCandidateOfferLetter(id, payload)));

  return { success: true, updatedIds: targetIds };
}

/**
 * POST /api/offer/notify/:applicationId
 * Emails the candidate their offer letter and marks it as sent.
 */
export async function notifyCandidate(applicationId, offerLetterImageUrl) {
  try {
    const data = await offerLetterService.notifyCandidate(applicationId, { offerLetterImageUrl });
    return { success: true, notifiedAt: new Date().toISOString(), offerLetter: data.offerLetter };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to notify candidate" };
  }
}

/** Convenience selector: candidates that already have a generated offer. */
export function selectCandidatesWithOffers(candidates = []) {
  return candidates.filter((c) => c.hasOffer);
}

/** Builds the `offer` shape OfferLetterPreviewModal expects from a candidate. */
export function buildOfferSnapshot(candidate) {
  if (!candidate) return null;
  return {
    joiningDate: candidate.joiningDate || "",
    endingDate: candidate.endingDate || "",
    offerContent: candidate.offerContent || null,
  };
}

/* ────────────────────────────────────────────────────────────────────
   8. API — SETTINGS (design + signature + offer validity)
──────────────────────────────────────────────────────────────────── */

/**
 * GET /api/offer/settings/:advertisementId
 * Returns saved design settings, signature, and validity window.
 * Returns null on first visit so the caller knows to show setup.
 */
export async function getOfferLetterSettings(advertisementId) {
  if (!advertisementId) return null;
  const data = await offerLetterService.getSettings(advertisementId);
  return data.settings || null;
}

/**
 * PUT /api/offer/settings/:advertisementId
 * @param {string} advertisementId
 * @param {{template?:string, colors?:Object, brandingPreference?:string,
 *   logoSize?:number, headingSize?:number, bodyFontSize?:number,
 *   signatureSize?:number, spacing?:number, signature?:Object,
 *   offerValidityDays?:number}} settings
 */
export async function saveOfferLetterSettings(advertisementId, settings) {
  try {
    await offerLetterService.updateSettings(advertisementId, {
      template: settings.template,
      colors: settings.colors,
      brandingPreference: settings.brandingPreference,
      logoSize: settings.logoSize,
      headingSize: settings.headingSize,
      bodyFontSize: settings.bodyFontSize,
      signatureSize: settings.signatureSize,
      spacing: settings.spacing,
      signatureUrl: settings.signature?.url,
    });
    return true;
  } catch (error) {
    return false;
  }
}