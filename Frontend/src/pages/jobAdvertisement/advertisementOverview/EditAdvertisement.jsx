import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreateAdvertisementOverview,
  PamphletOverview,
  PublishSuccessModal,
  initialPamphletSettings,
  pamphletThemeDefaultColors,
} from "../../../components/organization/jobAdvertisement/advertisement";
import { getJobOverviewById } from "../../../components/organization/jobAdvertisement/advertisementOverview";

function jobToFormData(job) {
  return {
    jobTitle: job.jobTitle || "",
    department: job.department || "",
    employmentType: job.employmentType || "",
    workMode: job.workMode || "",
    location: job.location || "",
    salary: job.salary || "",
    internshipPaid: job.internshipPaid || "",
    internshipDuration: job.internshipDuration || "",
    deadline: job.deadline || "",
    experience: job.experience || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "",
  };
}

export default function EditAdvertisement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = useMemo(() => getJobOverviewById(id), [id]);

  const [formData, setFormData] = useState(() => (job ? jobToFormData(job) : null));
  const [screen, setScreen] = useState("details"); // "details" | "pamphlet"
  const [isPamphletGenerated, setIsPamphletGenerated] = useState(Boolean(job?.generatedImageUrl));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [pamphletSettings, setPamphletSettings] = useState(initialPamphletSettings);

  if (!job) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-black text-lg font-semibold">Job posting not found</p>
        <p className="text-black/60 text-sm max-w-sm">
          This advertisement may have been removed. Head back to your job postings to keep going.
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

  const backTo = `/advertisement/job/${job._id}`;

  const handlePublish = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      // TODO: replace with PATCH /advertisements/:id once the endpoint exists.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setShowSuccess(true);
    } catch {
      setSubmitError("Could not update this job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (screen === "pamphlet") {
    return (
      <PamphletOverview
        formData={formData}
        pamphletSettings={pamphletSettings}
        setPamphletTheme={(theme) => setPamphletSettings((prev) => ({ ...prev, theme }))}
        setPamphletBranding={(branding) => setPamphletSettings((prev) => ({ ...prev, branding }))}
        setPamphletLogoSize={(logoSize) => setPamphletSettings((prev) => ({ ...prev, logoSize }))}
        setPamphletHeadingSize={(headingSize) => setPamphletSettings((prev) => ({ ...prev, headingSize }))}
        handlePamphletColorChange={(theme, colorKey, value) =>
          setPamphletSettings((prev) => ({
            ...prev,
            colors: { ...prev.colors, [theme]: { ...prev.colors[theme], [colorKey]: value } },
          }))
        }
        resetPamphletTheme={(theme) =>
          setPamphletSettings((prev) => ({
            ...prev,
            colors: { ...prev.colors, [theme]: pamphletThemeDefaultColors[theme] },
          }))
        }
        onBack={() => {
          setIsPamphletGenerated(true);
          setScreen("details");
        }}
      />
    );
  }

  return (
    <>
      <CreateAdvertisementOverview
        isEditMode
        formData={formData}
        onFieldChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
        onSkillsChange={(skills) => setFormData((prev) => ({ ...prev, skills }))}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onPublish={handlePublish}
        isPamphletGenerated={isPamphletGenerated}
        onOpenPamphletEditor={() => setScreen("pamphlet")}
        pamphletSettings={pamphletSettings}
        backTo={backTo}
      />

      <PublishSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onReturnToDashboard={() => navigate(backTo)}
        formData={formData}
        organizationName={job.organization?.name || "Your Company"}
        pamphletImageDataUrl={job.generatedImageUrl}
        jobId={job._id}
      />
    </>
  );
}