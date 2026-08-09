import { PlusCircle, UserPlus, Share2 } from "lucide-react";

// Dashboard business metrics are intentionally NOT stored here anymore.
// They come from /api/v1/dashboard, /api/v1/schedule/:date and
// /api/v1/analytics/interviewers. This file only contains UI configuration.

export const quickActions = [
  { id: "qa-new-job", label: "New Job Posting", icon: PlusCircle, to: "/advertisement/add" },
  { id: "qa-add-interviewer", label: "Add Interviewer", icon: UserPlus, to: "/interviewer" },
  { id: "qa-share-pipeline", label: "Share Pipeline Link", icon: Share2, to: "/advertisement" },
];

const now = new Date();
export const scheduleCalendarMonth = {
  year: now.getFullYear(),
  monthIndex: now.getMonth(),
};
export const scheduleDefaultDay = now.getDate();
export const scheduleByDay = {};
