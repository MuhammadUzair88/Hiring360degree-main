import {
  Image as ImageIcon,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
} from "lucide-react";

/**
 * settings/data.js
 * ------------------------------------------------------------------
 * Single source of truth for every piece of dummy data rendered on
 * the Settings page. Nothing in the component files below hardcodes
 * copy or values — they all receive it as props, defaulted from the
 * matching export here. Swap these exports for an API response later
 * and no component needs to change.
 * ------------------------------------------------------------------
 */

/** Organization Profile card — logo uploader. */
export const organizationProfile = {
  title: "Organization Profile",
  subtitle:
    "This logo will appear on internal dashboards and public job postings.",
  logoUrl: null, // null renders the empty-state uploader; set to a URL to show a preview
  uploadIcon: ImageIcon,
  acceptedFormats: "PNG, SVG, JPG",
  recommendedText: "Recommended size: 512x512px. Maximum file size: 5MB.",
};

/**
 * Company Information card — each entry drives one SettingsFormField.
 * `id` doubles as the key used in the values state object that
 * SettingsOverview manages.
 */
export const companyInformationFields = [
  {
    id: "name",
    label: "Company Name",
    value: "",
    icon: Building2,
    type: "text",
  },
  {
    id: "industry",
    label: "Industry",
    value: "",
    icon: Briefcase,
    type: "text",
  },
  {
    id: "email",
    label: "Business Email",
    value: "",
    icon: Mail,
    type: "email",
    // The backend's update-profile endpoint intentionally doesn't accept
    // email changes (it's the login identifier) — shown for reference only.
    disabled: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    value: "",
    icon: Phone,
    type: "tel",
  },
  {
    id: "website",
    label: "Website",
    value: "",
    icon: Globe,
    type: "url",
  },
  {
    id: "location",
    label: "Headquarters",
    value: "",
    icon: MapPin,
    type: "text",
  },
];

/** Security card — password status + last changed. */
export const securitySettings = {
  title: "Security",
  subtitle: "Manage your account password and security settings.",
  icon: ShieldCheck,
  passwordProtected: true,
  lastChanged: "14 days ago",
};

/** Copy for the sticky unsaved-changes bar. */
export const unsavedChangesCopy = {
  message: "You have unsaved changes",
  discardLabel: "Discard",
  saveLabel: "Save Changes",
};

/** Copy for the success toast shown after a save/update action. */
export const settingsToast = {
  title: "Update Successful",
  message: "Security settings updated successfully.",
};