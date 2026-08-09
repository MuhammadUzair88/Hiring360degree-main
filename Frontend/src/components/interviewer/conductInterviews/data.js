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


export function getInterviewCounts(list = []) {
  return {
    upcoming: list.filter((item) => item.statusBadge === STATUS.UPCOMING).length,
    ongoing: list.filter((item) => item.statusBadge === STATUS.ONGOING).length,
    completed: list.filter((item) => item.statusBadge === STATUS.COMPLETED).length,
    total: list.length,
  };
}