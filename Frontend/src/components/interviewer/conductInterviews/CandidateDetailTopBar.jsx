

// src/components/interviewer/conductInterviews/CandidateDetailTopBar.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarClock,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
  Video,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const HEADER_STATUS_TONE = {
  Scheduled: "bg-primary-50 text-primary-700 outline-primary-200",
  Upcoming: "bg-primary-50 text-primary-700 outline-primary-200",
  Ongoing: "bg-success-100 text-success-700 outline-success-200",
  Completed: "bg-primary-100 text-primary-800 outline-primary-300",
  Cancelled: "bg-danger-50 text-danger-700 outline-danger-200",
  "No Show": "bg-secondary-200 text-black/60 outline-secondary-300",
};

const RESOURCE_OPTIONS = [
  { id: "resume", label: "Resume", keywords: "resume cv document", icon: FileText },
  { id: "job", label: "Job Description", keywords: "job description role skills requirements", icon: BookOpen },
  { id: "feedback", label: "Feedback", keywords: "feedback evaluation notes review", icon: MessageSquare },
];

function formatScheduleDate(date, time) {
  if (!date && !time) return "Schedule not available";

  let dateLabel = date || "";
  if (date) {
    const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      dateLabel = parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  return [dateLabel, time].filter(Boolean).join(" · ");
}

export default function CandidateDetailTopBar({
  candidate,
  roundLabel,
  canJoin,
  onJoinInterview,
  backTo,
  activeResource = "resume",
  onSelectResource = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { interviewer, isInterviewerLogin, logoutInterviewer } = useAuth();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  const badgeTone =
    HEADER_STATUS_TONE[candidate.status] || HEADER_STATUS_TONE.Upcoming;

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return RESOURCE_OPTIONS;

    return RESOURCE_OPTIONS.filter((item) =>
      `${item.label} ${item.keywords}`.toLowerCase().includes(query)
    );
  }, [search]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const chooseResource = (resourceId) => {
    onSelectResource(resourceId);
    setSearch("");
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter" && filteredResources.length > 0) {
      event.preventDefault();
      chooseResource(filteredResources[0].id);
    }

    if (event.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const handleJoin = () => {
    if (!isInterviewerLogin) {
      navigate("/interviewers/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        },
      });
      return;
    }

    onJoinInterview();
  };

  const handleLogout = () => {
    logoutInterviewer();
    navigate("/interviewers/login", { replace: true });
  };

  return (
    <div className="self-stretch h-16 shrink-0 border-b border-secondary-300 bg-secondary-50 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link
          to={backTo}
          aria-label="Back to interviews"
          className="-ml-1 shrink-0 rounded-full p-2 text-slate-900 transition-colors hover:bg-secondary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300">
            <User size={16} className="text-primary-800" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold leading-5 text-slate-900 sm:text-lg">
                {candidate.candidateName}
              </h1>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide outline outline-1 outline-offset-[-1px] sm:text-[10px] ${badgeTone}`}
              >
                {candidate.status}
              </span>
            </div>
            <p className="truncate text-xs font-medium tracking-tight text-gray-700">
              {roundLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Resource search: searches the three candidate-detail resources and switches tabs. */}
        <div ref={searchRef} className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={search}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search resources..."
            aria-label="Search candidate resources"
            className="w-56 rounded-full bg-secondary-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline outline-1 outline-offset-[-1px] outline-secondary-300 placeholder:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 lg:w-64"
          />

          {searchOpen && (
            <div className="absolute right-0 top-[46px] z-50 w-64 overflow-hidden rounded-xl border border-secondary-300 bg-white p-1.5 shadow-xl">
              {filteredResources.length > 0 ? (
                filteredResources.map((item) => {
                  const Icon = item.icon;
                  const active = activeResource === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseResource(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "bg-primary-50 text-primary-800"
                          : "text-gray-700 hover:bg-secondary-100"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-3 text-xs text-gray-500">
                  No matching resource.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Schedule notification button: uses this real scheduled interview. */}
        <div ref={notificationRef} className="relative hidden sm:block">
          <button
            type="button"
            aria-label="Interview schedule"
            title="Interview schedule"
            onClick={() => {
              setNotificationOpen((open) => !open);
              setAccountOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-secondary-100 hover:text-primary-800"
          >
            <Bell size={18} />
            {candidate.status === "Ongoing" && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-success-500" />
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-secondary-300 bg-white p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <CalendarClock size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Current interview
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {formatScheduleDate(candidate.interviewDate, candidate.interviewTime)}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {candidate.candidateName} · {roundLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/interviewers/dashboard")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-100 px-3 py-2 text-xs font-semibold text-primary-800 hover:bg-primary-50"
              >
                <LayoutDashboard size={14} />
                Open interviewer dashboard
              </button>
            </div>
          )}
        </div>

        {/* Account/settings menu. There is no fake interviewer-settings page. */}
        <div ref={accountRef} className="relative hidden sm:block">
          <button
            type="button"
            aria-label="Interviewer account"
            title="Interviewer account"
            onClick={() => {
              setAccountOpen((open) => !open);
              setNotificationOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-secondary-100 hover:text-primary-800"
          >
            <Settings size={18} />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-secondary-300 bg-white shadow-xl">
              <div className="border-b border-secondary-200 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {interviewer?.name || "Interviewer"}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {interviewer?.email || "Signed-in interviewer"}
                </p>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => navigate("/interviewers/dashboard")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-secondary-100"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger-600 hover:bg-danger-50"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        {canJoin && (
          <button
            type="button"
            onClick={handleJoin}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary-700 px-3 py-2 transition-colors hover:bg-primary-800 sm:px-5"
          >
            <Video size={16} className="text-secondary-50" />
            <span className="hidden text-sm font-medium leading-6 text-secondary-50 sm:inline">
              Join Interview Room
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
