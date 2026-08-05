import React, { useState } from "react";
import { User, Mail, Phone, Loader2 } from "lucide-react";

import Form from "./Form";
import ResumeUploader from "./ResumeUploader";
import { initialCandidateFormState, validators, submitCandidateApplication } from "./data";

/**
 * The application fields themselves — name, email, phone, resume, submit.
 * Has no API dependency: it submits through `submitCandidateApplication`
 * (a mock from data.js) unless a real `onSubmit` function is passed in.
 */
export default function CandidateFormStructure({ organizationId, onSuccess, onSubmit }) {
  const [form, setForm] = useState(initialCandidateFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleResumeChange = (file) => {
    setForm((prev) => ({ ...prev, resume: file }));
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const validate = () => {
    const nextErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      phone: validators.phone(form.phone),
      resume: validators.resume(form.resume),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    try {
      setSubmitting(true);
      const submitFn = onSubmit || submitCandidateApplication;
      await submitFn({ ...form, organizationId });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setSubmitError(
        err?.message || "Something went wrong while submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
      <Form
        id="name"
        label="Full Name"
        icon={User}
        placeholder="Muhammad Haroon"
        value={form.name}
        onChange={handleChange("name")}
        error={errors.name}
      />

      <Form
        id="email"
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="yourgmail@example.com"
        value={form.email}
        onChange={handleChange("email")}
        error={errors.email}
      />

      <Form
        id="phone"
        label="Phone Number"
        icon={Phone}
        type="tel"
        placeholder="+92 3001234567"
        value={form.phone}
        onChange={handleChange("phone")}
        error={errors.phone}
      />

      <ResumeUploader file={form.resume} onChange={handleResumeChange} error={errors.resume} />

      {submitError && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full py-3.5 sm:py-4 rounded-xl bg-primary-700 text-white text-base font-medium shadow-lg shadow-primary-700/20 hover:bg-primary-800 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}