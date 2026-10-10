import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  UserCheck,
  FileSignature,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const COLLAPSE_STORAGE_KEY =
  "hiring360:secondarySidebarCollapsed";

function buildNavItems(jobId, applicantCount = 0) {
  const base = jobId
    ? `/advertisement/job/${jobId}`
    : "/advertisement";

  return [
    {
      label: "Advertisement Overview",
      to: base,
      icon: FileText,
      end: true,
    },
    {
      label: "Candidate Intake",
      to: `${base}/candidate-intake`,
      icon: Users,
      badge: String(applicantCount ?? 0),
    },
    {
      label: "Rounds",
      to: `${base}/rounds`,
      icon: UserCheck,
    },
    {
      label: "Offer Letter",
      to: `${base}/offer-letter`,
      icon: FileSignature,
    },
  ];
}

function getStatusTone(status = "") {
  const normalized = String(status)
    .trim()
    .toLowerCase();

  if (
    normalized === "live" ||
    normalized === "active" ||
    normalized === "published"
  ) {
    return {
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      label: status || "Live",
    };
  }

  if (normalized === "draft") {
    return {
      dot: "bg-amber-500",
      text: "text-amber-700",
      label: status || "Draft",
    };
  }

  if (
    normalized === "closed" ||
    normalized === "expired"
  ) {
    return {
      dot: "bg-zinc-400",
      text: "text-zinc-600",
      label: status || "Closed",
    };
  }

  return {
    dot: "bg-primary-800",
    text: "text-gray-700",
    label: status || "In Progress",
  };
}

export default function SecondarySidebar({
  jobId,
  job,
  applicantCount = 0,
  onNewJobPosting,
  mobileOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      window.localStorage.getItem(
        COLLAPSE_STORAGE_KEY
      ) === "true"
    );
  });

  const [internalMobileOpen, setInternalMobileOpen] =
    useState(false);

  const effectiveJobId =
    jobId || job?._id || null;

  const jobTitle =
    job?.jobTitle || "Untitled Job";

  const status =
    job?.status || "In Progress";

  const safeApplicantCount =
    Number(applicantCount) || 0;

  const statusTone =
    getStatusTone(status);

  const navItems = useMemo(
    () =>
      buildNavItems(
        effectiveJobId,
        safeApplicantCount
      ),
    [effectiveJobId, safeApplicantCount]
  );

  const isOpen =
    mobileOpen || internalMobileOpen;

  const closeDrawer = () => {
    setInternalMobileOpen(false);
    onClose();
  };

  const openDrawer = () => {
    setInternalMobileOpen(true);
  };

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          COLLAPSE_STORAGE_KEY,
          String(next)
        );
      }

      return next;
    });
  };

  const handleNewJobPosting = () => {
    closeDrawer();

    if (onNewJobPosting) {
      onNewJobPosting();
      return;
    }

    navigate("/advertisement/add");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close job menu"
          onClick={closeDrawer}
          className="
            fixed inset-0 z-40
            bg-black/30
            lg:hidden
          "
        />
      )}

      {/* Mobile open button */}
      {!isOpen && (
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Open job sections"
          aria-controls="secondary-sidebar"
          aria-expanded="false"
          className="app-sidebar-open-tab lg:hidden"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <aside
        id="secondary-sidebar"
        aria-label="Job navigation"
        className={`
          app-sidebar-secondary
          h-screen
          lg:sticky lg:top-0
          bg-secondary-100
          border-r border-secondary-300
          flex flex-col justify-between
          ${isOpen ? "is-open" : ""}
          ${collapsed ? "is-collapsed" : ""}
        `}
      >
        {/* Collapse button */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={
            collapsed
              ? "Expand job menu"
              : "Collapse job menu"
          }
          aria-expanded={!collapsed}
          aria-controls="secondary-sidebar"
          className="app-sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        <div className="min-h-0">
          {/* Job header */}
          <div
            className="
              job-header-wrap
              p-4 sm:p-6
              border-b border-secondary-300
              flex items-start
              justify-between
              gap-2
            "
          >
            <div className="min-w-0 flex-1">
              <div className="job-header-text">
                <p
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                    leading-6
                    truncate
                  "
                  title={jobTitle}
                >
                  {jobTitle}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      min-w-0
                      ${statusTone.text}
                    `}
                  >
                    <span
                      className={`
                        w-2 h-2
                        rounded-full
                        shrink-0
                        ${statusTone.dot}
                      `}
                    />

                    <span className="truncate">
                      {statusTone.label}
                    </span>
                  </span>

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      text-zinc-500
                      whitespace-nowrap
                    "
                  >
                    {safeApplicantCount}{" "}
                    {safeApplicantCount === 1
                      ? "applicant"
                      : "applicants"}
                  </span>
                </div>
              </div>

              {/* Collapsed status dot */}
              <span
                className={`
                  job-header-dot
                  hidden
                  w-3 h-3
                  rounded-full
                  mx-auto
                  ${statusTone.dot}
                `}
                title={`${jobTitle} — ${statusTone.label}`}
              />
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close job menu"
              className="
                lg:hidden
                p-1
                rounded-full
                text-gray-600
                hover:bg-secondary-200
                shrink-0
              "
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className="
              px-2 py-2
              flex flex-col
              gap-1
            "
          >
            {navItems.map(
              ({
                label,
                to,
                icon: Icon,
                end,
                badge,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeDrawer}
                  title={label}
                  className={({ isActive }) =>
                    `
                    app-subnav-item
                    flex
                    items-center
                    justify-between
                    px-4 py-3
                    rounded-lg
                    text-xs
                    transition-colors
                    ${
                      isActive
                        ? "bg-primary-50 border-l-4 border-primary-800 text-primary-800 font-medium"
                        : "text-gray-700 hover:bg-secondary-200"
                    }
                  `
                  }
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />

                    <span className="subnav-label truncate">
                      {label}
                    </span>
                  </span>

                  {badge !== undefined &&
                    badge !== null && (
                      <span
                        className="
                          subnav-label
                          min-w-6
                          px-2 py-0.5
                          rounded-full
                          bg-primary-800
                          text-white
                          text-[10px]
                          font-bold
                          text-center
                          shrink-0
                        "
                      >
                        {badge}
                      </span>
                    )}
                </NavLink>
              )
            )}
          </nav>
        </div>

        {/* New job */}
        <div className="p-4 border-t border-secondary-300">
          <button
            type="button"
            onClick={handleNewJobPosting}
            aria-label="New Job Posting"
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              px-4 py-3
              rounded-lg
              bg-primary-800
              text-white
              text-xs
              font-medium
              hover:bg-primary-700
              transition-colors
            "
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />

            <span className="subnav-label">
              New Job Posting
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}