/**
 * jobAdvertisement/rounds/utils.js
 * ------------------------------------------------------------------
 * Small, pure helper functions used by the scheduling form and the
 * schedule list. Kept separate from useRoundsLogic so the stateful
 * hook stays focused on state, and these stay easy to reason about
 * (and swap out) on their own.
 * ------------------------------------------------------------------
 */

export const QUICK_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export function getTodayStringDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isValidTimeFormat(time) {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

/** Accepts "14:30" as-is, or converts "2:30 PM" style input to 24h. */
export function convertTo24Hour(time) {
  if (isValidTimeFormat(time)) return time;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time;
  let hours = parseInt(match[1], 10);
  if (match[3].toUpperCase() === "PM" && hours < 12) hours += 12;
  if (match[3].toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

export function formatTimeDisplay(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

export function isDateTimeInFuture(date, time) {
  if (!date || !time || !isValidTimeFormat(time)) return false;
  return new Date(`${date}T${time}:00`) > new Date();
}

function parseScheduleDateTime(item) {
  if (!item.date || !item.time) return new Date();
  const [year, month, day] = item.date.split("-");
  const [hours, minutes] = item.time.split(":");
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
}

/** A slot is "finished" once feedback is in, or once its time has passed. */
export function isInterviewFinished(item, now = new Date()) {
  if (item.feedbackEvaluation === "Completed") return true;
  if (!item.notified) return false;
  return now >= parseScheduleDateTime(item);
}

/**
 * Client-side stand-in for the old debounced availability API call.
 * Looks for another non-rejected schedule with the same interviewer,
 * date and time. Returns the conflicting schedule, or null if clear.
 */
export function findAvailabilityConflict({ scheduledInterviews, interviewerId, date, time, excludeScheduleId }) {
  if (!interviewerId || !date || !time) return null;
  return (
    scheduledInterviews.find(
      (item) =>
        item.id !== excludeScheduleId &&
        item.interviewerId === interviewerId &&
        item.date === date &&
        item.time === time &&
        item.passed !== false
    ) || null
  );
}