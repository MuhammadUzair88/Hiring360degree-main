import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import InterviewerSidebar from "../sidebar/InterviewerSidebar";

/**
 * Layout for the interviewer portal. Structurally identical to MainLayout
 * (sidebar + content column) but intentionally has NO header — the
 * interviewer portal is sidebar-only.
 *
 * Because there's no header to host a hamburger button, the mobile
 * drawer (below 600px) is opened via `.app-interviewer-open-tab`, a small
 * fixed edge tab — the same pattern index.css already uses for
 * SecondarySidebar's off-canvas trigger, just at the sm breakpoint to
 * match InterviewerSidebar's own drawer/rail breakpoint.
 */
export default function InterviewerLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary-50">
      {/* Mobile-only trigger for the off-canvas drawer — hidden once the
          sidebar becomes a permanent rail at sm+ (600px). */}
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
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}