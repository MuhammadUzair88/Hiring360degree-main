import React from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

/**
 * Search + department/type filters for the job listing grid.
 * Fully controlled — AdvertisementOverview owns the state and passes
 * values/handlers down, so this component has no knowledge of how
 * filtering is actually applied.
 */
export default function AdvertisementFilterBar({
  searchValue = "",
  onSearchChange = () => {},
  departmentValue,
  onDepartmentChange = () => {},
  departments = [],
  typeValue,
  onTypeChange = () => {},
  types = [],
  onOpenMoreFilters,
}) {
  return (
    <div className="self-stretch p-4 bg-secondary-50 rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex-1 min-w-0 sm:min-w-60 relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search jobs..."
          className="w-full pl-10 pr-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={departmentValue}
            onChange={(event) => onDepartmentChange(event.target.value)}
            aria-label="Filter by department"
            className="appearance-none pl-4 pr-10 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={typeValue}
            onChange={(event) => onTypeChange(event.target.value)}
            aria-label="Filter by job type"
            className="appearance-none pl-4 pr-10 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={onOpenMoreFilters}
          aria-label="More filters"
          className="p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 hover:bg-secondary-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}