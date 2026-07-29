import React from "react";
import { dashboardGreeting } from "./data";

/**
 * Page-level greeting shown at the top of the Dashboard Overview.
 * Title = index.css's "page heading" size (`text-3xl` → 30px, per the
 * comment on that token). Subtitle = index.css's default body-copy
 * pairing (`text-base` + `leading-6`, matching --text-base--line-height
 * exactly). These classes are shared class-for-class with
 * AdvertisementPageHeader so every page header in the app matches.
 */
export default function DashboardGreetingBanner({
  orgName = dashboardGreeting.orgName,
  subtitle = dashboardGreeting.subtitle,
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      <h1 className="text-black text-3xl font-semibold leading-tight">
        Good morning, {orgName}!
      </h1>
      <p className="text-black text-base leading-6">{subtitle}</p>
    </div>
  );
}