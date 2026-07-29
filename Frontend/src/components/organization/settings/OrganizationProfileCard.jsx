import React, { useRef } from "react";
import { Pencil } from "lucide-react";
import { organizationProfile } from "./settingdata";

/**
 * Logo uploader card at the top of the Settings page. Purely
 * presentational for the file itself — `onReplace` receives the raw
 * File object so a parent (SettingsOverview) can preview it locally
 * and eventually upload it to the backend.
 */
export default function OrganizationProfileCard({
  title = organizationProfile.title,
  subtitle = organizationProfile.subtitle,
  logoUrl = organizationProfile.logoUrl,
  uploadIcon: UploadIcon = organizationProfile.uploadIcon,
  acceptedFormats = organizationProfile.acceptedFormats,
  recommendedText = organizationProfile.recommendedText,
  onReplace = () => {},
  onRemove = () => {},
}) {
  const fileInputRef = useRef(null);

  const handleReplaceClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onReplace(file);
    e.target.value = "";
  };

  return (
    <div className="self-stretch p-6 sm:p-8 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-gray-900 text-xl font-semibold leading-7">{title}</h2>
        <p className="text-neutral-600 text-base font-normal leading-6">{subtitle}</p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="relative shrink-0">
          <div className="w-32 h-32 bg-primary-50 rounded-xl outline outline-2 outline-offset-[-2px] outline-secondary-400 flex justify-center items-center overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Organization logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-4 flex flex-col items-center gap-2">
                {UploadIcon && (
                  <UploadIcon className="w-7 h-7 text-neutral-600" strokeWidth={1.5} />
                )}
                <span className="text-center text-neutral-600 text-[10px] font-medium leading-4">
                  {acceptedFormats}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReplaceClick}
            aria-label="Edit logo"
            className="w-8 h-8 absolute -right-1 -bottom-1 bg-primary-700 rounded-full outline outline-2 outline-offset-[-2px] outline-white flex justify-center items-center hover:bg-primary-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <Pencil className="w-3 h-3 text-white" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 w-full flex flex-col gap-4 items-center sm:items-start">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <button
              type="button"
              onClick={handleReplaceClick}
              className="px-6 py-2.5 bg-primary-800 rounded-lg text-violet-100 text-sm font-bold leading-5 hover:bg-primary-700 transition-colors"
            >
              Replace Logo
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="px-6 py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-400 text-gray-900 text-sm font-bold leading-5 hover:bg-secondary-200 transition-colors"
            >
              Remove
            </button>
          </div>
          <p className="text-center sm:text-left text-neutral-600 text-sm font-normal leading-5">
            {recommendedText}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/svg+xml, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}