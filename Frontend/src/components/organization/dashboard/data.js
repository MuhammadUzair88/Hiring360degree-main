import {
  Briefcase,
  Users,
  CalendarCheck,
  FileText,
  Clock,
  PlusCircle,
  UserPlus,
  Share2,
  CheckCircle2,
  MessageSquare,
  Rss,
  Send,
  UserX,
} from "lucide-react";

/**
 * dashboard/data.js
 * ------------------------------------------------------------------
 * Single source of truth for every piece of dummy data rendered on
 * the Dashboard Overview page. Nothing in the component files below
 * hardcodes copy or numbers — they all receive it as props, and each
 * container component simply defaults that prop to the matching
 * export here. Swap these exports for an API response later and no
 * component needs to change.
 * ------------------------------------------------------------------
 */

/** Greeting banner at the top of the page. */
export const dashboardGreeting = {
  orgName: "Grainup Team",
  subtitle:
    "Here's your global talent acquisition health overview for today.",
};

/** The 5 top-line stat cards. */
export const dashboardStats = [
  {
    id: "active-jobs",
    label: "Active Jobs",
    value: "42",
    icon: Briefcase,
    badgeClass: "bg-primary-50 text-primary-800",
    trend: { direction: "up", label: "+3 this week", toneClass: "text-primary-800" },
  },
  {
    id: "total-candidates",
    label: "Total Candidates",
    value: "1,284",
    icon: Users,
    badgeClass: "bg-secondary-200 text-primary-700",
    helperText: "Across all pipelines",
  },
  {
    id: "interviews",
    label: "Interviews",
    value: "56",
    icon: CalendarCheck,
    badgeClass: "bg-primary-100 text-primary-600",
    helperText: "Scheduled this week",
  },
  {
    id: "pending-offers",
    label: "Pending Offers",
    value: "12",
    icon: FileText,
    badgeClass: "bg-primary-100 text-primary-900",
    trend: { direction: "alert", label: "3 urgent", toneClass: "text-primary-900" },
  },
  {
    id: "time-to-hire",
    label: "Avg. Time-to-Hire",
    value: "18d",
    icon: Clock,
    badgeClass: "bg-secondary-200 text-primary-800",
    trend: { direction: "down", label: "-2d vs last month", toneClass: "text-primary-700" },
  },
];

/**
 * Hiring funnel stages, in order. `percentage` is the conversion rate
 * from the stage immediately before it (not a share of the total),
 * matching the "38% / 56% / 52% / 34%" call-outs in the source design.
 */
export const hiringFunnelFilters = ["Last 30 Days", "By Department"];

export const hiringFunnelStages = [
  { id: "applied", label: "Applied", value: 850, percentage: 100 },
  { id: "shortlisted", label: "Shortlisted", value: 320, percentage: 38 },
  { id: "hr-round", label: "HR Round", value: 180, percentage: 56 },
  { id: "technical", label: "Technical", value: 95, percentage: 52 },
  { id: "offer-sent", label: "Offer Sent", value: 32, percentage: 34 },
];

/** Upcoming Interviews list. */
export const upcomingInterviews = [
  {
    id: "int-1",
    candidateName: "Sarah Jenkins",
    roleLabel: "Senior Product Designer",
    stageLabel: "Technical Review",
    avatarUrl: "https://placehold.co/48x48",
    time: "14:00 - 15:00",
    mode: "Zoom Meeting",
  },
  {
    id: "int-2",
    candidateName: "Michael Chen",
    roleLabel: "Staff Engineer",
    stageLabel: "HR Screening",
    avatarUrl: "https://placehold.co/48x48",
    time: "16:30 - 17:00",
    mode: "In-Person • Room 402",
  },
  {
    id: "int-3",
    candidateName: "Amara Okafor",
    roleLabel: "Marketing Lead",
    stageLabel: "Culture Fit",
    avatarUrl: "https://placehold.co/48x48",
    time: "Tomorrow, 10:00",
    mode: "Video Call",
  },
];

