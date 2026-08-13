// import interviewerService from "../../../services/interviewerService";
// import { extractErrorMessage } from "../../../services/apiClient";

// /**
//  * interviewerStore.js
//  * ------------------------------------------------------------------
//  * A thin, cached data layer over interviewerService (the real
//  * /api/interviewer/* backend). The list page and the add/edit form
//  * are mounted as separate pieces of UI — without *some* shared,
//  * cached state, an interviewer added on the form would either need
//  * its own refetch or vanish until the list reloads. This module is
//  * that shared cache: fetched once, kept in memory, updated in place
//  * after every mutation, and broadcast via a tiny pub-sub so any
//  * mounted component re-renders with the latest data.
//  *
//  * The backend's `type` field is this UI's "round" concept — mapped
//  * at this boundary so every component above this file can keep
//  * calling it `round`.
//  * ------------------------------------------------------------------
//  */

// let interviewers = [];
// let hasLoaded = false;
// const listeners = new Set();

// function notify() {
//   listeners.forEach((listener) => listener(interviewers));
// }

// function fromBackend(iv) {
//   return {
//     id: iv._id,
//     name: iv.name,
//     email: iv.email,
//     round: iv.type,
//     role: iv.type,
//     status: "Active",
//     avatarUrl: null,
//   };
// }

// /** Current cached snapshot of every interviewer (empty until loadInterviewers() resolves once). */
// export function getInterviewers() {
//   return interviewers;
// }

// /** Subscribe to future changes; returns an unsubscribe function. */
// export function subscribe(listener) {
//   listeners.add(listener);
//   return () => listeners.delete(listener);
// }

// /** Look up a single interviewer by id from the cache (used to prefill the edit form). */
// export function findInterviewer(id) {
//   return interviewers.find((item) => item.id === id) ?? null;
// }

// /** Fetches the organization's interviewer roster from the backend. Safe to call repeatedly. */
// export async function loadInterviewers({ force = false } = {}) {
//   if (hasLoaded && !force) return interviewers;
//   const data = await interviewerService.getAll();
//   interviewers = (data.interviewers || []).map(fromBackend);
//   hasLoaded = true;
//   notify();
//   return interviewers;
// }

// /** Create a new interviewer from form values and add it to the top of the list. */
// export async function addInterviewer({ name, email, round }) {
//   try {
//     const data = await interviewerService.create({ name, email, type: round });
//     const record = fromBackend(data.interviewer);
//     interviewers = [record, ...interviewers];
//     notify();
//     return { success: true, interviewer: record, message: data.message };
//   } catch (error) {
//     return { success: false, message: extractErrorMessage(error, "Failed to add this interviewer.") };
//   }
// }

// /** Patch an existing interviewer (used by the edit form). */
// export async function updateInterviewer(id, { name, email, round }) {
//   try {
//     const data = await interviewerService.update(id, { name, email, type: round });
//     const record = fromBackend(data.interviewer);
//     interviewers = interviewers.map((item) => (item.id === id ? record : item));
//     notify();
//     return { success: true, interviewer: record };
//   } catch (error) {
//     return { success: false, message: extractErrorMessage(error, "Failed to update this interviewer.") };
//   }
// }

// /** Remove an interviewer (used by the table's delete action). */
// export async function removeInterviewer(id) {
//   try {
//     await interviewerService.remove(id);
//     interviewers = interviewers.filter((item) => item.id !== id);
//     notify();
//     return { success: true };
//   } catch (error) {
//     return { success: false, message: extractErrorMessage(error, "Failed to remove this interviewer.") };
//   }
// }



import interviewerService from "../../../services/interviewerService";
import { extractErrorMessage } from "../../../services/apiClient";

let interviewers = [];
let hasLoaded = false;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener(interviewers));
}

function fromBackend(interviewer) {
  return {
    id: String(interviewer._id || interviewer.id),
    name: interviewer.name || "Unnamed interviewer",
    email: interviewer.email || "",
    round: interviewer.type || "General",
    role: interviewer.type || "General",
    status: "Active",
    avatarUrl: interviewer.avatarUrl || null,
    createdAt: interviewer.createdAt || null,
    updatedAt: interviewer.updatedAt || null,
  };
}

export function getInterviewers() {
  return interviewers;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function findInterviewer(id) {
  return interviewers.find((item) => String(item.id) === String(id)) ?? null;
}

export async function loadInterviewers({ force = false } = {}) {
  if (hasLoaded && !force) return interviewers;

  const data = await interviewerService.getAll();
  interviewers = (data?.interviewers || []).map(fromBackend);
  hasLoaded = true;
  notify();
  return interviewers;
}

export async function addInterviewer({ name, email, round }) {
  try {
    const data = await interviewerService.create({ name, email, type: round });
    const record = fromBackend(data.interviewer);
    interviewers = [record, ...interviewers.filter((item) => item.id !== record.id)];
    notify();
    return { success: true, interviewer: record, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to add this interviewer."),
    };
  }
}

export async function updateInterviewer(id, { name, email, round }) {
  try {
    const data = await interviewerService.update(id, { name, email, type: round });
    const record = fromBackend(data.interviewer);
    interviewers = interviewers.map((item) => (String(item.id) === String(id) ? record : item));
    notify();
    return { success: true, interviewer: record };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to update this interviewer."),
    };
  }
}

export async function removeInterviewer(id) {
  try {
    await interviewerService.remove(id);
    interviewers = interviewers.filter((item) => String(item.id) !== String(id));
    notify();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Failed to remove this interviewer."),
    };
  }
}
