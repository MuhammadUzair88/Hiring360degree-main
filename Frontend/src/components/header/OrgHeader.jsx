import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Mail,
  Menu,
  Plus,
  Search,
  UserRound,
  Users,
  Loader2,
  CalendarClock,
  FileCheck2,
  CheckCircle2,
  Inbox,
  X,
} from "lucide-react";
import logoIcon from "../../assets/logos.svg";
import headerService from "../../services/headerService";
import { extractErrorMessage } from "../../services/apiClient";
import { formatRelativeTime } from "../../utils/formatters";

const LAST_NOTIFICATION_VIEW_KEY = "hiring360:header:lastNotificationView";

function SearchResultIcon({ type }) {
  if (type === "job") return <BriefcaseBusiness className="h-4 w-4" />;
  if (type === "interviewer") return <UserRound className="h-4 w-4" />;
  return <Users className="h-4 w-4" />;
}

function NotificationIcon({ type }) {
  if (type === "interview") return <CalendarClock className="h-4 w-4" />;
  if (type === "offer") return <FileCheck2 className="h-4 w-4" />;
  if (type === "hire") return <CheckCircle2 className="h-4 w-4" />;
  return <Users className="h-4 w-4" />;
}

export default function OrgHeader({
  orgName = "Hiring 360",
  onMenuClick = () => {},
}) {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [openPanel, setOpenPanel] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [panelError, setPanelError] = useState("");
  const [lastNotificationView, setLastNotificationView] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem(LAST_NOTIFICATION_VIEW_KEY) || 0);
  });

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setPanelError("");
    try {
      const data = await headerService.getNotifications();
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch (error) {
      setPanelError(extractErrorMessage(error, "Unable to load notifications."));
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setContactsLoading(true);
    setPanelError("");
    try {
      const data = await headerService.getContacts();
      setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
    } catch (error) {
      setPanelError(extractErrorMessage(error, "Unable to load candidate contacts."));
    } finally {
      setContactsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 60_000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

  useEffect(() => {
    const trimmed = query.trim();
    setSearchError("");

    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    let active = true;
    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const data = await headerService.search(trimmed);
        if (!active) return;
        setSearchResults(Array.isArray(data?.results) ? data.results : []);
      } catch (error) {
        if (!active) return;
        setSearchResults([]);
        setSearchError(extractErrorMessage(error, "Search failed."));
      } finally {
        if (active) setIsSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpenPanel(null);
        if (!query.trim()) setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [query]);

  const unseenNotificationCount = useMemo(() => {
    return notifications.filter((item) => {
      const createdAt = new Date(item?.createdAt || 0).getTime();
      return Number.isFinite(createdAt) && createdAt > lastNotificationView;
    }).length;
  }, [notifications, lastNotificationView]);

  const openNotifications = async () => {
    const willOpen = openPanel !== "notifications";
    setOpenPanel(willOpen ? "notifications" : null);
    if (!willOpen) return;

    await loadNotifications();
    const viewedAt = Date.now();
    window.localStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, String(viewedAt));
    setLastNotificationView(viewedAt);
  };

  const openContacts = async () => {
    const willOpen = openPanel !== "contacts";
    setOpenPanel(willOpen ? "contacts" : null);
    if (willOpen) await loadContacts();
  };

  const goToResult = (result) => {
    setQuery("");
    setSearchResults([]);
    setOpenPanel(null);
    if (result?.route) navigate(result.route);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setQuery("");
      setSearchResults([]);
      return;
    }

    if (event.key === "Enter" && searchResults[0]) {
      event.preventDefault();
      goToResult(searchResults[0]);
    }
  };

  const showSearchDropdown = query.trim().length >= 2;

  return (
    <header ref={headerRef} className="app-header relative z-30 overflow-visible">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="app-menu-btn"
        >
          <Menu className="h-5 w-5" />
        </button>

        <img
          src={logoIcon}
          alt={orgName}
          className="h-8 w-8 shrink-0 sm:hidden"
        />

        <div className="relative hidden min-w-0 max-w-sm flex-1 sm:block lg:max-w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search candidates, jobs, or interviewers..."
            className="w-full rounded-full bg-primary-50 py-2 pl-10 pr-10 text-sm text-gray-700 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-primary-300"
            aria-label="Search workspace"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {showSearchDropdown && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full min-w-[360px] overflow-hidden rounded-2xl border border-secondary-300 bg-white shadow-2xl shadow-slate-900/10">
              <div className="border-b border-secondary-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Workspace search
                </p>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching…
                  </div>
                ) : searchError ? (
                  <p className="px-4 py-8 text-center text-sm text-red-600">{searchError}</p>
                ) : searchResults.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-500">
                    No matching jobs, candidates, or interviewers.
                  </p>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      type="button"
                      onClick={() => goToResult(result)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-primary-50"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <SearchResultIcon type={result.type} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {result.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">
                          {result.subtitle || result.type}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="relative">
          <button
            type="button"
            onClick={openNotifications}
            aria-label="Notifications"
            aria-expanded={openPanel === "notifications"}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 transition hover:bg-primary-50 hover:text-primary-800"
          >
            <Bell className="h-5 w-5" />
            {unseenNotificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {openPanel === "notifications" && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-secondary-300 bg-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-secondary-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <p className="mt-0.5 text-xs text-gray-500">Real activity from your hiring workspace</p>
                </div>
                <button
                  type="button"
                  onClick={loadNotifications}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50"
                >
                  Refresh
                </button>
              </div>

              <div className="max-h-[430px] overflow-y-auto p-2">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                ) : panelError ? (
                  <p className="px-4 py-8 text-center text-sm text-red-600">{panelError}</p>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="mx-auto h-6 w-6 text-gray-300" />
                    <p className="mt-2 text-sm font-medium text-gray-700">No recent activity</p>
                    <p className="mt-1 text-xs text-gray-400">New applications and interview events will appear here.</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setOpenPanel(null);
                        if (item.route) navigate(item.route);
                      }}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-secondary-100"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <NotificationIcon type={item.type} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-gray-500">{item.message}</span>
                        <span className="mt-1 block text-[11px] text-gray-400">{formatRelativeTime(item.createdAt)}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={openContacts}
            aria-label="Candidate contacts"
            aria-expanded={openPanel === "contacts"}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 transition hover:bg-primary-50 hover:text-primary-800"
          >
            <Mail className="h-5 w-5" />
          </button>

          {openPanel === "contacts" && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] overflow-hidden rounded-2xl border border-secondary-300 bg-white shadow-2xl shadow-slate-900/10">
              <div className="border-b border-secondary-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Candidate contacts</p>
                <p className="mt-0.5 text-xs text-gray-500">Recent real candidates from your applications</p>
              </div>

              <div className="max-h-[430px] overflow-y-auto p-2">
                {contactsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                ) : panelError ? (
                  <p className="px-4 py-8 text-center text-sm text-red-600">{panelError}</p>
                ) : contacts.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Inbox className="mx-auto h-6 w-6 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No candidate contacts yet.</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-secondary-100"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                        {(contact.name || "C").charAt(0).toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenPanel(null);
                          navigate(contact.route || "/advertisement");
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate text-sm font-semibold text-slate-900">{contact.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">
                          {contact.jobTitle || contact.email}
                        </span>
                      </button>
                      <a
                        href={`mailto:${contact.email}`}
                        title={`Email ${contact.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-secondary-300 bg-white text-gray-500 hover:border-primary-300 hover:text-primary-700"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-secondary-300 sm:block" />

        <Link
          to="/advertisement/add"
          aria-label="New Job Posting"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-700 sm:px-4"
        >
          <Plus className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">New Job Posting</span>
        </Link>
      </div>
    </header>
  );
}
