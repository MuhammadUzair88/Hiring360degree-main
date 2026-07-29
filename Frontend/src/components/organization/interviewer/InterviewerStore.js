import { initialInterviewers } from "./interviewerdata";

/**
 * interviewerStore.js
 * ------------------------------------------------------------------
 * A minimal in-memory data layer for the Interviewer feature. There is
 * no backend wired up yet, but the list page and the add/edit form are
 * mounted as separate routes — without *some* shared state, an
 * interviewer added on the form would vanish the moment you navigated
 * back to the list. This module is that shared state: a plain array
 * plus a tiny pub-sub so any mounted component can react to changes.
 *
 * Swap the body of each function for a real API call (axios/fetch)
 * when the backend is ready — the exported function signatures are
 * designed to stay the same either way.
 * ------------------------------------------------------------------
 */

let interviewers = [...initialInterviewers];
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener(interviewers));
}

/** Current snapshot of every interviewer. */
export function getInterviewers() {
  return interviewers;
}

/** Subscribe to future changes; returns an unsubscribe function. */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Look up a single interviewer by id (used to prefill the edit form). */
export function findInterviewer(id) {
  return interviewers.find((item) => item.id === id) ?? null;
}

/** Create a new interviewer from form values and add it to the top of the list. */
export function addInterviewer({ name, email, round }) {
  const record = {
    id: `itv-${Date.now()}`,
    name,
    email,
    round,
    role: "Interviewer",
    status: "Active",
    avatarUrl: null,
  };
  interviewers = [record, ...interviewers];
  notify();
  return record;
}

/** Patch an existing interviewer (used by the edit form). */
export function updateInterviewer(id, patch) {
  interviewers = interviewers.map((item) =>
    item.id === id ? { ...item, ...patch } : item
  );
  notify();
}

/** Remove an interviewer (used by the table's delete action). */
export function removeInterviewer(id) {
  interviewers = interviewers.filter((item) => item.id !== id);
  notify();
}