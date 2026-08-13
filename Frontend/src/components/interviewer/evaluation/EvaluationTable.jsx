import React, { useMemo, useState } from "react";
import { Search, Eye, FileEdit, CheckCircle2, Clock, ClipboardX } from "lucide-react";
import { TONE_BADGE_CLASS } from "../dashboard/statusTone";

/** Searchable table of finished interviews awaiting or holding evaluation feedback. */
export default function EvaluationTable({
  candidates = [],
  onSelectCandidate,
  selectedId,
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter(
      (item) =>
        item.candidateName?.toLowerCase().includes(term) ||
        item.candidateEmail?.toLowerCase().includes(term) ||
        item.jobTitle?.toLowerCase().includes(term)
    );
  }, [candidates, searchTerm]);

  return (
    <div className="rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-secondary-300/60">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600/60" />
          <input
            type="text"
            placeholder="Search candidates or roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-lg text-slate-900 text-xs placeholder:text-zinc-600/60 focus:outline-primary-700 w-full transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-secondary-200/60 text-zinc-600 text-[10px] font-bold uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Candidate Profile</th>
              <th className="px-6 py-3">Finished Round Target</th>
              <th className="px-6 py-3">Evaluation Status</th>
              <th className="px-6 py-3 text-right">Action Interface</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-300/60">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-zinc-500">
                  Loading evaluations…
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((item) => {
                const isSelected = selectedId === item.scheduleId;
                const isDone = item.evaluationStatus === "Completed";
                return (
                  <tr
                    key={item.scheduleId}
                    onClick={() => onSelectCandidate?.(item)}
                    className={`cursor-pointer transition-colors hover:bg-secondary-200/40 ${
                      isSelected ? "bg-primary-50 border-l-4 border-l-primary-800" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="block text-slate-900 text-sm font-semibold">
                        {item.candidateName}
                      </span>
                      <span className="block text-zinc-600 text-xs mt-0.5">{item.candidateEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="block text-slate-700 text-sm font-medium">{item.jobTitle}</span>
                      <span className="block text-zinc-500 text-xs mt-0.5">{item.roundName || "Interview Round"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md ${
                          isDone ? TONE_BADGE_CLASS.strong : TONE_BADGE_CLASS.subtle
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {isDone ? "Submitted" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate?.(item);
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wide flex items-center gap-1.5 ml-auto transition-colors cursor-pointer ${
                          isDone
                            ? "outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-zinc-600 hover:text-primary-800 hover:outline-primary-700"
                            : "bg-primary-800 hover:bg-primary-900 text-secondary-50"
                        }`}
                      >
                        {isDone ? (
                          <>
                            View Feedback <Eye size={12} />
                          </>
                        ) : (
                          <>
                            Evaluate <FileEdit size={12} />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-zinc-600">
                    <ClipboardX size={22} className="opacity-40" />
                    <p className="text-sm">
                      {searchTerm ? `No candidates match "${searchTerm}"` : "No evaluations available"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
