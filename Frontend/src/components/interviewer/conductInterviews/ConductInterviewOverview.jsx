
import React, { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import InterviewerHeader from "../dashboard/InterviewerHeader";
import InterviewStatusMetrics from "./InterviewStatusMetrics";
import InterviewFilterBar from "./InterviewFilterBar";
import InterviewGrid from "./InterviewGrid";
import InterviewStatusDrawer from "./InterviewStatusDrawer";
import { getInterviewCounts } from "./constants";

/**
 * Everything on the Conduct Interviews page, wired together:
 * InterviewerHeader (shared identity banner) + the 4 status metrics +
 * the search/filter bar + the card grid + the status drawer.
 *
 * This component owns UI state only (search text, active status
 * filter, which drawer is open). Data itself — organization,
 * interviewer, interviews, loading, error — comes in as props from
 * the page, which is the one place that will eventually own the API
 * call.
 */
export default function ConductInterviewOverview({
  organization,
  interviewer,
  interviews,
  loading = false,
  error = null,
  initialStatusFilter = null,
  onRefresh,
  onJoinInterview,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDrawerStatus, setOpenDrawerStatus] = useState(initialStatusFilter);

  const counts = useMemo(() => getInterviewCounts(interviews), [interviews]);

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return interviews.filter((item) => {
      const matchesSearch =
        !query ||
        item.candidateName?.toLowerCase().includes(query) ||
        item.jobTitle?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || item.statusBadge === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);

  const drawerInterviews = useMemo(
    () => interviews.filter((item) => item.statusBadge === openDrawerStatus),
    [interviews, openDrawerStatus]
  );

  return (
    <div className="flex flex-col gap-6">
      <InterviewerHeader
        organization={organization}
        interviewer={interviewer}
        actions={
          onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh roster"
              className="p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 hover:bg-secondary-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )
        }
      />

      <InterviewStatusMetrics counts={counts} onSelectStatus={setOpenDrawerStatus} />

      {error ? (
        <div className="p-6 bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 rounded-2xl text-center">
          <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
            Couldn't load your interview roster
          </p>
          <p className="text-black/50 text-xs mt-1">{error}</p>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="mt-4 px-5 py-2 bg-primary-700 text-secondary-50 rounded-lg text-xs font-semibold hover:bg-primary-800 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      ) : (
        <>
          <InterviewFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <InterviewGrid
            interviews={filteredInterviews}
            loading={loading}
            hasActiveFilters={Boolean(search) || statusFilter !== "All"}
            onJoinInterview={onJoinInterview}
          />
        </>
      )}

      {openDrawerStatus && (
        <InterviewStatusDrawer
          type={openDrawerStatus}
          interviews={drawerInterviews}
          onClose={() => setOpenDrawerStatus(null)}
          onJoinInterview={onJoinInterview}
        />
      )}
    </div>
  );
}