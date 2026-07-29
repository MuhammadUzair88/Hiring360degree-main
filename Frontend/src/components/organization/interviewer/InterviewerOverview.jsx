import React, { useEffect, useMemo, useState } from "react";
import InterviewerStatsOverview from "./InterviewerStatsOverview";
import InterviewerSearchFilterBar from "./InterviewerSearchFilterBar";
import InterviewerTable from "./InterviewerTable";
import InterviewerFormModal from "./InterviewerFormModal";
import { DEFAULT_PAGE_SIZE } from "./interviewerdata";
import { getInterviewers, subscribe, removeInterviewer } from "./InterviewerStore";
import PageHeader from "./PageHeader";
import { pageContent  } from "./interviewerdata";

export default function InterviewerOverview() {
  const [interviewers, setInterviewers] = useState(getInterviewers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  // null = closed, "add" = create mode, an interviewer id = edit mode
  const [formTarget, setFormTarget] = useState(null);

  useEffect(() => subscribe(setInterviewers), []);

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

  const handleDelete = (id) => {
    const target = interviewers.find((i) => i.id === id);
    const confirmed = window.confirm(
      `Remove ${target?.name ?? "this interviewer"} from the panel? This cannot be undone.`
    );
    if (!confirmed) return;
    removeInterviewer(id);
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

      <InterviewerTable
        interviewers={pagedInterviewers}
        totalCount={filteredInterviewers.length}
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
        onEdit={(id) => setFormTarget(id)}
        onDelete={handleDelete}
        onPageChange={setPage}
      />

      <InterviewerFormModal
        isOpen={formTarget !== null}
        interviewerId={formTarget === "add" ? null : formTarget}
        onClose={() => setFormTarget(null)}
      />
    </div>
  );
}