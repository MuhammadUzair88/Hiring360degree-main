import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobOverviewDetailsCard from "./JobOverviewDetailsCard";
import JobOverviewAssetPanel from "./JobOverviewAssetPanel";
import JobOverviewDescriptionCard from "./JobOverviewDescriptionCard";
import JobOverviewSkeleton from "./JobOverviewSkeleton";
import { PublishSuccessModal } from "../advertisement";
import { useJob } from "../../../../context/JobContext";

/**
 * The full "Advertisement Overview" screen for a single job, rendered
 * at /advertisement/job/:id. The job itself is fetched once by
 * SecondaryLayout's <JobProvider> — this component just reads it via
 * useJob() and owns the Share modal's open/close state.
 */
export default function JobOverview() {
  const navigate = useNavigate();
  const { job, error,pamphlet } = useJob();
  const [showShareModal, setShowShareModal] = useState(false);

  if (job === undefined) return <JobOverviewSkeleton />;
  
  if (job === null) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-black text-lg font-semibold">Job posting not found</p>
        <p className="text-black/60 text-sm max-w-sm">
          {error || "This advertisement may have been removed, or the link is incorrect."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/advertisement")}
          className="mt-2 px-6 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Job Postings
        </button>
      </div>
    );
  }


  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <JobOverviewDetailsCard
          job={job}
          onEdit={() => navigate(`/advertisement/edit/${job._id}`)}
          onShare={() => setShowShareModal(true)}
        />
        <JobOverviewAssetPanel job={job} pamphlet={pamphlet} />
      </div>

      <JobOverviewDescriptionCard job={job} />

      <PublishSuccessModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onReturnToDashboard={() => setShowShareModal(false)}
        formData={job}
        organizationName={job.organization?.name || "Your Company"}
        pamphletImageDataUrl={pamphlet.generatedImageUrl}
        jobId={job._id}
      />
    </div>
  );
}
