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
   6. INTERNAL HELPERS
──────────────────────────────────────────────────────────────────── */

// Simulates network latency so loading states are visible during dev.
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ────────────────────────────────────────────────────────────────────
   7. "API" — CANDIDATES
──────────────────────────────────────────────────────────────────── */

/**
 * Simulates GET /api/offer/candidates/:jobId
 * Returns candidates who have passed all interview rounds for this job.
 * @returns {Promise<OfferCandidate[]>}
 */
export async function getOfferedCandidatesByJobId(jobId) {
  await delay();
  if (!jobId) return offeredCandidatesList;
  return offeredCandidatesList.filter((c) => c.jobId === jobId);
}

/**
 * Simulates GET /api/offer/letter/:applicationId
 * Returns one candidate's saved offer letter content, if any.
 */
export async function getOfferLetterByApplicationId(applicationId) {
  await delay(150);
  const candidate = offeredCandidatesList.find((c) => c.applicationId === applicationId);
  if (!candidate) return null;

  return {
    content: {
      joiningDate: candidate.joiningDate || "",
      endingDate: candidate.endingDate || "",
      paragraph1: candidate.offerContent?.paragraph1 || "",
      paragraph2: candidate.offerContent?.paragraph2 || "",
      paragraph3: candidate.offerContent?.paragraph3 || "",
      fieldsSectionLabel: candidate.offerContent?.fieldsSectionLabel || "",
      additionalFields: candidate.offerContent?.additionalFields || [],
    },
    status: candidate.status || NOTIFICATION_STATUS.PENDING,
    offerLetterUrl: candidate.offerLetterUrl || null,
  };
}

/**
 * Simulates PUT /api/offer/letter/:applicationId
 * Saves joining/ending dates + letter content for one candidate, and
 * optionally applies the exact same payload to a bulk-selected list of
 * other candidate ids (the "Apply to Other Candidates" checkbox list).
 * Mutates the in-memory mock list so the dashboard reflects the change.
 *
 * @param {string} applicationId
 * @param {{joiningDate:string, endingDate:string, offerContent:Object}} data
 * @param {string[]} [bulkApplicationIds]
 */
export async function saveOfferLetterContent(applicationId, data, bulkApplicationIds = []) {
  await delay(400);
  const targetIds = [applicationId, ...bulkApplicationIds];

  targetIds.forEach((id) => {
    const candidate = offeredCandidatesList.find((c) => c.applicationId === id);
    if (!candidate) return;
    candidate.joiningDate = data.joiningDate;
    candidate.endingDate = data.endingDate || null;
    candidate.offerContent = data.offerContent;
    candidate.hasOffer = true;
    candidate.status = candidate.notified ? candidate.status : OFFER_STATUS.GENERATED;
  });

  return { success: true, updatedIds: targetIds };
}

/**
 * Simulates POST /api/offer/notify/:applicationId
 * Marks a candidate as notified (or re-sends). Always resolves — swap
 * in real success/failure handling once wired to an email provider.
 */
export async function notifyCandidate(applicationId) {
  await delay(700);
  const candidate = offeredCandidatesList.find((c) => c.applicationId === applicationId);
  if (!candidate) return { success: false, error: "Candidate not found" };

  candidate.notified = true;
  candidate.status = NOTIFICATION_STATUS.NOTIFIED;
  candidate.notifiedAt = new Date().toISOString();

  return { success: true, notifiedAt: candidate.notifiedAt };
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
   8. "API" — ORGANIZATION / ADVERTISEMENT
──────────────────────────────────────────────────────────────────── */

/** Simulates GET /api/organization/:jobId */
export async function getOrganization(jobId) {
  await delay(150);
  return mockOrganization;
}

/** Simulates GET /api/advertisement/:jobId */
export async function getAdvertisement(jobId) {
  await delay(150);
  return mockAdvertisement;
}

export function getInterviewers() {
  return interviewerList;
}

/* ────────────────────────────────────────────────────────────────────
   9. "API" — SETTINGS (design + signature + offer validity)
──────────────────────────────────────────────────────────────────── */

/**
 * Simulates GET /api/offer/settings/:advertisementId
 * Returns saved design settings, signature, and validity window.
 * Returns null on first visit so the caller knows to show setup.
 */
export function getOfferLetterSettings(advertisementId) {
  return readStorage(`${OFFER_STORAGE_KEY_PREFIX}${advertisementId}`);
}

/**
 * Simulates PUT /api/offer/settings/:advertisementId
 * @param {string} advertisementId
 * @param {{template?:string, colors?:Object, brandingPreference?:string,
 *   logoSize?:number, headingSize?:number, bodyFontSize?:number,
 *   signatureSize?:number, spacing?:number, signature?:Object,
 *   offerValidityDays?:number}} settings
 */
export function saveOfferLetterSettings(advertisementId, settings) {
  return writeStorage(`${OFFER_STORAGE_KEY_PREFIX}${advertisementId}`, settings);
}