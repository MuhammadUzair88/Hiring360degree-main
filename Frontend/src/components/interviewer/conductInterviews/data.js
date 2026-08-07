// src/components/interviewerDashboard/conductInterview/data.js
//
// Single source of dummy data for the Conduct Interviews feature.
// Every component in this folder receives its data through props —
// nothing in here is imported directly by a leaf component. When the
// backend is wired up, only ConductInterviews.jsx (the page) needs to
// change: fetch real data there and pass it down exactly like this
// file's shape, and every component below keeps working untouched.

export const STATUS = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  NO_SHOW: "No Show",
};

export const organization = {
  name: "Grainup",
  logo: null,
  location: "Qasimabad, Hyderabad",
  email: "grainup@gmail.com",
};

export const interviewer = {
  name: "Ghulam Qadir",
  role: "Interviewer",
};

export const interviews = [
  {
    scheduleId: "sch_1001",
    candidateName: "Sumit Sharma",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    assignedStage: "Technical Round",
    statusBadge: STATUS.COMPLETED,
    interviewDate: "2026-07-14",
    interviewTime: "10:00",
    evaluationStatus: "Completed",
    joinLink: null,
  },
  {
    scheduleId: "sch_1002",
    candidateName: "Ayesha Baig",
    jobTitle: "Product Designer",
    department: "Design",
    assignedStage: "Portfolio Review",
    statusBadge: STATUS.UPCOMING,
    interviewDate: "2026-08-10",
    interviewTime: "14:30",
    evaluationStatus: "Pending",
    joinLink: "https://meet.example.com/portfolio-review",
  },
  {
    scheduleId: "sch_1003",
    candidateName: "Hassan Raza",
    jobTitle: "Backend Engineer",
    department: "Engineering",
    assignedStage: "System Design",
    statusBadge: STATUS.ONGOING,
    interviewDate: "2026-08-06",
    interviewTime: "11:00",
    evaluationStatus: "Pending",
    joinLink: "https://meet.example.com/system-design",
  },
  {
    scheduleId: "sch_1004",
    candidateName: "Mahnoor Khan",
    jobTitle: "QA Engineer",
    department: "Engineering",
    assignedStage: "HR Round",
    statusBadge: STATUS.UPCOMING,
    interviewDate: "2026-08-12",
    interviewTime: "09:30",
    evaluationStatus: "Pending",
    joinLink: "https://meet.example.com/hr-round",
  },
  {
    scheduleId: "sch_1005",
    candidateName: "Bilal Ahmed",
    jobTitle: "DevOps Engineer",
    department: "Infrastructure",
    assignedStage: "Technical Round",
    statusBadge: STATUS.COMPLETED,
    interviewDate: "2026-08-01",
    interviewTime: "16:00",
    evaluationStatus: "Pending",
    joinLink: null,
  },
  {
    scheduleId: "sch_1006",
    candidateName: "Zara Iqbal",
    jobTitle: "Marketing Associate",
    department: "Marketing",
    assignedStage: "Screening",
    statusBadge: STATUS.NO_SHOW,
    interviewDate: "2026-07-28",
    interviewTime: "13:00",
    evaluationStatus: "Pending",
    joinLink: null,
  },
];

/**
 * Derives the metric counts (Upcoming / Ongoing / Completed / Total)
 * from a list of interviews. Kept here — not inline in a component —
 * so the counting rule has exactly one home.
 */
export function getInterviewCounts(list = []) {
  return {
    upcoming: list.filter((item) => item.statusBadge === STATUS.UPCOMING).length,
    ongoing: list.filter((item) => item.statusBadge === STATUS.ONGOING).length,
    completed: list.filter((item) => item.statusBadge === STATUS.COMPLETED).length,
    total: list.length,
  };
}