/** Panelist workload / interview load this week. */
export const panelistWorkload = [
  {
    id: "pan-1",
    name: "David Wilson",
    department: "Eng",
    hoursBooked: 8,
    hoursCapacity: 10,
    barClass: "bg-red-700",
  },
  {
    id: "pan-2",
    name: "Sarah Jenkins",
    department: "Des",
    hoursBooked: 4,
    hoursCapacity: 10,
    barClass: "bg-indigo-600",
  },
  {
    id: "pan-3",
    name: "Amir Khan",
    department: "Ops",
    hoursBooked: 2,
    hoursCapacity: 10,
    barClass: "bg-emerald-500",
  },
];

/** Quick action shortcuts. */
export const quickActions = [
  { id: "qa-new-job", label: "New Job Posting", icon: PlusCircle, to: "/advertisement/add" },
  { id: "qa-add-interviewer", label: "Add Interviewer", icon: UserPlus, to: "/interviewer" },
  { id: "qa-share-pipeline", label: "Share Pipeline Link", icon: Share2, to: "/advertisement" },
];

/** Recent activity timeline, newest first. */
export const recentActivity = [
  {
    id: "act-1",
    message: "Offer Accepted for Senior Frontend Engineer role by Leo Valdez.",
    timestamp: "2 hours ago",
    location: "New York Office",
    icon: CheckCircle2,
    iconBgClass: "bg-primary-100",
    iconColorClass: "text-primary-800",
  },
  {
    id: "act-2",
    message: "New Feedback submitted by David Wilson for candidate Sarah Jenkins.",
    timestamp: "4 hours ago",
    location: "Technical Round",
    icon: MessageSquare,
    iconBgClass: "bg-secondary-200",
    iconColorClass: "text-primary-700",
  },
  {
    id: "act-3",
    message: "Job Published: Marketing Director (EMEA) is now live on LinkedIn & Indeed.",
    timestamp: "6 hours ago",
    location: "London Office",
    icon: Rss,
    iconBgClass: "bg-secondary-200",
    iconColorClass: "text-primary-600",
  },
  {
    id: "act-4",
    message: "Offer Sent to Michael Chen for Staff Engineer position.",
    timestamp: "Yesterday",
    location: "Seattle Office",
    icon: Send,
    iconBgClass: "bg-primary-100",
    iconColorClass: "text-primary-800",
  },
  {
    id: "act-5",
    message: "Candidate Dropped: Alex Rivera withdrew from Sales Executive pipeline.",
    timestamp: "Yesterday",
    location: "San Francisco",
    icon: UserX,
    iconBgClass: "bg-primary-100",
    iconColorClass: "text-primary-900",
  },
];

/**
 * Department-level breakdown for the "By Department" filter.
 * Each department's Applied/Shortlisted/HR/Technical/Offer counts
 * sum exactly to the global hiringFunnelStages totals above, so the
 * two views stay mathematically consistent with each other.
 */
export const hiringFunnelDepartments = ["Engineering", "Design", "Marketing", "Sales"];

export const hiringFunnelByDepartment = {
  Engineering: [
    { id: "applied", label: "Applied", value: 380 },
    { id: "shortlisted", label: "Shortlisted", value: 152 },
    { id: "hr-round", label: "HR Round", value: 88 },
    { id: "technical", label: "Technical", value: 51 },
    { id: "offer-sent", label: "Offer Sent", value: 16 },
  ],
  Design: [
    { id: "applied", label: "Applied", value: 210 },
    { id: "shortlisted", label: "Shortlisted", value: 74 },
    { id: "hr-round", label: "HR Round", value: 39 },
    { id: "technical", label: "Technical", value: 21 },
    { id: "offer-sent", label: "Offer Sent", value: 7 },
  ],
  Marketing: [
    { id: "applied", label: "Applied", value: 165 },
    { id: "shortlisted", label: "Shortlisted", value: 58 },
    { id: "hr-round", label: "HR Round", value: 33 },
    { id: "technical", label: "Technical", value: 15 },
    { id: "offer-sent", label: "Offer Sent", value: 5 },
  ],
  Sales: [
    { id: "applied", label: "Applied", value: 95 },
    { id: "shortlisted", label: "Shortlisted", value: 36 },
    { id: "hr-round", label: "HR Round", value: 20 },
    { id: "technical", label: "Technical", value: 8 },
    { id: "offer-sent", label: "Offer Sent", value: 4 },
  ],
};
