import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import OrgHeader from "../header/OrgHeader";

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <OrgHeader onMenuClick={() => setMobileNavOpen(true)} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}