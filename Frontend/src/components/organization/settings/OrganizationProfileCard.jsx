
import React, { useRef } from "react";
import { Pencil } from "lucide-react";
import { organizationProfile } from "./settingdata";

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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onReplace(file);
    event.target.value = "";
  };

  return (
    <div className="flex self-stretch flex-col gap-4 rounded-xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300/60 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">{title}</h2>
        <p className="text-base font-normal leading-6 text-neutral-600">{subtitle}</p>
      </div>

      <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:gap-10">
        <div className="relative shrink-0">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl bg-primary-50 outline outline-2 outline-offset-[-2px] outline-secondary-400">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Organization logo"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-4">
                {UploadIcon && (
                  <UploadIcon className="h-7 w-7 text-neutral-600" strokeWidth={1.5} />
                )}
                <span className="text-center text-[10px] font-medium leading-4 text-neutral-600">
                  {acceptedFormats}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReplaceClick}
            aria-label="Edit logo"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 outline outline-2 outline-offset-[-2px] outline-white transition-colors hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <Pencil className="h-3 w-3 text-white" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex w-full flex-1 flex-col items-center gap-4 sm:items-start">
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              type="button"
              onClick={handleReplaceClick}
              className="rounded-lg bg-primary-800 px-6 py-2.5 text-sm font-bold leading-5 text-violet-100 transition-colors hover:bg-primary-700"
            >
              {logoUrl ? "Replace Logo" : "Upload Logo"}
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={!logoUrl}
              className="rounded-lg px-6 py-2.5 text-sm font-bold leading-5 text-gray-900 outline outline-1 outline-offset-[-1px] outline-secondary-400 transition-colors hover:bg-secondary-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <p className="text-center text-sm font-normal leading-5 text-neutral-600 sm:text-left">
            {recommendedText}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
