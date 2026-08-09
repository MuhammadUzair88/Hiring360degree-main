import React, { useCallback, useEffect, useMemo, useState } from "react";
import OrganizationProfileCard from "./OrganizationProfileCard";
import CompanyInformationCard from "./CompanyInformationCard";
import SecurityCard from "./SecurityCard";
import UnsavedChangesBar from "./UnsavedChangesBar";
import SettingsSuccessToast from "./SettingsSuccessToast";
import { organizationProfile, companyInformationFields, securitySettings } from "./settingdata";
import PageHeader from "../interviewer/PageHeader";
import { pageContent } from "../interviewer/interviewerdata";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { uploadImageToCloudinary } from "../../../utils/uploadImage";
import { formatRelativeTime } from "../../../utils/formatters";

/** id -> value map, e.g. { name: "Hiring360 Enterprise", ... } */
function buildValuesFromOrganization(organization) {
  return companyInformationFields.reduce((acc, field) => {
    acc[field.id] = organization?.[field.id] ?? "";
    return acc;
  }, {});
}

export default function SettingsOverview() {
  const { organization, refreshOrganization, updateOrganizationProfile } = useAuth();
  const toast = useToast();

  const initialValues = useMemo(() => buildValuesFromOrganization(organization), [organization]);

  const [values, setValues] = useState(initialValues);
  const [logoUrl, setLogoUrl] = useState(organization?.logo || null);
  const [logoFile, setLogoFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastState, setToastState] = useState({ visible: false, title: "", message: "" });

  // Whenever the org profile in AuthContext refreshes (e.g. right after
  // this page mounts), reset the local form to match it — but only while
  // the user hasn't started editing, so we never clobber unsaved input.
  useEffect(() => {
    if (isDirty) return;
    setValues(buildValuesFromOrganization(organization));
    setLogoUrl(organization?.logo || null);
  }, [organization, isDirty]);

  const handleFieldChange = useCallback((id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
    setIsDirty(true);
  }, []);

  const handleReplaceLogo = useCallback((file) => {
    setLogoFile(file);
    setLogoUrl((prevUrl) => {
      if (prevUrl && prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
      return URL.createObjectURL(file);
    });
    setIsDirty(true);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoUrl((prevUrl) => {
      if (prevUrl && prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setIsDirty(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setValues(buildValuesFromOrganization(organization));
    setLogoFile(null);
    setLogoUrl(organization?.logo || null);
    setIsDirty(false);
  }, [organization]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      let logo = organization?.logo;
      if (logoFile) logo = await uploadImageToCloudinary(logoFile);
      else if (logoUrl === null) logo = "";

      const result = await updateOrganizationProfile({ ...values, logo });

      if (result.success) {
        setIsDirty(false);
        setLogoFile(null);
        setToastState({
          visible: true,
          title: "Update Successful",
          message: "Your organization profile was updated successfully.",
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload the new logo. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [values, logoFile, logoUrl, organization, updateOrganizationProfile, toast]);

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        pageLabel={pageContent.settings.label}
        subtitle={pageContent.settings.subtitle}
        organization={organization}
      />
      <OrganizationProfileCard
        title={organizationProfile.title}
        subtitle={organizationProfile.subtitle}
        acceptedFormats={organizationProfile.acceptedFormats}
        recommendedText={organizationProfile.recommendedText}
        logoUrl={logoUrl}
        onReplace={handleReplaceLogo}
        onRemove={handleRemoveLogo}
      />

      <CompanyInformationCard values={values} onFieldChange={handleFieldChange} />

      <SecurityCard
        {...securitySettings}
        lastChanged={organization?.updatedAt ? formatRelativeTime(organization.updatedAt) : "—"}
        onUpdatePassword={() =>
          toast.info("Password changes aren't available yet — reach out to support.")
        }
      />

      <UnsavedChangesBar
        visible={isDirty}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <SettingsSuccessToast
        visible={toastState.visible}
        title={toastState.title}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
