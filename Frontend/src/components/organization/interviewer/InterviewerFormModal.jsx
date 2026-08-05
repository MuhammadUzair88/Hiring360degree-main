// InterviewerFormModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck } from "lucide-react";
import { emptyInterviewerFormValues } from "./interviewerdata";
import { findInterviewer, addInterviewer, updateInterviewer } from "./InterviewerStore";

/**
 * Add/Edit Interviewer — blurred backdrop + centered card, no route change.
 * Same fields and card design as the old full-page form; only the shell
 * changed. Portaled to document.body so it always sits above the app
 * shell (sidebars/header use z-30/z-40, this uses z-50) regardless of
 * any transform/stacking-context quirks in an ancestor.
 *
 * `interviewerId` is null in add mode, an interviewer id in edit mode.
 */
export default function InterviewerFormModal({ isOpen, interviewerId = null, onClose = () => {} }) {
  const isEditMode = Boolean(interviewerId);

  const existingInterviewer = useMemo(
    () => (isEditMode ? findInterviewer(interviewerId) : null),
    [interviewerId, isEditMode]
  );

  const [values, setValues] = useState(emptyInterviewerFormValues);

  useEffect(() => {
    if (!isOpen) return;
    setValues(
      existingInterviewer
        ? { name: existingInterviewer.name, email: existingInterviewer.email, round: existingInterviewer.round }
        : emptyInterviewerFormValues
    );
  }, [isOpen, existingInterviewer]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateInterviewer(existingInterviewer.id, values);
    } else {
      addInterviewer(values);
    }
    onClose();
  };

  if (isEditMode && !existingInterviewer) {
    return createPortal(
      <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0px_20px_40px_-8px_rgba(0,0,0,0.15)] p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-900 text-lg font-semibold">Interviewer not found</p>
          <p className="text-neutral-600 text-sm">This interviewer may have already been removed.</p>
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-primary-700 rounded-lg text-white text-sm font-semibold hover:bg-primary-800 transition-colors">
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const title = isEditMode ? "Edit Interviewer" : "Add Interviewer";
  const subtitle = isEditMode
    ? `Update ${existingInterviewer?.name ?? "this interviewer"}'s details and evaluation round assignment.`
    : "Create a new interviewer account and assign an evaluation round.";
  const submitLabel = isEditMode ? "Save Changes" : "Create Interviewer";

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="interviewer-form-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />

      <form onSubmit={handleSubmit} className="relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-white/95 rounded-2xl shadow-[0px_20px_40px_-8px_rgba(0,0,0,0.2)] outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col">
        <div className="h-1.5 bg-primary-700 shrink-0" />

        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-5 sm:right-6 sm:top-7 p-2 rounded-lg text-neutral-600 hover:text-gray-900 hover:bg-secondary-200 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 pr-10">
            <h2 id="interviewer-form-title" className="text-gray-900 text-xl sm:text-2xl font-semibold leading-tight">
              {title}
            </h2>
            <p className="text-neutral-600 text-sm leading-5 opacity-80">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="interviewer-name" className="text-neutral-600 text-xs font-medium leading-4 tracking-tight">
              Full Name
            </label>
            <input
              id="interviewer-name" type="text" required
              value={values.name} onChange={handleChange("name")}
              placeholder="e.g. Jonathan Henderson"
              className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="interviewer-email" className="text-neutral-600 text-xs font-medium leading-4 tracking-tight">
              Corporate Email
            </label>
            <input
              id="interviewer-email" type="email" required
              value={values.email} onChange={handleChange("email")}
              placeholder="j.henderson@hiring360.ai"
              className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
            />
            <p className="px-1 text-neutral-600/70 text-sm leading-5">
              Interview invitations will be sent to this address.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="interviewer-round" className="text-neutral-600 text-xs font-medium leading-4 tracking-tight">
              Evaluation Round
            </label>
            <input
              id="interviewer-round" type="text" required
              value={values.round} onChange={handleChange("round")}
              placeholder="e.g. Technical Round or HR Round"
              className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
            />
          </div>

          <div className="p-4 bg-primary-50/50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-gray-900 text-sm font-semibold leading-5">Round-specific access</span>
              <p className="text-neutral-600 text-xs leading-5">
                The interviewer will only be able to see candidate scorecards and profiles for
                their assigned rounds. This ensures data privacy across the evaluation funnel.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-secondary-300 flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-neutral-600 text-base font-medium hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-primary-600 rounded-xl text-violet-100 text-base font-semibold shadow-[0px_10px_15px_-3px_rgba(124,58,237,0.20)] hover:bg-primary-700 transition-colors">
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}