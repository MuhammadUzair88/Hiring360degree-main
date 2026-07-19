import React from "react";
import { Outlet } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import SecondarySidebar from "../sidebar/SecondarySidebar";
import OrgHeader from "../header/OrgHeader";
import SecondaryHeader from "../header/SecondaryHeader";

export default function SecondaryLayout() {
  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar />
      <SecondarySidebar
        jobTitle="Senior Frontend Developer"
        status="In Progress"
        progress={40}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <SecondaryHeader />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}