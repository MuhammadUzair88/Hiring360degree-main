import React from "react";
import { dashboardGreeting } from "./data";

/**
 * Page-level greeting shown at the top of the Dashboard Overview.
 * Purely presentational — swap `teamName`/`subtitle` via props once
 * the real signed-in org/user is available.
 */
export default function DashboardGreetingBanner({
  orgName = dashboardGreeting.orgName,
  subtitle = dashboardGreeting.subtitle,
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      <h1 className="text-slate-900 text-2xl sm:text-3xl font-bold leading-tight">
        Good morning, {orgName}!
      </h1>
      <p className="text-zinc-600 text-sm sm:text-base leading-6">{subtitle}</p>
    </div>
  );
}
