

/**
 * advertisement/createAdvertisementData.js
 * ------------------------------------------------------------------
 * Copy, dropdown options, validation rules and the initial form state
 * for the "Create / Edit Job Advertisement" page. Field names mirror
 * the backend Advertisement schema 1:1 (jobTitle, department,
 * employmentType, workMode, location, salary, internshipPaid,
 * internshipDuration, deadline, experience, skills, description) so
 * `formData` can be POSTed to the API with no remapping later.
 * ------------------------------------------------------------------
 */

import { AlertCircle, Tag, DollarSign, PenTool, Link2, MessageCircle, Share2, Mail } from "lucide-react";

/** The exact shape held in useState and posted to the API. */
export const initialAdvertisementForm = {
  jobTitle: "",
  department: "",
  employmentType: "",
  workMode: "",
  location: "",
  salary: "",
  internshipPaid: "",
  internshipDuration: "",
  deadline: "",
  experience: "",
  skills: [],
  description: "",
};

/**
 * Fields that must be filled before "Publish Job" is enabled — mirrors
 * the asterisked labels on the live form (Job Title, Employment Type,
 * Work Mode, Application Deadline, Required Skills, Job Description).
 */
export const requiredAdvertisementFields = [
  "jobTitle",
  "employmentType",
  "workMode",
  "deadline",
  "skills",
  "description",
];

export const employmentTypeOptions = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

export const workModeOptions = ["On-site", "Remote", "Hybrid"];

/** Only rendered in JobForm when employmentType === "Internship". */
export const internshipPaidOptions = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

export const experienceLevelOptions = [
  { value: "Junior", label: "Junior (0-2y)" },
  { value: "Mid-Level", label: "Mid-Level (3-5y)" },
  { value: "Senior", label: "Senior (5y+)" },
];

export const jobDescriptionMaxLength = 2000;

/** Copy for the "Form Best Practices" sidebar card. */
export const jobFormBestPractices = {
  title: "Form Best Practices",
  subtitle: "How to attract top talent",
  tips: [
    {
      id: "required-fields",
      title: "Required Fields (*)",
      description: "Fields marked with an asterisk must be filled before publishing.",
      icon: AlertCircle,
      iconBgClass: "bg-red-50",
      iconColorClass: "text-red-700",
    },
    {
      id: "clear-titles",
      title: "Clear Titles",
      description: "Use standard industry titles (e.g. \"Senior Frontend Engineer\") to increase search visibility.",
      icon: Tag,
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
    },
    {
      id: "compensation-transparency",
      title: "Compensation Transparency",
      description: "Job postings with clear salary or stipend ranges receive 40% more applicants.",
      icon: DollarSign,
      iconBgClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
    },
    {
      id: "action-oriented",
      title: "Action-Oriented Descriptions",
      description: "Start bullet points with verbs (Develop, Manage, Lead) rather than generic text.",
      icon: PenTool,
      iconBgClass: "bg-orange-50",
      iconColorClass: "text-orange-600",
    },
  ],
};

/** Copy for the "Publish Routing" sidebar card. */
export const publishRoutingTips = {
  title: "Publish Routing",
  subtitle: "Platform-specific sharing tips",
  tips: [
    {
      id: "linkedin",
      title: "LinkedIn",
      description: "Auto-fills text and attaches your high-res pamphlet.",
      icon: Link2,
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-700",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      description: "Sends the full job description along with the direct apply link.",
      icon: MessageCircle,
      iconBgClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
    },
    {
      id: "facebook",
      title: "Facebook",
      description: "Creates a formatted post directly to your organization's feed.",
      icon: Share2,
      iconBgClass: "bg-indigo-50",
      iconColorClass: "text-indigo-700",
    },
    {
      id: "email",
      title: "Email",
      description: "Drafts a formatted email with the pamphlet attached.",
      icon: Mail,
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-700",
    },
  ],
};