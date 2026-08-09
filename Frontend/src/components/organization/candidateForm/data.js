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

