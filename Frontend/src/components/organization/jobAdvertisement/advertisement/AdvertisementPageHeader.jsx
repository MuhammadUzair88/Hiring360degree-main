import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { organizationData, advertisementPageHeader } from "./data";

/**
 * Page title + subtitle + "Post New Job" CTA.
 * Title = organizationData.name + advertisementPageHeader.title
 * (org name comes from backend, page label is static per page).
 * Title/subtitle classes are identical to DashboardGreetingBanner's —
 * both map to index.css's page-heading (`text-3xl`) and default
 * body-copy (`text-base leading-6`) tokens.
 */
export default function AdvertisementPageHeader({
  organization = organizationData,
  title = advertisementPageHeader.title,
  subtitle = advertisementPageHeader.subtitle,
  ctaLabel = advertisementPageHeader.ctaLabel,
  ctaTo = advertisementPageHeader.ctaTo,
}) {
  return (
    <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-black text-3xl font-semibold leading-tight">
          {organization.name} {title}
        </h1>
        <p className="text-black text-base leading-6">{subtitle}</p>
      </div>

      <Link
        to={ctaTo}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-800 text-secondary-50 text-base font-medium shadow-[0px_4px_6px_-4px_rgba(91,33,182,0.2)] hover:bg-primary-700 transition-colors shrink-0 w-full sm:w-auto"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        {ctaLabel}
      </Link>
    </div>
  );
}