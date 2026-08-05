export const dummyJob = {
  _id: "6a6ee9f0665b736d7c2971f6",
  jobTitle: "Senior Engineer",
  description:
    "We're looking for a Senior Engineer to join our product team. You'll own features end-to-end, mentor junior engineers, and help shape our technical roadmap.",
  deadline: "2026-08-04T00:00:00.000Z",
  organization: {
    name: "Grainup",
    logo: "",
    organizationId: "64f1a2b3c4d5e6f7a8b9c0d1",
  },
};

/** Initial state for the candidate application form */
export const initialCandidateFormState = {
  name: "",
  email: "",
  phone: "",
  resume: null,
};

/** Constraints for the resume upload field */
export const RESUME_UPLOAD_CONFIG = {
  maxSizeMB: 10,
  acceptedTypes: [".pdf", ".doc", ".docx"],
  acceptAttr:
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Simple client-side validators used by CandidateFormStructure */
export const validators = {
  name: (value) => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Enter your full name";
    return "";
  },
  email: (value) => {
    if (!value.trim()) return "Email address is required";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return "Enter a valid email address";
    return "";
  },
  phone: (value) => {
    if (!value.trim()) return "Phone number is required";
    const digits = value.replace(/[^\d]/g, "");
    if (digits.length < 7) return "Enter a valid phone number";
    return "";
  },
  resume: (file) => {
    if (!file) return "Please upload your resume";
    const maxBytes = RESUME_UPLOAD_CONFIG.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File is too large — max ${RESUME_UPLOAD_CONFIG.maxSizeMB}MB`;
    }
    return "";
  },
};

/**
 * Placeholder submit handler — simulates a network request (with a short
 * delay and a console log of the payload) so the form can be built and
 * tested with zero backend dependency. CandidateFormStructure falls back
 * to this automatically; pass a real `onSubmit` prop once your endpoint
 * is ready, e.g.:
 *
 *   <CandidateFormStructure onSubmit={(payload) => api.post("/api/candidate/apply", payload)} />
 */
export const submitCandidateApplication = (payload) =>
  new Promise((resolve) => {
    console.log("Submitting application (mock):", payload);
    setTimeout(() => resolve({ success: true }), 900);
  });

/**
 * Placeholder job-fetch — simulates GET /api/form/apply/:id so the page
 * renders with zero backend/config dependency. CandidateForm (the page)
 * calls this by default; swap it for a real `api.get(...)` call once you
 * have a config/api file and a live endpoint.
 */
export const fetchCandidateJob = (id) =>
  new Promise((resolve) => {
    console.log("Fetching job (mock) for id:", id);
    setTimeout(() => resolve({ job: dummyJob }), 900);
  });