import React, { useMemo, useState } from "react";
import { Search, GraduationCap, Calendar, Eye, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { recentInterviews as defaultInterviews } from "./data";
import { toneForStatus, TONE_BADGE_CLASS } from "./statusTone";

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Searchable, paginated table of recent/upcoming interview schedules. */
export default function RecentInterviewsTable({
  interviews = defaultInterviews,
  onViewDetails,
  itemsPerPage = ITEMS_PER_PAGE,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return interviews;
    return interviews.filter(
      (item) =>
        item.candidateName?.toLowerCase().includes(term) ||
        item.jobTitle?.toLowerCase().includes(term)
    );
  }, [interviews, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="self-stretch rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-slate-900 text-lg font-semibold leading-6">Recent Interview Schedule</h2>
          <p className="text-zinc-600 text-xs font-medium leading-4 mt-0.5">
            {filtered.length} interview{filtered.length === 1 ? "" : "s"} scheduled
          </p>
        </div>

        <div className="relative shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600/60" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-lg text-slate-900 text-xs placeholder:text-zinc-600/60 focus:outline-primary-700 w-full sm:w-56 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-secondary-200/60 text-zinc-600 text-[10px] font-bold uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Candidate Profile</th>
              <th className="px-6 py-3">Round &amp; Status</th>
              <th className="px-6 py-3">Date &amp; Time</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-300/60">
            {pageItems.length > 0 ? (
              pageItems.map((item) => {
                const tone = toneForStatus(item.status);
                return (
                  <tr key={item.scheduleId} className="hover:bg-secondary-200/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 shrink-0 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center">
                          <GraduationCap size={15} />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-slate-900 text-sm font-semibold truncate group-hover:text-primary-800 transition-colors">
                            {item.candidateName}
                          </span>
                          <span className="block text-zinc-600 text-xs truncate">{item.jobTitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-slate-700 text-xs font-semibold">{item.roundName}</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${TONE_BADGE_CLASS[tone]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                        <Calendar size={13} />
                        {formatDate(item.interviewDate)} • {item.interviewTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(item)}
                        className="px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-zinc-600 group-hover:text-primary-800 group-hover:outline-primary-700 bg-secondary-50 transition-colors text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        View <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-zinc-600">
                    {searchTerm ? (
                      <Search size={22} className="opacity-40" />
                    ) : (
                      <Video size={22} className="opacity-40" />
                    )}
                    <p className="text-sm">
                      {searchTerm ? `No candidates match "${searchTerm}"` : "No interviews scheduled yet"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3.5 border-t border-secondary-300/60 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wide">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:outline-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:outline-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
