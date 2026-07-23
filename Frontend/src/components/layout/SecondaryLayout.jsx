import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import SecondarySidebar from "../sidebar/SecondarySidebar";
import OrgHeader from "../header/OrgHeader";
import SecondaryHeader from "../header/SecondaryHeader";

export default function SecondaryLayout() {
  // Two independent drawers below their respective breakpoints:
  // MainSidebar becomes static at 600px, SecondarySidebar at 1200px —
  // so on a 700px-wide tablet, MainSidebar is a docked rail while
  // SecondarySidebar is still opened on demand.
  const [mainNavOpen, setMainNavOpen] = useState(false);
  const [jobNavOpen, setJobNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar
        mobileOpen={mainNavOpen}
        onClose={() => setMainNavOpen(false)}
      />
      <SecondarySidebar
        jobTitle="Senior Frontend Developer"
        status="In Progress"
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