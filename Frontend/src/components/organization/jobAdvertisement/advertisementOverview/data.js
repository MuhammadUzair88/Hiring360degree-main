/**
 * organization/jobAdvertisement/advertisementOverview/data.js
 * ------------------------------------------------------------------
 * Dummy records for the single-job "Advertisement Overview" page.
 * Field names mirror the backend Advertisement schema 1:1 — same
 * shape as initialAdvertisementForm in advertisement/createadvertisementdata.js,
 * plus the extra fields the schema only returns once a job actually
 * exists (_id, status, generatedImageUrl, organization).
 * Swap getJobOverviewById for a real GET /advertisements/:id call
 * later — every component in this folder only ever reads off the
 * `job` shape below, never off this array directly.
 * ------------------------------------------------------------------
 */

export const jobOverviewList = [
  {
    _id: "6a6505edf4f0af318b5084d1",
    jobTitle: "Senior Product Designer",
    department: "Design",
    employmentType: "Full-time",
    workMode: "Remote",
    location: "Remote",
    salary: 120000,
    deadline: "2026-08-05",
    status: "Live",
    experience: "Senior",
    skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    description:
      "Own end-to-end product design for our core platform — from early discovery through polished, shippable UI. You'll partner closely with engineering and product to raise the bar on craft across the team.",
    organization: { name: "Grainup" },
    generatedImageUrl: null,
    internshipPaid: "",
    internshipDuration: "",
    stipend: "",
  },
  {
    _id: "6a6505edf4f0af318b5084d2",
    jobTitle: "Staff Backend Engineer",
    department: "Engineering",
    employmentType: "Full-time",
    workMode: "On-site",
    location: "Hyderabad",
    salary: 165000,
    deadline: "2026-08-10",
    status: "Live",
    experience: "Senior",
    skills: ["Python", "Distributed Systems", "PostgreSQL"],
    description:
      "Design and own the systems behind our highest-traffic services. You'll set technical direction for the backend team and mentor engineers as we scale.",
    organization: { name: "Grainup" },
    generatedImageUrl: null,
    internshipPaid: "",
    internshipDuration: "",
    stipend: "",
  },
  {
    _id: "6a6505edf4f0af318b5084d3",
    jobTitle: "Growth Marketing Intern",
    department: "Growth",
    employmentType: "Internship",
    workMode: "On-site",
    location: "San Francisco",
    salary: "",
    deadline: "2026-07-30",
    status: "Draft",
    experience: "Junior",
    skills: ["SEO", "Copywriting", "Analytics"],
    description:
      "Support the growth team on SEO experiments, campaign copy, and performance reporting. A great fit for someone who wants hands-on exposure to a full-funnel marketing stack.",
    organization: { name: "Grainup" },
    generatedImageUrl: null,
    internshipPaid: "Paid",
    internshipDuration: "3 months",
    stipend: "$1,200/mo",
  },
  {
    _id: "6a6505edf4f0af318b5084d0",
    jobTitle: "Tax Consultant",
    department: "Tax Department",
    employmentType: "Part-time",
    workMode: "On-site",
    location: "Hub Dam",
    salary: 850000,
    deadline: "2026-07-31",
    status: "Live",
    experience: "Mid-Level",
    skills: [
      "Team Leadership",
      "Food Safety",
      "Inventory Management",
      "Staff Supervision",
      "Customer Service",
      "Communication",
      "Problem Solving",
      "Time Management",
    ],
    description:
      "We're looking for a detail-oriented Tax Consultant to join our Tax Department on a part-time, on-site basis. You'll advise clients on tax planning, prepare and review filings, and make sure every return is accurate and compliant with the latest regulations.",
    organization: { name: "Grainup" },
    generatedImageUrl: null,
    internshipPaid: "",
    internshipDuration: "",
    stipend: "",
  },
];

/** Simulates GET /advertisements/:id against the dummy list above. Returns null if not found. */
export function getJobOverviewById(id) {
  return jobOverviewList.find((job) => job._id === id) || null;
}