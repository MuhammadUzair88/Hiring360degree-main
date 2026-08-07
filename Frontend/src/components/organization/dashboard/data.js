import {
  Briefcase,
  Users,
  CalendarCheck,
  FileText,
  Clock,
  PlusCircle,
  UserPlus,
  Share2,
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
    id: "ongoing-interviews",
    label: "Ongoing Interviews",
    value: "06",
    icon: CalendarCheck,
    badgeClass: "bg-primary-100 text-primary-600",
    helperText: "Happening today",
},
  {
    id: "final-offers",
    label: "final Hires",
    value: "12",
    icon: FileText,
    badgeClass: "bg-primary-100 text-primary-900",
    trend: { direction: "alert", label: "03 remaining", toneClass: "text-primary-900" },
  },
  {
    id: "sended-offer-letter",
    label: "Offer letter sended",
    value: "18",
    icon: Clock,
    badgeClass: "bg-secondary-200 text-primary-800",
    trend: { direction: "down", label: "Sended ", toneClass: "text-primary-700" },
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

/* ------------------------------------------------------------------ */
/*  Graph data                                                        */
/* ------------------------------------------------------------------ */

/** Tabs for the Applications Trend chart. */
export const applicationsTrendFilters = ["Daily", "Weekly", "Monthly"];

/** Applications received over time, keyed by the active filter above. */
export const applicationsTrendData = {
  Daily: [
    { name: "Mon", applications: 38 },
    { name: "Tue", applications: 52 },
    { name: "Wed", applications: 41 },
    { name: "Thu", applications: 67 },
    { name: "Fri", applications: 58 },
    { name: "Sat", applications: 24 },
    { name: "Sun", applications: 19 },
  ],
  Weekly: [
    { name: "Wk 1", applications: 210 },
    { name: "Wk 2", applications: 268 },
    { name: "Wk 3", applications: 302 },
    { name: "Wk 4", applications: 284 },
  ],
  Monthly: [
    { name: "Mar", applications: 780 },
    { name: "Apr", applications: 865 },
    { name: "May", applications: 910 },
    { name: "Jun", applications: 1040 },
    { name: "Jul", applications: 980 },
    { name: "Aug", applications: 1284 },
  ],
};

/**
 * Job Category Distribution donut — share of the open pipeline by
 * department. `value` is a percentage of total, so the set should
 * sum to 100.
 */
export const jobCategoryDistribution = [
  { id: "cat-eng", name: "Engineering", value: 38, description: "Product & platform engineering roles" },
  { id: "cat-ops", name: "Operations", value: 20, description: "HR, finance & operations roles" },
  { id: "cat-design", name: "Design", value: 16, description: "Product & brand design roles" },
  { id: "cat-sales", name: "Sales", value: 14, description: "Sales & business development roles" },
  { id: "cat-marketing", name: "Marketing", value: 12, description: "Growth & marketing roles" },
];

/** Tabs for the Hiring Performance chart. */
export const hiringPerformanceFilters = ["Weekly", "Monthly", "Yearly"];

/**
 * Applications → Interviews → Hires, keyed by the active filter above.
 * Three-series line chart, same shape at every grain so the filter
 * can swap datasets without touching the chart component.
 */
export const hiringPerformanceData = {
  Weekly: [
    { name: "Wk 1", applications: 210, interviews: 92, hires: 14 },
    { name: "Wk 2", applications: 268, interviews: 118, hires: 19 },
    { name: "Wk 3", applications: 302, interviews: 140, hires: 22 },
    { name: "Wk 4", applications: 284, interviews: 131, hires: 21 },
  ],
  Monthly: [
    { name: "Mar", applications: 780, interviews: 340, hires: 52 },
    { name: "Apr", applications: 865, interviews: 375, hires: 58 },
    { name: "May", applications: 910, interviews: 402, hires: 64 },
    { name: "Jun", applications: 1040, interviews: 455, hires: 71 },
    { name: "Jul", applications: 980, interviews: 428, hires: 66 },
    { name: "Aug", applications: 1284, interviews: 560, hires: 84 },
  ],
  Yearly: [
    { name: "2023", applications: 6200, interviews: 2680, hires: 410 },
    { name: "2024", applications: 8450, interviews: 3720, hires: 560 },
    { name: "2025", applications: 10900, interviews: 4780, hires: 742 },
  ],
};

/** Offer Letter Activity donut. */
export const offerLetterActivity = [
  { id: "offer-sent", name: "Sent Today", value: 12 },
  { id: "offer-accepted", name: "Accepted", value: 7 },
  { id: "offer-pending", name: "Pending", value: 3 },
  { id: "offer-declined", name: "Declined", value: 2 },
];

/** Recent Applications table. */
export const recentApplications = [
  {
    id: "app-1",
    candidateName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    initials: "SJ",
    roleLabel: "Senior Product Designer",
    appliedOn: "Aug 03, 2026",
    status: "Shortlisted",
  },
  {
    id: "app-2",
    candidateName: "Michael Chen",
    email: "michael.chen@example.com",
    initials: "MC",
    roleLabel: "Staff Engineer",
    appliedOn: "Aug 03, 2026",
    status: "Interview Scheduled",
  },
  {
    id: "app-3",
    candidateName: "Amara Okafor",
    email: "amara.okafor@example.com",
    initials: "AO",
    roleLabel: "Marketing Lead",
    appliedOn: "Aug 02, 2026",
    status: "AI Reviewed",
  },
  {
    id: "app-4",
    candidateName: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    initials: "BA",
    roleLabel: "Finance Manager",
    appliedOn: "Aug 02, 2026",
    status: "Applied",
  },
  {
    id: "app-5",
    candidateName: "Priya Sharma",
    email: "priya.sharma@example.com",
    initials: "PS",
    roleLabel: "HR Executive",
    appliedOn: "Aug 01, 2026",
    status: "Applied",
  },
];
/* ------------------------------------------------------------------ */
/*  Schedule calendar                                                 */
/*  Powers the whole sidebar card stack: ScheduleCalendar,            */
/*  DaySchedulePanel, OngoingInterviewsPanel, and the compact          */
/*  UpcomingInterviewsPanel underneath it all read the same day's     */
/*  entry from scheduleByDay below — same pattern as the old          */
/*  prototype's `dynamicSchedulesByDay`. Keyed by day-of-month only   */
/*  (not a full date) since this is mock data; swap in a real,        */
/*  fully-dated API later and nothing about the components changes.   */
/* ------------------------------------------------------------------ */

/** Month the calendar opens to. monthIndex is 0-based (7 = August). */
export const scheduleCalendarMonth = { year: 2026, monthIndex: 7 };

/** Day selected by default when the dashboard loads. */
export const scheduleDefaultDay = 11;

export const scheduleByDay = {
  11: { agenda: [], live: null, upcoming: [] },
  12: {
    agenda: [
      { id: "ag-12-1", time: "10:00 AM", title: "Technical Interview", details: "Senior Frontend Developer" },
      { id: "ag-12-2", time: "01:00 PM", title: "HR Discussion", details: "Finance Manager" },
      { id: "ag-12-3", time: "03:30 PM", title: "Manager Interview", details: "AI / ML Engineer" },
    ],
    live: {
      candidateName: "Muhammad Uzair",
      roleLabel: "Senior Frontend Developer",
      stageLabel: "Technical Interview • Ali Khan",
      elapsed: "18:24",
    },
    upcoming: [
      { id: "up-12-1", candidateName: "Ayesha Khan", roleLabel: "AI / ML Engineer", time: "11:00 AM" },
      { id: "up-12-2", candidateName: "Bilal Ahmed", roleLabel: "Finance Manager", time: "02:00 PM" },
    ],
  },
  18: {
    agenda: [
      { id: "ag-18-1", time: "09:00 AM", title: "AI Screening Audit", details: "DevOps Pipeline" },
      { id: "ag-18-2", time: "11:30 AM", title: "Executive Review Panel", details: "VP of Engineering" },
    ],
    live: {
      candidateName: "Sara Malik",
      roleLabel: "HR Executive",
      stageLabel: "Culture Evaluation • Sarah K.",
      elapsed: "05:12",
    },
    upcoming: [
      { id: "up-18-1", candidateName: "Muneeb Shaikh", roleLabel: "DevOps Engineer", time: "01:30 PM" },
    ],
  },
  25: {
    agenda: [
      { id: "ag-25-1", time: "10:30 AM", title: "System Verification", details: "Electrical Track" },
    ],
    live: null,
    upcoming: [
      { id: "up-25-1", candidateName: "Hamza Riaz", roleLabel: "QA Engineer", time: "01:00 PM" },
    ],
  },
};