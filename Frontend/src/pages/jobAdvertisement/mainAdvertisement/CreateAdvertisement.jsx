import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateAdvertisementOverview,
  PamphletOverview,
  PublishSuccessModal,
  JobPamphletPreview,
} from "../../../components/organization/jobAdvertisement/advertisement";
import {
  initialAdvertisementForm,
  requiredAdvertisementFields,
} from "../../../components/organization/jobAdvertisement/advertisement/createadvertisementdata";
import {
  initialPamphletSettings,
  pamphletThemeDefaultColors,
} from "../../../components/organization/jobAdvertisement/advertisement/pamphletdata";
import {
  exportNodeAsPng,
  uploadDataUrlToCloudinary,
} from "../../../components/organization/jobAdvertisement/advertisement/Pamphletutils";
import advertisementService from "../../../services/advertisementService";
import { extractErrorMessage } from "../../../services/apiClient";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const REQUIRED_FIELD_LABELS = {
  jobTitle: "a Job Title",
  employmentType: "an Employment Type",
  workMode: "a Work Mode",
  deadline: "an Application Deadline",
  skills: "at least one Required Skill",
  description: "a Job Description",
};

/** Off-screen id used to render the pamphlet at real (1200x630) size so it can be captured as an image once publishing succeeds. */
const PUBLISH_CAPTURE_ID = "publish-campaign-capture";

const CreateAdvertisement = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialAdvertisementForm);
  const [pamphletSettings, setPamphletSettings] = useState(
    initialPamphletSettings,
  );
  const [isPamphletGenerated, setIsPamphletGenerated] = useState(false);
  const [showPamphlet, setShowPamphlet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pamphletImageDataUrl, setPamphletImageDataUrl] = useState(null);
  const [publishedJobId, setPublishedJobId] = useState(null);
  const toast = useToast();
  const { organization } = useAuth();

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({ ...prev, skills }));
  };

  const getMissingFields = () =>
    requiredAdvertisementFields.filter((field) => {
      const value = formData[field];
      return Array.isArray(value) ? value.length === 0 : !value;
    });

  const handlePublish = async () => {
    if (isSubmitting) return;

    const missing = getMissingFields();
    if (missing.length > 0) {
      setSubmitError(
        `Please add ${missing.map((field) => REQUIRED_FIELD_LABELS[field] || field).join(", ")} before publishing.`,
      );
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      // If a pamphlet was generated, capture it and host it on Cloudinary
      // first so its URL can ride along with the advertisement itself.
      let generatedImageUrl = null;
      let capturedDataUrl = null;
      if (isPamphletGenerated) {
        try {
          capturedDataUrl = await exportNodeAsPng(PUBLISH_CAPTURE_ID);
          generatedImageUrl = await uploadDataUrlToCloudinary(capturedDataUrl);
        } catch (captureError) {
          console.warn(
            "Could not generate/upload the campaign image.",
            captureError,
          );
        }
      }

      const payload = {
        ...formData,
        generatedImageUrl,
        template: pamphletSettings.theme,
        colors: pamphletSettings.colors?.[pamphletSettings.theme],
        brandingPreference: pamphletSettings.branding,
        logoSize: pamphletSettings.logoSize,
        headingSize: pamphletSettings.headingSize,
      };

      const result = await advertisementService.create(payload);

      setPamphletImageDataUrl(capturedDataUrl);
      setPublishedJobId(result.advertisement?._id || null);
      setShowPublishModal(true);
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while publishing this job. Please try again.",
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPamphletTheme = (theme) =>
    setPamphletSettings((prev) => ({ ...prev, theme }));
  const setPamphletBranding = (branding) =>
    setPamphletSettings((prev) => ({ ...prev, branding }));
  const setPamphletLogoSize = (logoSize) =>
    setPamphletSettings((prev) => ({ ...prev, logoSize }));
  const setPamphletHeadingSize = (headingSize) =>
    setPamphletSettings((prev) => ({ ...prev, headingSize }));

  const handlePamphletColorChange = (theme, colorKey, value) => {
    setPamphletSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [theme]: { ...prev.colors[theme], [colorKey]: value },
      },
    }));
  };

  const resetPamphletTheme = (theme) => {
    setPamphletSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [theme]: { ...pamphletThemeDefaultColors[theme] },
      },
    }));
  };

  const openPamphletEditor = () => {
    setIsPamphletGenerated(true);
    setShowPamphlet(true);
  };

  const closePamphletEditor = () => setShowPamphlet(false);

  const currentPamphletColors =
    pamphletSettings.colors?.[pamphletSettings.theme] || {};

  return (
    <>
      {showPamphlet ? (
        <PamphletOverview
          formData={formData}
          pamphletSettings={pamphletSettings}
          setPamphletTheme={setPamphletTheme}
          setPamphletBranding={setPamphletBranding}
          setPamphletLogoSize={setPamphletLogoSize}
          setPamphletHeadingSize={setPamphletHeadingSize}
          handlePamphletColorChange={handlePamphletColorChange}
          resetPamphletTheme={resetPamphletTheme}
          onBack={closePamphletEditor}
        />
      ) : (
        <CreateAdvertisementOverview
          formData={formData}
          onFieldChange={handleFieldChange}
          onSkillsChange={handleSkillsChange}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onPublish={handlePublish}
          isPamphletGenerated={isPamphletGenerated}
          onOpenPamphletEditor={openPamphletEditor}
          pamphletSettings={pamphletSettings}
        />
      )}

      {/* Off-screen — only exists so exportNodeAsPng has a real 1200x630
          node to screenshot the moment a publish succeeds. */}
      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        aria-hidden="true"
      >
        <div
          id={PUBLISH_CAPTURE_ID}
          style={{ width: "1200px", height: "630px" }}
        >
          <JobPamphletPreview
            theme={pamphletSettings.theme}
            job={formData}
            colors={currentPamphletColors}
            branding={pamphletSettings.branding}
            logoSize={pamphletSettings.logoSize}
            headingSize={pamphletSettings.headingSize}
            organizationName={organization?.name}
            organizationLogoUrl={organization?.logo}
          />
        </div>
      </div>

      <PublishSuccessModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onReturnToDashboard={() => navigate("/advertisement")}
        formData={formData}
        pamphletImageDataUrl={pamphletImageDataUrl}
        jobId={publishedJobId}
      />
    </>
  );
};

export default CreateAdvertisement;
