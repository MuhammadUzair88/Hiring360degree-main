// PageHeader.jsx
import React from "react";
import { organizationData } from "./interviewerdata";

export default function PageHeader({
  pageLabel,
  subtitle,
  organization = organizationData,
})
{
  
  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="text-black text-3xl font-semibold leading-tight">
        {organization.name} {pageLabel}
      </h1>
      <p className="text-black text-base leading-6">
        {subtitle}
      </p>
    </div>
  );
}