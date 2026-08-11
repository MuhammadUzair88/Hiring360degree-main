import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  BriefcaseBusiness,
  Edit3,
  ExternalLink,
  FileText,
  MapPin,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  Users,
  Video,
} from "lucide-react";

const MAX_VISIBLE_TAGS = 3;

function statusMeta(status) {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "close" || normalized === "closed") {
    return {
      label: "Closed",
      className: "bg-gray-100 text-gray-600 ring-gray-200",
      dotClass: "bg-gray-400",
      live: false,
    };
  }

  return {
    label: "Live",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dotClass: "bg-emerald-500",
    live: true,
  };
}

function ActionRow({ icon: Icon, children, danger = false, ...props }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-secondary-100 hover:text-primary-800"
      }`}
      {...props}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </button>
  );
}

export default function AdvertisementCard({
  id,
  departmentLabel,
  typeLabel,
  title,
  location,
  salary,
  postedDate,
  endDate,
  tags = [],
  applicantsCount = 0,
  status,
  onRequestDelete = () => {},
  onStatusChange = async () => {},
  isMutating = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const meta = statusMeta(status);

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = Math.max(tags.length - MAX_VISIBLE_TAGS, 0);
  const formattedSalary =
    salary !== null && salary !== undefined && salary !== "" ? String(salary) : null;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const runStatusChange = async () => {
    setMenuOpen(false);
    await onStatusChange(id, meta.live ? "Close" : "Live");
  };

  const linkClass =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-secondary-100 hover:text-primary-800";

  return (
    <article
      className={`relative flex min-h-[300px] flex-col overflow-visible rounded-xl border border-primary-300 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${
        menuOpen ? "z-40" : "z-0"
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 overflow-hidden rounded-tr-xl">
        <div className="absolute -right-9 -top-9 h-20 w-20 rounded-full bg-primary-50" />
      </div>

      <div className="relative z-20 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="max-w-[145px] truncate rounded-full bg-primary-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-800">
            {departmentLabel}
          </span>

          <span className="max-w-[130px] truncate rounded-full bg-secondary-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-700">
            {typeLabel}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${meta.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
            {meta.label}
          </span>
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label={`Actions for ${title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
              menuOpen
                ? "bg-secondary-100 text-primary-800"
                : "text-gray-500 hover:bg-secondary-100 hover:text-primary-800"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-10 z-[100] w-[236px] overflow-hidden rounded-xl border border-secondary-300 bg-white p-2 shadow-[0_16px_38px_rgba(15,23,42,0.16)]"
            >
              <Link to={`/advertisement/job/${id}`} onClick={() => setMenuOpen(false)} className={linkClass}>
                <ExternalLink className="h-4 w-4" />
                View advertisement
              </Link>

              <Link to={`/advertisement/edit/${id}`} onClick={() => setMenuOpen(false)} className={linkClass}>
                <Edit3 className="h-4 w-4" />
                Edit advertisement
              </Link>

              <Link
                to={`/advertisement/job/${id}/candidate-intake`}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                <Users className="h-4 w-4" />
                Candidate pipeline
              </Link>

              <Link to={`/advertisement/job/${id}/rounds`} onClick={() => setMenuOpen(false)} className={linkClass}>
                <Video className="h-4 w-4" />
                Interview rounds
              </Link>

              <Link
                to={`/advertisement/job/${id}/offer-letter`}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                <FileText className="h-4 w-4" />
                Offer letters
              </Link>

              <div className="my-1 border-t border-secondary-200" />

              <ActionRow
                icon={meta.live ? Archive : RotateCcw}
                onClick={runStatusChange}
                disabled={isMutating}
              >
                {meta.live ? "Close advertisement" : "Reopen advertisement"}
              </ActionRow>

              <ActionRow
                icon={Trash2}
                danger
                onClick={() => {
                  setMenuOpen(false);
                  onRequestDelete();
                }}
                disabled={isMutating}
              >
                Delete advertisement
              </ActionRow>
            </div>
          ) : null}
        </div>
      </div>

      <Link to={`/advertisement/job/${id}`} className="relative mt-4 block min-w-0">
        <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-primary-800">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </Link>

      {formattedSalary ? (
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            Salary
          </p>
          <p className="mt-1 text-lg font-semibold leading-6 text-slate-900">
            {formattedSalary}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex min-h-7 flex-wrap items-center gap-2">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-secondary-300 bg-secondary-100/70 px-2.5 py-1 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}

        {remainingTagsCount > 0 ? (
          <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
            +{remainingTagsCount} more
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-secondary-200 pt-4">
        <div className="min-w-0 text-[11px] leading-5 text-gray-400">
          <p>Posted {postedDate}</p>
          <p>Closes {endDate}</p>
        </div>

        <Link
          to={`/advertisement/job/${id}/candidate-intake`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-primary-800 transition hover:bg-primary-100"
        >
          <BriefcaseBusiness className="h-4 w-4" />
          <span className="text-base font-semibold">{Number(applicantsCount || 0)}</span>
          <span className="text-[11px] font-medium">Applicants</span>
        </Link>
      </div>
    </article>
  );
}
