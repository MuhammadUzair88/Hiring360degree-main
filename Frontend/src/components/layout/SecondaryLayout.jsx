import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import SecondarySidebar from "../sidebar/SecondarySidebar";
import SecondaryHeader from "../header/SecondaryHeader";
import { getJobOverviewById } from "../organization/jobAdvertisement/advertisementOverview";

export default function SecondaryLayout() {
  const { id } = useParams();
  const job = id ? getJobOverviewById(id) : null;

  const [mainNavOpen, setMainNavOpen] = useState(false);
  const [jobNavOpen, setJobNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar
        mobileOpen={mainNavOpen}
        onClose={() => setMainNavOpen(false)}
      />
      <SecondarySidebar
        jobId={id}
        jobTitle={job?.jobTitle || "Select a job"}
        status={job?.status || ""}
        progress={40}
        mobileOpen={jobNavOpen}
        onClose={() => setJobNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <SecondaryHeader
          onMenuClick={() => setMainNavOpen(true)}
          onJobMenuClick={() => setJobNavOpen(true)}
        />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}