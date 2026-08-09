import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

import JobHeader from "./JobHeader";
import AboutRole from "./AboutRole";
import StatusBadge from "./StatusBadge";
import CandidateFormStructure from "./CandidateFormStructure";
import SubmissionSuccess from "./SubmissionSuccess";


/**
 * Composes the entire candidate application experience — job header,
 * about-role card, status badge, form, and success state — into one
 * drop-in component. Everything is driven by props, with `dummyJob` as
 * the fallback, so this renders correctly with zero setup:
 *
 *   <CandidateFormOverview />                        → dummy data preview
 *   <CandidateFormOverview job={fetchedJob} />        → real data
 *   <CandidateFormOverview loading />                  → loading skeleton
 *   <CandidateFormOverview error="Failed to load" />   → error state
 *   <CandidateFormOverview onSubmit={realApiCall} />   → wire up the real submit
 */
export default function CandidateFormOverview({ job = dummyJob, loading = false, error = "", onSubmit }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (loading) return <OverviewSkeleton />;
  if (error || !job) return <OverviewError />;

  const { jobTitle, description, organization, deadline } = job;
  const isDeadlinePassed = deadline && new Date(deadline) < new Date();

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
        <JobHeader organization={organization} jobTitle={jobTitle} deadline={deadline} />

        <AboutRole description={description} />

        <div className="bg-secondary-50 rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-primary-700/10 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-700/5 rounded-full pointer-events-none" />

          {isSubmitted ? (
            <SubmissionSuccess organizationName={organization?.name} />
          ) : (
            <div className="relative">
              <div className="mb-6">
                <StatusBadge isClosed={isDeadlinePassed} />

                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-3">
                  Submit Your Application
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Fill in your details below to apply for the{" "}
                  <span className="font-semibold text-slate-900">{jobTitle}</span> position at{" "}
                  {organization?.name}.
                </p>
              </div>

              <div className="border-t border-secondary-300 pt-6">
                {isDeadlinePassed ? (
                  <ClosedNotice />
                ) : (
                  <CandidateFormStructure
                    organizationId={organization?.organizationId}
                    onSuccess={() => setIsSubmitted(true)}
                    onSubmit={onSubmit}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClosedNotice() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger-100 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-danger-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Applications Closed</h3>
      <p className="text-sm text-gray-500 mt-2">
        The application deadline for this position has passed.
      </p>
    </div>
  );
}

function OverviewError() {
  return (
    <div className="min-h-screen bg-secondary-100 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-20 h-20 bg-danger-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-danger-500" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">Position Not Found</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        This job application link seems to be invalid or has expired.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-2.5 bg-primary-700 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-secondary-300 rounded-lg" />
            <div className="h-4 w-24 bg-secondary-300 rounded-md" />
          </div>
          <div className="h-9 w-64 sm:w-80 bg-secondary-300 rounded-md mt-4" />
          <div className="h-4 w-48 bg-secondary-300 rounded-md mt-3" />
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-secondary-50 rounded-2xl p-6 shadow-sm ring-1 ring-secondary-300/60 space-y-3 animate-pulse">
            <div className="h-6 w-40 bg-secondary-300 rounded-md" />
            <div className="h-4 w-full bg-secondary-300 rounded-md" />
            <div className="h-4 w-5/6 bg-secondary-300 rounded-md" />
          </div>

          <div className="bg-secondary-50 rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-secondary-300/60 space-y-6 animate-pulse">
            <div className="h-6 w-48 bg-secondary-300 rounded-md" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-secondary-300 rounded-md" />
                <div className="h-12 w-full bg-secondary-300 rounded-xl" />
              </div>
            ))}
            <div className="h-32 w-full bg-secondary-300 rounded-2xl" />
            <div className="h-12 w-full bg-secondary-300 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}