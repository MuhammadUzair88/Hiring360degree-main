import React, { useCallback, useMemo, useState } from "react";
import OrganizationProfileCard from "./OrganizationProfileCard";
import CompanyInformationCard from "./CompanyInformationCard";
import SecurityCard from "./SecurityCard";
import UnsavedChangesBar from "./UnsavedChangesBar";
import SettingsSuccessToast from "./SettingsSuccessToast";
import {
  organizationProfile,
  companyInformationFields,
  securitySettings,
  settingsToast,
} from "./settingdata";
import PageHeader from "../interviewer/PageHeader";
import { pageContent  } from "../interviewer/interviewerdata";


/** id -> value map, e.g. { companyName: "Hiring360 Enterprise", ... } */
function buildInitialValues(fields) {
  return fields.reduce((acc, field) => {
    acc[field.id] = field.value;
    return acc;
  }, {});
}

export default function SettingsOverview() {
  const initialValues = useMemo(
    () => buildInitialValues(companyInformationFields),
    []
  );

  const [values, setValues] = useState(initialValues);
  const [logoUrl, setLogoUrl] = useState(organizationProfile.logoUrl);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const handleFieldChange = useCallback((id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
    setIsDirty(true);
  }, []);

  const handleReplaceLogo = useCallback((file) => {
    setLogoUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return URL.createObjectURL(file);
    });
    setIsDirty(true);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setIsDirty(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setValues(initialValues);
    setLogoUrl(organizationProfile.logoUrl);
    setIsDirty(false);
  }, [initialValues]);

  const handleSave = useCallback(() => {
    // TODO: wire this up to the real "save organization settings" API call.
    setIsDirty(false);
    setToast({
      visible: true,
      title: settingsToast.title,
      message: settingsToast.message,
    });
  }, []);

  const handleUpdatePassword = useCallback(() => {
    // TODO: replace with the real change-password flow/modal.
    setToast({
      visible: true,
      title: "Update Successful",
      message: "Security settings updated successfully.",
    });
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        pageLabel={pageContent.settings.label}
        subtitle={pageContent.settings.subtitle}
      />
      <OrganizationProfileCard
        logoUrl={logoUrl}
        onReplace={handleReplaceLogo}
        onRemove={handleRemoveLogo}
      />

      <CompanyInformationCard values={values} onFieldChange={handleFieldChange} />

      <SecurityCard {...securitySettings} onUpdatePassword={handleUpdatePassword} />

      <UnsavedChangesBar
        visible={isDirty}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />

      <SettingsSuccessToast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}