import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import InterviewerSidebar from "../sidebar/InterviewerSidebar";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import interviewerDashboardService from "../../services/interviewerDashboardService";

/**
 * Layout for the interviewer portal. Structurally identical to MainLayout
 * (sidebar + content column) but intentionally has NO header — the
 * interviewer portal is sidebar-only.
 */
export default function InterviewerLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { interviewer, logoutInterviewer } = useAuth();
  const navigate = useNavigate();

  // The interviewer's own token doesn't carry the organization's branding,
  // so we fetch it once here and hand it down to the sidebar.
  const { data } = useAsync(() => interviewerDashboardService.getOrganization(), []);
  const organization = data?.organization;

  const handleLogout = () => {
    logoutInterviewer();
    navigate("/interviewers/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-secondary-50">
      {!mobileNavOpen && (
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          aria-controls="interviewer-sidebar"
          className="app-interviewer-open-tab"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <InterviewerSidebar
        organizationName={organization?.name || interviewer?.name}
        organizationIndustry={interviewer?.type}
        organizationLogo={organization?.logo}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
