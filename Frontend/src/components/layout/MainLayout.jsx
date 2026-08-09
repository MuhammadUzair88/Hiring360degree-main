import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MainSidebar from "../sidebar/MainSidebar";
import OrgHeader from "../header/OrgHeader";
import { useAuth } from "../../context/AuthContext";

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { organization, logoutOrganization } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOrganization();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <MainSidebar
        organizationName={organization?.name}
        organizationIndustry={organization?.industry}
        organizationLogo={organization?.logo}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <OrgHeader orgName={organization?.name} onMenuClick={() => setMobileNavOpen(true)} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
