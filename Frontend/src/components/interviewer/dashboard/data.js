import { Clock, CalendarPlus, AlertCircle, MessageSquare } from "lucide-react";

/**
 * dashboard/data.js
 * ------------------------------------------------------------------
 * Single source of truth for every piece of dummy data rendered on
 * the Interviewer Dashboard. Nothing in the component files below
 * hardcodes copy or numbers — they all receive it as props, and each
 * container component simply defaults that prop to the matching
 * export here. Swap these exports for real API responses later and
 * no component needs to change.
 * ------------------------------------------------------------------
 */

/** Organization identity shown in the shared InterviewerHeader. */
export const organizationProfile = {
  name: "Grainup",
  logo: null, // drop a logo URL in here once one is available
  location: "Qasimabad, Hyderabad",
  email: "grainup@gmail.com",
};

/** Signed-in interviewer shown in the shared InterviewerHeader. */
export const interviewerProfile = {
  name: "Ghulam Qadir",
};

/**
 * shared/data.js
 * ------------------------------------------------------------------
 * Identity data shown in the shared InterviewerHeader. Every
 * interviewer page (Dashboard, Conduct Interviews, Evaluation) reads
 * organization/interviewer info from here instead of each page
 * keeping its own copy — once this is wired to auth/org context, only
 * this file changes and every page picks it up automatically.
 * ------------------------------------------------------------------
 */



/** The 4 top-line KPI cards. `to` makes the card clickable (optional). */
export const dashboardStats = [
  {
    id: "upcoming",
    label: "Upcoming",
    value: 4,
    icon: Clock,
    tone: "subtle",
    helperText: "Schedules pending start",
    to: "/interviewers/conduct-interviews",
  },
  {
    id: "new-interviews",
    label: "New Interviews",
    value: 6,
    icon: CalendarPlus,
    tone: "soft",
    helperText: "Fresh additions this week",
    to: "/interviewers/conduct-interviews",
  },
  {
    id: "no-shows",
    label: "No Shows",
    value: 1,
    icon: AlertCircle,
    tone: "medium",
    helperText: "Missed or lapsed blocks",
    to: "/interviewers/conduct-interviews",
  },
  {
    id: "feedback",
    label: "Feedback",
    value: 3,
    icon: MessageSquare,
    tone: "strong",
    helperText: "Awaiting evaluations",
    to: "/interviewers/evaluation",
  },
];

/* ------------------------------------------------------------------ */
/*  Interview activity chart                                          */
/* ------------------------------------------------------------------ */

/** Tabs for the Interview Activity chart. */
export const sessionsChartFilters = ["Weekly", "Monthly"];

/** Scheduled vs. completed sessions, keyed by the active filter above. */
export const sessionsChartData = {
  Weekly: [
    { name: "Week 1", scheduled: 3, completed: 2 },
    { name: "Week 2", scheduled: 5, completed: 4 },
    { name: "Week 3", scheduled: 4, completed: 4 },
    { name: "Week 4", scheduled: 6, completed: 5 },
  ],
  Monthly: [
    { name: "Mar", scheduled: 14, completed: 12 },
    { name: "Apr", scheduled: 18, completed: 15 },
    { name: "May", scheduled: 21, completed: 19 },
    { name: "Jun", scheduled: 19, completed: 17 },
    { name: "Jul", scheduled: 23, completed: 20 },
    { name: "Aug", scheduled: 12, completed: 8 },
  ],
};

/** Completion rate shown top-right of the chart card. */
export const sessionsCompletionRate = 82;

/* ------------------------------------------------------------------ */
/*  Recent interview schedule + live channels                         */
/* ------------------------------------------------------------------ */

/** Recent Interview Schedule table rows. */
export const recentInterviews = [
  {
    scheduleId: "sch-1",
    candidateName: "Sumit Sharma",
    jobTitle: "Senior Frontend Developer",
    roundName: "Technical Round",
    status: "Scheduled",
    interviewDate: "2026-08-14",
    interviewTime: "10:00 AM",
  },
  {
    scheduleId: "sch-2",
    candidateName: "Ayesha Khan",
    jobTitle: "AI / ML Engineer",
    roundName: "Manager Round",
    status: "Ongoing",
    interviewDate: "2026-08-06",
    interviewTime: "02:30 PM",
  },
  {
    scheduleId: "sch-3",
    candidateName: "Bilal Ahmed",
    jobTitle: "Finance Manager",
    roundName: "HR Round",
    status: "Completed",
    interviewDate: "2026-08-04",
    interviewTime: "11:00 AM",
  },
  {
    scheduleId: "sch-4",
    candidateName: "Hamza Riaz",
    jobTitle: "QA Engineer",
    roundName: "Technical Round",
    status: "No Show",
    interviewDate: "2026-08-02",
    interviewTime: "09:30 AM",
  },
  {
    scheduleId: "sch-5",
    candidateName: "Sara Malik",
    jobTitle: "HR Executive",
    roundName: "Culture Round",
    status: "Completed",
    interviewDate: "2026-07-30",
    interviewTime: "01:00 PM",
  },
  {
    scheduleId: "sch-6",
    candidateName: "Muneeb Shaikh",
    jobTitle: "DevOps Engineer",
    roundName: "Technical Round",
    status: "Scheduled",
    interviewDate: "2026-08-18",
    interviewTime: "03:00 PM",
  },
];

/** Interviews that are live right now — powers LiveChannelsCard. */
export const liveInterviews = [
  {
    scheduleId: "sch-2",
    candidateName: "Ayesha Khan",
    jobTitle: "AI / ML Engineer",
    roundName: "Manager Round",
    interviewTime: "02:30 PM",
    joinLink: "https://meet.example.com/room/ayesha-khan",
  },
];

/* ------------------------------------------------------------------ */
/*  Schedule calendar                                                 */
/*  Powers ScheduleCalendar + DaySchedulePanel. scheduleByDay is       */
/*  derived directly from recentInterviews (keyed by day-of-month) so  */
/*  there is one source of truth for "what's happening when" — same    */
/*  pattern the org dashboard uses for its own schedule sidebar.       */
/* ------------------------------------------------------------------ */

const today = new Date();

/** Month the calendar opens to. monthIndex is 0-based. */
export const scheduleCalendarMonth = { year: today.getFullYear(), monthIndex: today.getMonth() };

/** Day selected by default when the dashboard loads. */
export const scheduleDefaultDay = today.getDate();

function dayOfMonth(dateStr) {
  return new Date(dateStr).getDate();
}

/** { [dayOfMonth]: { agenda: [{ id, time, title, details }] } } */
export const scheduleByDay = recentInterviews.reduce((acc, interview) => {
  const day = dayOfMonth(interview.interviewDate);
  if (!acc[day]) acc[day] = { agenda: [] };
  acc[day].agenda.push({
    id: interview.scheduleId,
    time: interview.interviewTime,
    title: interview.roundName,
    details: `${interview.candidateName} • ${interview.jobTitle}`,
  });
  return acc;
}, {});
