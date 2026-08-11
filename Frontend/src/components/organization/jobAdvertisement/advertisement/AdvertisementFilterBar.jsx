
import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

function SelectField({ value, onChange, label, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-10 appearance-none rounded-lg border border-secondary-300 bg-secondary-100 pl-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

export default function AdvertisementFilterBar({
  searchValue = "",
  onSearchChange = () => {},
  departmentValue = "All Departments",
  onDepartmentChange = () => {},
  departments = [],
  typeValue = "All Types",
  onTypeChange = () => {},
  types = [],
  statusValue = "All Statuses",
  onStatusChange = () => {},
  sortValue = "newest",
  onSortChange = () => {},
  onClearFilters = () => {},
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (statusValue !== "All Statuses") count += 1;
    if (sortValue !== "newest") count += 1;
    return count;
  }, [statusValue, sortValue]);

  const hasAnyFilter =
    Boolean(searchValue.trim()) ||
    departmentValue !== "All Departments" ||
    typeValue !== "All Types" ||
    activeAdvancedCount > 0;

  return (
    <div className="rounded-xl border border-secondary-300 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search jobs..."
            className="h-10 w-full rounded-lg border border-secondary-300 bg-secondary-100 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            value={departmentValue}
            onChange={onDepartmentChange}
            label="Filter by department"
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={typeValue}
            onChange={onTypeChange}
            label="Filter by job type"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>

          <button
            type="button"
            onClick={() => setAdvancedOpen((value) => !value)}
            aria-label={advancedOpen ? "Close advanced filters" : "Open advanced filters"}
            aria-expanded={advancedOpen}
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg border outline-none transition focus-visible:ring-2 focus-visible:ring-primary-200 ${
              advancedOpen || activeAdvancedCount > 0
                ? "border-primary-300 bg-primary-50 text-primary-800"
                : "border-secondary-300 bg-white text-slate-700 hover:bg-secondary-100"
            }`}
          >
            {advancedOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <SlidersHorizontal className="h-4 w-4" />
            )}

            {activeAdvancedCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-800 px-1 text-[10px] font-semibold text-white">
                {activeAdvancedCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {advancedOpen ? (
        <div className="flex flex-col gap-3 border-t border-secondary-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Status</span>
              <SelectField
                value={statusValue}
                onChange={onStatusChange}
                label="Filter by advertisement status"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Live">Live</option>
                <option value="Closed">Closed</option>
              </SelectField>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Sort</span>
              <SelectField
                value={sortValue}
                onChange={onSortChange}
                label="Sort advertisements"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="applicants-desc">Most applicants</option>
                <option value="title-asc">Job title A–Z</option>
              </SelectField>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasAnyFilter}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold text-gray-600 transition hover:bg-secondary-100 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
