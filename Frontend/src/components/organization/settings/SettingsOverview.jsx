import React, { useCallback, useEffect, useMemo, useState } from "react";
import OrganizationProfileCard from "./OrganizationProfileCard";
import CompanyInformationCard from "./CompanyInformationCard";
import SecurityCard from "./SecurityCard";
import UpdatePasswordModal from "./UpdatePasswordModal";
import UnsavedChangesBar from "./UnsavedChangesBar";
import SettingsSuccessToast from "./SettingsSuccessToast";
import {
  organizationProfile,
  companyInformationFields,
  securitySettings,
} from "./settingdata";
import PageHeader from "../interviewer/PageHeader";
import { pageContent } from "../interviewer/interviewerdata";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { uploadImageToCloudinary } from "../../../utils/uploadImage";
import { formatRelativeTime } from "../../../utils/formatters";
import authService from "../../../services/authService";
import { extractErrorMessage } from "../../../services/apiClient";

const ALLOWED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];
const MAX_LOGO_SIZE = 5 * 1024 * 1024;

function buildValuesFromOrganization(organization) {
  return companyInformationFields.reduce((accumulator, field) => {
    accumulator[field.id] = organization?.[field.id] ?? "";
    return accumulator;
  }, {});
}

function isValidWebsite(value) {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function SettingsOverview() {
  const {
    organization,
    refreshOrganization,
    updateOrganizationProfile,
  } = useAuth();
  const toast = useToast();

  const initialValues = useMemo(
    () => buildValuesFromOrganization(organization),
    [organization]
  );

  const [values, setValues] = useState(initialValues);
  const [logoUrl, setLogoUrl] = useState(organization?.logo || null);
  const [logoFile, setLogoFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [toastState, setToastState] = useState({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (isDirty) return;
    setValues(buildValuesFromOrganization(organization));
    setLogoUrl(organization?.logo || null);
  }, [organization, isDirty]);


  const handleFieldChange = useCallback((id, nextValue) => {
    setValues((previous) => ({ ...previous, [id]: nextValue }));
    setIsDirty(true);
  }, []);

  const handleReplaceLogo = useCallback(
    (file) => {
      if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
        toast.error("Use a PNG, JPG, WebP, or SVG logo.");
        return;
      }

      if (file.size > MAX_LOGO_SIZE) {
        toast.error("The organization logo must be smaller than 5 MB.");
        return;
      }

      setLogoFile(file);
      setLogoUrl((previousUrl) => {
        if (previousUrl?.startsWith("blob:")) URL.revokeObjectURL(previousUrl);
        return URL.createObjectURL(file);
      });
      setIsDirty(true);
    },
    [toast]
  );

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoUrl((previousUrl) => {
      if (previousUrl?.startsWith("blob:")) URL.revokeObjectURL(previousUrl);
      return null;
    });
    setIsDirty(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setValues(buildValuesFromOrganization(organization));
    setLogoFile(null);
    setLogoUrl((previousUrl) => {
      if (previousUrl?.startsWith("blob:")) URL.revokeObjectURL(previousUrl);
      return organization?.logo || null;
    });
    setIsDirty(false);
  }, [organization]);

  const handleSave = useCallback(async () => {
    if (!String(values.name || "").trim()) {
      toast.error("Company name cannot be empty.");
      return;
    }

    if (!isValidWebsite(String(values.website || "").trim())) {
      toast.error("Enter a valid website URL, including https://.");
      return;
    }

    setIsSaving(true);

    try {
      let logo = organization?.logo || "";
      if (logoFile) logo = await uploadImageToCloudinary(logoFile);
      else if (logoUrl === null) logo = "";

      const result = await updateOrganizationProfile({
        name: String(values.name || "").trim(),
        industry: String(values.industry || "").trim(),
        phone: String(values.phone || "").trim(),
        website: String(values.website || "").trim(),
        location: String(values.location || "").trim(),
        logo,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setIsDirty(false);
      setLogoFile(null);
      setLogoUrl(result.data?.organization?.logo || null);
      setToastState({
        visible: true,
        title: "Profile updated",
        message: "Your organization information has been saved.",
      });
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to save organization settings."));
    } finally {
      setIsSaving(false);
    }
  }, [
    values,
    logoFile,
    logoUrl,
    organization,
    updateOrganizationProfile,
    toast,
  ]);

  const handlePasswordUpdate = useCallback(
    async ({ currentPassword, newPassword }) => {
      setPasswordSaving(true);
      try {
        const data = await authService.updatePassword({
          currentPassword,
          newPassword,
        });

        await refreshOrganization();
        setPasswordModalOpen(false);
        setToastState({
          visible: true,
          title: "Password updated",
          message: "Your organization password was changed successfully.",
        });

        return { success: true, data };
      } catch (error) {
        const message = extractErrorMessage(error, "Failed to update password.");
        return { success: false, message };
      } finally {
        setPasswordSaving(false);
      }
    },
    [refreshOrganization]
  );

  const passwordChangedAt =
    organization?.passwordChangedAt || organization?.createdAt || null;

  return (
    <div className="flex w-full flex-col gap-6">
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

      <CompanyInformationCard
        values={values}
        onFieldChange={handleFieldChange}
      />

      <SecurityCard
        {...securitySettings}
        lastChanged={passwordChangedAt ? formatRelativeTime(passwordChangedAt) : "—"}
        onUpdatePassword={() => setPasswordModalOpen(true)}
      />

      <UnsavedChangesBar
        visible={isDirty}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <UpdatePasswordModal
        open={passwordModalOpen}
        isSubmitting={passwordSaving}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handlePasswordUpdate}
      />

      <SettingsSuccessToast
        visible={toastState.visible}
        title={toastState.title}
        message={toastState.message}
        onClose={() =>
          setToastState((previous) => ({ ...previous, visible: false }))
        }
      />
    </div>
  );
}
