import React from "react";
import { Outlet } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import OrgHeader from "../header/OrgHeader";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <OrgHeader />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}