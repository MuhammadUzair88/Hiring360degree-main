import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobOverviewDetailsCard from "./JobOverviewDetailsCard";
import JobOverviewAssetPanel from "./JobOverviewAssetPanel";
import JobOverviewDescriptionCard from "./JobOverviewDescriptionCard";
import JobOverviewSkeleton from "./JobOverviewSkeleton";
import { PublishSuccessModal } from "../advertisement";
import { getJobOverviewById } from "./data";

/**
 * The full "Advertisement Overview" screen for a single job, rendered
 * at /advertisement/job/:id. Owns fetching (dummy for now — swap the
 * effect for a real GET call later), the loading/not-found states,
 * and the Share modal. Reuses PublishSuccessModal as-is so the share
 * experience here is identical to the one shown right after publishing.
 */
export default function JobOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(undefined); // undefined = loading, null = not found
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setJob(undefined);
    const timer = setTimeout(() => setJob(getJobOverviewById(id)), 300);
    return () => clearTimeout(timer);
  }, [id]);

  if (job === undefined) return <JobOverviewSkeleton />;

  if (job === null) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-black text-lg font-semibold">Job posting not found</p>
        <p className="text-black/60 text-sm max-w-sm">
          This advertisement may have been removed, or the link is incorrect.
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
        <JobOverviewAssetPanel job={job} />
      </div>

      <JobOverviewDescriptionCard job={job} />

      <PublishSuccessModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onReturnToDashboard={() => setShowShareModal(false)}
        formData={job}
        organizationName={job.organization?.name || "Your Company"}
        pamphletImageDataUrl={job.generatedImageUrl}
        jobId={job._id}
      />
    </div>
  );
}