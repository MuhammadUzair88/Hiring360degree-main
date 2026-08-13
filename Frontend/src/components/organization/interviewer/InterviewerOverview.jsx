// import React, { useEffect, useMemo, useState } from "react";
// import InterviewerStatsOverview from "./InterviewerStatsOverview";
// import InterviewerSearchFilterBar from "./InterviewerSearchFilterBar";
// import InterviewerTable from "./InterviewerTable";
// import InterviewerFormModal from "./InterviewerFormModal";
// import { DEFAULT_PAGE_SIZE } from "./interviewerdata";
// import { getInterviewers, subscribe, removeInterviewer, loadInterviewers } from "./InterviewerStore";
// import PageHeader from "./PageHeader";
// import { pageContent } from "./interviewerdata";
// import { useToast } from "../../../context/ToastContext";
// import { useAuth } from "../../../context/AuthContext";

// export default function InterviewerOverview() {
//   const toast = useToast();
//   const [interviewers, setInterviewers] = useState(getInterviewers);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [page, setPage] = useState(1);
//   const {organization} = useAuth()

//   // null = closed, "add" = create mode, an interviewer id = edit mode
//   const [formTarget, setFormTarget] = useState(null);

//   useEffect(() => subscribe(setInterviewers), []);

//   useEffect(() => {
//     let isActive = true;
//     setIsLoading(true);
//     loadInterviewers()
//       .catch((error) => {
//         if (isActive) setLoadError("Failed to load your interviewer panel.");
//       })
//       .finally(() => {
//         if (isActive) setIsLoading(false);
//       });
//     return () => {
//       isActive = false;
//     };
//   }, []);

//   const filteredInterviewers = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();
//     return interviewers.filter((interviewer) => {
//       const matchesSearch =
//         !query ||
//         interviewer.name.toLowerCase().includes(query) ||
//         interviewer.email.toLowerCase().includes(query);
//       const matchesFilter = activeFilter === "All" || interviewer.round === activeFilter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [interviewers, searchTerm, activeFilter]);

//   const totalPages = Math.max(Math.ceil(filteredInterviewers.length / DEFAULT_PAGE_SIZE), 1);

//   useEffect(() => { setPage(1); }, [searchTerm, activeFilter]);
//   useEffect(() => { setPage((prev) => Math.min(prev, totalPages)); }, [totalPages]);

//   const pagedInterviewers = filteredInterviewers.slice(
//     (page - 1) * DEFAULT_PAGE_SIZE,
//     page * DEFAULT_PAGE_SIZE
//   );

//   const handleDelete = async (id) => {
//     const target = interviewers.find((i) => i.id === id);
//     const confirmed = window.confirm(
//       `Remove ${target?.name ?? "this interviewer"} from the panel? This cannot be undone.`
//     );
//     if (!confirmed) return;
//     const result = await removeInterviewer(id);
//     if (result.success) {
//       toast.success(`${target?.name ?? "Interviewer"} removed.`);
//     } else {
//       toast.error(result.message);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-6">
//       <PageHeader
//         pageLabel={pageContent.interviewer.label}
//         subtitle={pageContent.interviewer.subtitle}
//         organization={organization}
//       />
//       <InterviewerStatsOverview interviewers={interviewers} />

//       <InterviewerSearchFilterBar
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         activeFilter={activeFilter}
//         onFilterChange={setActiveFilter}
//         onAddInterviewer={() => setFormTarget("add")}
//       />

//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-3">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <div key={index} className="h-16 animate-pulse rounded-xl bg-secondary-200" />
//           ))}
//         </div>
//       ) : loadError ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
//           {loadError}
//         </div>
//       ) : (
//         <InterviewerTable
//           interviewers={pagedInterviewers}
//           totalCount={filteredInterviewers.length}
//           page={page}
//           pageSize={DEFAULT_PAGE_SIZE}
//           onEdit={(id) => setFormTarget(id)}
//           onDelete={handleDelete}
//           onPageChange={setPage}
//         />
//       )}

//       <InterviewerFormModal
//         isOpen={formTarget !== null}
//         interviewerId={formTarget === "add" ? null : formTarget}
//         onClose={() => setFormTarget(null)}
//       />
//     </div>
//   );
// }




import React, { useCallback, useEffect, useMemo, useState } from "react";
import InterviewerStatsOverview from "./InterviewerStatsOverview";
import InterviewerSearchFilterBar from "./InterviewerSearchFilterBar";
import InterviewerTable from "./InterviewerTable";
import InterviewerFormModal from "./InterviewerFormModal";
import { DEFAULT_PAGE_SIZE, pageContent } from "./interviewerdata";
import {
  getInterviewers,
  loadInterviewers,
  removeInterviewer,
  subscribe,
} from "./InterviewerStore";
import PageHeader from "./PageHeader";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const REFRESH_INTERVAL_MS = 15_000;

export default function InterviewerOverview() {
  const toast = useToast();
  const { organization } = useAuth();

  const [interviewers, setInterviewers] = useState(getInterviewers);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [formTarget, setFormTarget] = useState(null);

  useEffect(() => subscribe(setInterviewers), []);

  const refreshInterviewers = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setIsLoading(true);
      await loadInterviewers({ force: true });
      setLoadError(null);
    } catch (error) {
      console.error("Interviewer roster refresh failed:", error);
      if (!silent) setLoadError("Failed to load your interviewer panel.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInterviewers();
  }, [refreshInterviewers]);

  useEffect(() => {
    const refresh = () => refreshInterviewers({ silent: true });
    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    const handleFocus = () => refresh();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshInterviewers]);

  const filteredInterviewers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return interviewers.filter((interviewer) => {
      if (!query) return true;

      return (
        interviewer.name.toLowerCase().includes(query) ||
        interviewer.email.toLowerCase().includes(query) ||
        String(interviewer.round || "").toLowerCase().includes(query)
      );
    });
  }, [interviewers, searchTerm]);

  const totalPages = Math.max(
    Math.ceil(filteredInterviewers.length / DEFAULT_PAGE_SIZE),
    1
  );

  useEffect(() => setPage(1), [searchTerm]);
  useEffect(() => setPage((previous) => Math.min(previous, totalPages)), [totalPages]);

  const pagedInterviewers = filteredInterviewers.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  );

  const handleDelete = async (id) => {
    const target = interviewers.find((interviewer) => String(interviewer.id) === String(id));
    const confirmed = window.confirm(
      `Remove ${target?.name ?? "this interviewer"} from the panel? This cannot be undone.`
    );

    if (!confirmed) return;

    const result = await removeInterviewer(id);

    if (result.success) {
      toast.success(`${target?.name ?? "Interviewer"} removed.`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        pageLabel={pageContent.interviewer.label}
        subtitle={pageContent.interviewer.subtitle}
        organization={organization}
      />

      <InterviewerStatsOverview interviewers={interviewers} />

      <InterviewerSearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddInterviewer={() => setFormTarget("add")}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => refreshInterviewers()}
            className="mt-3 rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <InterviewerTable
          interviewers={pagedInterviewers}
          totalCount={filteredInterviewers.length}
          page={page}
          pageSize={DEFAULT_PAGE_SIZE}
          onEdit={(id) => setFormTarget(id)}
          onDelete={handleDelete}
          onPageChange={setPage}
        />
      )}

      <InterviewerFormModal
        isOpen={formTarget !== null}
        interviewerId={formTarget === "add" ? null : formTarget}
        onClose={() => setFormTarget(null)}
      />
    </div>
  );
}
