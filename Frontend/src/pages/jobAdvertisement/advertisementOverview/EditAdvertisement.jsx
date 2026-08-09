import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreateAdvertisementOverview,
  PamphletOverview,
  PublishSuccessModal,
  JobPamphletPreview,
  initialPamphletSettings,
  pamphletThemeDefaultColors,
} from "../../../components/organization/jobAdvertisement/advertisement";
import { exportNodeAsPng, uploadDataUrlToCloudinary } from "../../../components/organization/jobAdvertisement/advertisement/Pamphletutils";
import advertisementService from "../../../services/advertisementService";
import { extractErrorMessage } from "../../../services/apiClient";
import { useToast } from "../../../context/ToastContext";

const PUBLISH_CAPTURE_ID = "edit-campaign-capture";

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
    deadline: job.deadline ? job.deadline.slice(0, 10) : "",
    experience: job.experience || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "",
  };
}

export default function EditAdvertisement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(undefined); // undefined = loading, null = not found
  const [formData, setFormData] = useState(null);
  const [screen, setScreen] = useState("details"); // "details" | "pamphlet"
  const [isPamphletGenerated, setIsPamphletGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [pamphletSettings, setPamphletSettings] = useState(initialPamphletSettings);
  const [pamphletImageDataUrl, setPamphletImageDataUrl] = useState(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const data = await advertisementService.getById(id);
        if (!isActive) return;
        const ad = data.advertisement;
        setJob(ad || null);
        if (ad) {
          setFormData(jobToFormData(ad));
          setIsPamphletGenerated(Boolean(data.pamphlet?.generatedImageUrl));
          setPamphletImageDataUrl(data.pamphlet?.generatedImageUrl || null);
          if (data.pamphlet) {
            setPamphletSettings((prev) => ({
              ...prev,
              theme: data.pamphlet.template || prev.theme,
              branding: data.pamphlet.brandingPreference || prev.branding,
              logoSize: data.pamphlet.logoSize || prev.logoSize,
              headingSize: data.pamphlet.headingSize || prev.headingSize,
              colors: data.pamphlet.colors
                ? { ...prev.colors, [data.pamphlet.template]: data.pamphlet.colors }
                : prev.colors,
            }));
          }
        }
      } catch (error) {
        if (isActive) setJob(null);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [id]);

  if (job === undefined) {
    return <div className="w-full py-24 text-center text-black/60">Loading job posting…</div>;
  }

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
  const currentPamphletColors = pamphletSettings.colors?.[pamphletSettings.theme] || {};

  // const handlePublish = async () => {
  //   setIsSubmitting(true);
  //   setSubmitError("");
  //   try {
  //     let dataUrl = pamphletImageDataUrl;
  //     if (isPamphletGenerated) {
  //       try {
  //         dataUrl = await exportNodeAsPng(PUBLISH_CAPTURE_ID);
  //         setPamphletImageDataUrl(dataUrl);
  //       } catch (captureError) {
  //         console.warn("Could not regenerate the campaign image.", captureError);
  //       }
  //     }

  //     const currentColors = pamphletSettings.colors?.[pamphletSettings.theme] || {};

  //     await advertisementService.update(job._id, {
  //       ...formData,
  //       generatedImageUrl: dataUrl,
  //       template: pamphletSettings.theme,
  //       colors: currentColors,
  //       brandingPreference: pamphletSettings.branding,
  //       logoSize: pamphletSettings.logoSize,
  //       headingSize: pamphletSettings.headingSize,
  //     });

  //     setShowSuccess(true);
  //   } catch (error) {
  //     const message = extractErrorMessage(error, "Could not update this job posting. Please try again.");
  //     setSubmitError(message);
  //     toast.error(message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

    const handlePublish = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let generatedImageUrl = job.generatedImageUrl || null;
      let capturedDataUrl = null;

      if (isPamphletGenerated) {
        try {
          capturedDataUrl = await exportNodeAsPng(PUBLISH_CAPTURE_ID);
          generatedImageUrl = await uploadDataUrlToCloudinary(capturedDataUrl);
        } catch (captureError) {
          console.warn("Could not generate/upload the campaign image.", captureError);
        }
      }

                 await advertisementService.update(job._id, {
        ...formData,
        generatedImageUrl,
        template: pamphletSettings.theme,
        colors: currentPamphletColors,
        brandingPreference: pamphletSettings.branding,
        logoSize: pamphletSettings.logoSize,
        headingSize: pamphletSettings.headingSize,
      });



      setPamphletImageDataUrl(capturedDataUrl || job.generatedImageUrl);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Could not update this job posting. Please try again."
      );
        toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {screen === "pamphlet" ? (
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
      ) : (
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
      )}

      {/* Off-screen — only exists so exportNodeAsPng has a real 1200x630
          node to screenshot the moment an update succeeds. */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }} aria-hidden="true">
        <div id={PUBLISH_CAPTURE_ID} style={{ width: "1200px", height: "630px" }}>
          <JobPamphletPreview
            theme={pamphletSettings.theme}
            job={formData}
            colors={currentPamphletColors}
            branding={pamphletSettings.branding}
            logoSize={pamphletSettings.logoSize}
            headingSize={pamphletSettings.headingSize}
          />
        </div>
      </div>

      <PublishSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onReturnToDashboard={() => navigate(backTo)}
        formData={formData}
        organizationName={job.organization?.name || "Your Company"}
        pamphletImageDataUrl={pamphletImageDataUrl}
        jobId={job._id}
      />
    </>
  );
}
