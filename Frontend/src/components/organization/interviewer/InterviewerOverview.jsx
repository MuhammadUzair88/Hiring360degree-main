import React, { useEffect, useMemo, useState } from "react";
import InterviewerStatsOverview from "./InterviewerStatsOverview";
import InterviewerSearchFilterBar from "./InterviewerSearchFilterBar";
import InterviewerTable from "./InterviewerTable";
import InterviewerFormModal from "./InterviewerFormModal";
import { DEFAULT_PAGE_SIZE } from "./interviewerdata";
import { getInterviewers, subscribe, removeInterviewer, loadInterviewers } from "./InterviewerStore";
import PageHeader from "./PageHeader";
import { pageContent } from "./interviewerdata";
import { useToast } from "../../../context/ToastContext";

export default function InterviewerOverview() {
  const toast = useToast();
  const [interviewers, setInterviewers] = useState(getInterviewers);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  // null = closed, "add" = create mode, an interviewer id = edit mode
  const [formTarget, setFormTarget] = useState(null);

  useEffect(() => subscribe(setInterviewers), []);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    loadInterviewers()
      .catch((error) => {
        if (isActive) setLoadError("Failed to load your interviewer panel.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const filteredInterviewers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return interviewers.filter((interviewer) => {
      const matchesSearch =
        !query ||
        interviewer.name.toLowerCase().includes(query) ||
        interviewer.email.toLowerCase().includes(query);
      const matchesFilter = activeFilter === "All" || interviewer.round === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [interviewers, searchTerm, activeFilter]);

  const totalPages = Math.max(Math.ceil(filteredInterviewers.length / DEFAULT_PAGE_SIZE), 1);

  useEffect(() => { setPage(1); }, [searchTerm, activeFilter]);
  useEffect(() => { setPage((prev) => Math.min(prev, totalPages)); }, [totalPages]);

  const pagedInterviewers = filteredInterviewers.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  );

  const handleDelete = async (id) => {
    const target = interviewers.find((i) => i.id === id);
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
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        pageLabel={pageContent.interviewer.label}
        subtitle={pageContent.interviewer.subtitle}
      />
      <InterviewerStatsOverview interviewers={interviewers} />

      <InterviewerSearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddInterviewer={() => setFormTarget("add")}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {loadError}
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
