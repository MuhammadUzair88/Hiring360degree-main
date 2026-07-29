/** Breadcrumb, title, subtitle and "Post New Job" CTA at the top of the page. */

// Organization info — comes from backend, shared across all pages
export const organizationData = {
  id: 1,
  name: "Grainup",
};

// Advertisement page specific content
export const advertisementPageHeader = {
  title: "Advertisements",
  subtitle: "Manage and track your active job postings",
  ctaLabel: "Post New Job",
  ctaTo: "/advertisement/add",
};

/**
 * Options rendered in the department / type filter selects.
 * The first entry of each list is treated as "no filter applied".
 */
export const advertisementFilters = {
  departments: ["All Departments", "Design", "Engineering", "Growth", "Marketing", "Sales", "Tax"],
  types: ["All Types", "Full-Time", "Part-Time", "Internship", "Contract"],
};

/**
 * Job postings rendered as cards in the AdvertisementGrid.
 * accentTextClass/accentBgClass vary only in SHADE (600→900 of primary),
 * never in hue, so every card stays on the primary/secondary palette
 * while still reading as visually distinct per department.
 */

export const jobAdvertisements = [
  { id: "6a6505edf4f0af318b5084d1", departmentLabel: "Design", accentTextClass: "text-primary-700", accentBgClass: "bg-primary-700/10", typeLabel: "Full-Time", title: "Senior Product Designer", company: "Grainup", location: "Remote", salary: 120000, postedDate: "7/20/2026", endDate: "8/05/2026", tags: ["Figma", "Prototyping", "Design Systems"], applicantsCount: 82 },
  { id: "6a6505edf4f0af318b5084d2", departmentLabel: "Engineering", accentTextClass: "text-primary-800", accentBgClass: "bg-primary-800/10", typeLabel: "Full-Time", title: "Staff Backend Engineer", company: "Grainup", location: "Hyderabad", salary: 165000, postedDate: "7/18/2026", endDate: "8/10/2026", tags: ["Python", "Distributed Systems", "PostgreSQL"], applicantsCount: 156 },
  { id: "6a6505edf4f0af318b5084d3", departmentLabel: "Growth", accentTextClass: "text-primary-600", accentBgClass: "bg-primary-600/10", typeLabel: "Internship", title: "Growth Marketing Intern", company: "Grainup", location: "San Francisco", salary: 45000, postedDate: "7/12/2026", endDate: "7/30/2026", tags: ["SEO", "Copywriting", "Analytics"], applicantsCount: 45 },
  { id: "6a6505edf4f0af318b5084d0", departmentLabel: "Tax Department", accentTextClass: "text-primary-900", accentBgClass: "bg-primary-900/10", typeLabel: "Part-Time", title: "Tax Consultant", company: "Grainup", location: "Hub Dam", salary: 850000, postedDate: "7/25/2026", endDate: "7/31/2026", tags: ["Team Leadership", "Food Safety", "Inventory Management", "Compliance", "Auditing", "Payroll", "Risk Assessment", "Reporting"], applicantsCount: 0 },
];
