import { Users, Code2, UserCheck } from "lucide-react";

/**
 * interviewer/data.js
 * ------------------------------------------------------------------
 * Single source of truth for copy, config, and seed data on the
 * Interviewer pages (list + add/edit form). Nothing in the component
 * files hardcodes copy — they all receive it as props, defaulted from
 * the matching export here. Swap `initialInterviewers` for a real API
 * response later (see interviewerStore.js) and no component needs to
 * change.
 * ------------------------------------------------------------------
 */

/** Org summary card at the top of the Interviewer list page. */
export const organizationSummary = {
  name: "Hiring360 Enterprise",
  industry: "Software Development",
  location: "San Francisco, CA",
  logoUrl: null, // falls back to the org's initial when empty
};



// Organization info (shown on every page)
export const organizationData = {
  id: 1,
  name: "Grainup",
};

// Each page now has its own label (used in the title) + subtitle (used below it)
export const pageContent = {
  interviewer: {
    label: "Interviewer",
    subtitle: "Manage and track your interviewer panel",
  },
  settings: {
    label: "Settings",
    subtitle: "Manage your account and organization settings",
  },
};






/** Segmented filter control above the table. */
export const interviewerFilterTabs = ["All", "Technical", "HR"];

/** Options offered in the Evaluation Round <select> on the form. */
export const evaluationRoundOptions = ["Technical", "HR"];

/** How many rows the table shows per page. */
export const DEFAULT_PAGE_SIZE = 3;

/** Icon + accent meta for the 3 stat cards; values are computed live. */
export const interviewerStatMeta = [
  {
    id: "total",
    label: "Total Interviewers",
    icon: Users,
    badgeClass: "bg-primary-50 text-primary-800",
    trend: { direction: "up", label: "+4 this month", toneClass: "text-emerald-600" },
  },
  {
    id: "technical",
    label: "Technical Interviewers",
    icon: Code2,
    badgeClass: "bg-primary-50 text-primary-800",
  },
  {
    id: "hr",
    label: "HR Interviewers",
    icon: UserCheck,
    badgeClass: "bg-primary-50 text-primary-800",
  },
];

/** Trust badges in the faded footer row of the Add/Edit form. */
export const interviewerFormTrustBadges = [
  { id: "verified", label: "Verified Accounts" },
  { id: "tracking", label: "Evaluation Tracking" },
  { id: "security", label: "Enterprise Security" },
];

/** Blank starting values for the "Add Interviewer" form. */
export const emptyInterviewerFormValues = {
  name: "",
  email: "",
  round: "",
};

/**
 * Seed dataset for the in-memory interviewer store (interviewerStore.js).
 * `id` doubles as the route param used by /interviewer/edit/:id.
 */
export const initialInterviewers = [
  { id: "itv-01", name: "David Chen", role: "Senior Lead Engineer", email: "d.chen@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-02", name: "Sarah Jenkins", role: "Talent Acquisition Partner", email: "s.jenkins@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-03", name: "Marcus Low", role: "Staff Data Scientist", email: "m.low@hiring360.ai", round: "Technical", status: "Inactive", avatarUrl: null },
  { id: "itv-04", name: "Amara Okafor", role: "Marketing Lead", email: "a.okafor@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-05", name: "Michael Chen", role: "Staff Engineer", email: "mi.chen@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-06", name: "Priya Sharma", role: "Engineering Manager", email: "p.sharma@hiring360.ai", round: "Technical", status: "Active", avatarUrl: null },
  { id: "itv-07", name: "Daniel Kim", role: "People Operations Lead", email: "d.kim@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-08", name: "Olivia Martins", role: "Principal Engineer", email: "o.martins@hiring360.ai", round: "Technical", status: "Inactive", avatarUrl: null },
  { id: "itv-09", name: "James Whitfield", role: "Recruiting Manager", email: "j.whitfield@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-10", name: "Elena Rossi", role: "Senior Backend Engineer", email: "e.rossi@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-11", name: "Noah Bennett", role: "HR Business Partner", email: "n.bennett@hiring360.ai", round: "HR", status: "Active", avatarUrl: null },
  { id: "itv-12", name: "Grace Liu", role: "Staff Frontend Engineer", email: "g.liu@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-13", name: "Ahmed Hassan", role: "Engineering Director", email: "a.hassan@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-14", name: "Rahul Verma", role: "Staff Systems Engineer", email: "r.verma@hiring360.ai", round: "Technical", status: "Inactive", avatarUrl: null },
  { id: "itv-15", name: "Tom Becker", role: "DevOps Lead", email: "t.becker@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-16", name: "Nina Torres", role: "People Experience Lead", email: "n.torres@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-17", name: "Ken Watanabe", role: "Staff Security Engineer", email: "k.watanabe@hiring360.ai", round: "Technical", status: "Active", avatarUrl: null },
  { id: "itv-18", name: "Chloe Dubois", role: "Recruiting Coordinator", email: "c.dubois@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-19", name: "Lucas Ferreira", role: "Senior QA Engineer", email: "l.ferreira@hiring360.ai", round: "Technical", status: "Inactive", avatarUrl: null },
  { id: "itv-20", name: "Meera Nair", role: "HR Generalist", email: "m.nair@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-21", name: "Ryan O'Connor", role: "Platform Engineer", email: "r.oconnor@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-22", name: "Sofia Petrova", role: "Talent Acquisition Lead", email: "s.petrova@hiring360.ai", round: "HR", status: "Active", avatarUrl: null },
  { id: "itv-23", name: "Victor Alvarez", role: "Staff Mobile Engineer", email: "v.alvarez@hiring360.ai", round: "Technical", status: "Active", avatarUrl: "https://placehold.co/40x40" },
  { id: "itv-24", name: "Hannah Cole", role: "People Partner", email: "h.cole@hiring360.ai", round: "HR", status: "Active", avatarUrl: "https://placehold.co/40x40" },
];

