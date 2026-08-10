import React from "react";
import {
  Bell,
  Pencil,
  Loader2,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import { formatShortDate } from "./offerDateUtils";

export default function NotifyCandidatesCard({
  candidates = [],
  activeTab,
  onTabChange,
  notifyingId,
  onEditCandidate,
  onNotify,
  onPreviewCandidate,
  selectedId,
  onSelect,
}) {
  const pendingCandidates = candidates.filter((candidate) => !candidate.notified);
  const notifiedCandidates = candidates.filter((candidate) => candidate.notified);
  const filtered =
    activeTab === "notified" ? notifiedCandidates : pendingCandidates;

  return (
    <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wide">
            Notify Candidates
          </h3>
          <span className="text-xs font-semibold text-slate-900">
            {candidates.length} Total
          </span>
        </div>

        {candidates.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-warning-700 bg-warning-50 px-2 py-0.5 rounded-full">
                <Clock className="w-2.5 h-2.5" /> {pendingCandidates.length} Pending
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" /> {notifiedCandidates.length} Notified
              </span>
            </div>

            <div className="grid grid-cols-2 mt-3 p-1 bg-secondary-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => onTabChange("pending")}
                className={`py-2 rounded-lg transition-colors ${
                  activeTab === "pending"
                    ? "bg-secondary-50 shadow-sm text-primary-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending ({pendingCandidates.length})
              </button>
              <button
                type="button"
                onClick={() => onTabChange("notified")}
                className={`py-2 rounded-lg transition-colors ${
                  activeTab === "notified"
                    ? "bg-secondary-50 shadow-sm text-primary-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Notified ({notifiedCandidates.length})
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 italic border border-dashed border-secondary-300 rounded-xl flex items-center justify-center min-h-[8rem]">
            {candidates.length === 0
              ? "No offers generated yet — create one from the left."
              : activeTab === "pending"
              ? "All candidates have been notified."
              : "No candidates have been notified yet."}
          </div>
        ) : (
          filtered.map((candidate) => {
            const isNotifyingThis =
              String(notifyingId) === String(candidate.applicationId);
            const isSelected =
              String(selectedId) === String(candidate.applicationId);

            return (
              <div
                key={candidate.applicationId}
                onClick={() => onSelect(candidate.applicationId)}
                role="button"
                tabIndex={0}
                className={`p-4 rounded-xl outline outline-1 outline-offset-[-1px] flex flex-col gap-2.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary-800/5 outline-primary-800"
                    : "bg-secondary-100 outline-secondary-300"
                }`}
              >
                <div className="flex items-center justify-between text-xs border-b border-secondary-300 pb-2">
                  <span className="text-gray-500 font-semibold truncate">
                    {candidate.joiningDate
                      ? `Joins ${formatShortDate(candidate.joiningDate)}`
                      : "Date pending"}
                  </span>
                  <span
                    className={`shrink-0 font-semibold text-[10px] px-2 py-1 rounded-md ${
                      candidate.notified
                        ? "text-success-700 bg-success-50"
                        : "text-warning-700 bg-warning-50"
                    }`}
                  >
                    {candidate.notified ? "Sent" : "Pending"}
                  </span>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-slate-900 truncate">
                    {candidate.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" /> {candidate.email}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onPreviewCandidate(candidate.applicationId);
                    }}
                    className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-gray-700 hover:text-primary-800 transition-colors"
                    title="Preview letter"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditCandidate(candidate.applicationId);
                    }}
                    disabled={isNotifyingThis}
                    className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-gray-700 hover:text-primary-800 disabled:opacity-50"
                    title="Edit offer letter"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onNotify(candidate.applicationId);
                    }}
                    disabled={isNotifyingThis}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                      isNotifyingThis
                        ? "bg-secondary-300 text-gray-500 cursor-not-allowed"
                        : candidate.notified
                        ? "bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-700 hover:text-primary-800"
                        : "bg-primary-800 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isNotifyingThis ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        {candidate.notified ? "Resend" : "Notify"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
