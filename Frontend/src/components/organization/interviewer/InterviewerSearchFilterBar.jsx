// import React from "react";
// import { Search } from "lucide-react";
// import { interviewerFilterTabs } from "./interviewerdata";

// /** Search box + round filter segmented control. Fully controlled. */
// export default function InterviewerSearchFilterBar({
//   searchTerm = "",
//   onSearchChange = () => {},
//   activeFilter = "All",
//   onFilterChange = () => {},
//   filters = interviewerFilterTabs,
// }) {
//   return (
//     <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//       <div className="relative flex-1 sm:max-w-96">
//         <Search
//           className="w-4 h-4 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
//           aria-hidden="true"
//         />
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//           placeholder="Search by name or corporate email..."
//           aria-label="Search interviewers"
//           className="w-full h-12 pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-400 text-gray-900 text-sm placeholder:text-gray-500 focus:outline-2 focus:outline-primary-600 transition-colors"
//         />
//       </div>

//       <div
//         role="tablist"
//         aria-label="Filter by evaluation round"
//         className="p-1 bg-primary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-400 inline-flex items-center gap-1 self-start sm:self-auto"
//       >
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             type="button"
//             role="tab"
//             aria-selected={activeFilter === filter}
//             onClick={() => onFilterChange(filter)}
//             className={`px-5 py-2 rounded-lg text-sm font-medium leading-5 transition-colors ${
//               activeFilter === filter
//                 ? "bg-white text-primary-700 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)]"
//                 : "text-neutral-600 hover:text-gray-900"
//             }`}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Search, UserPlus } from "lucide-react";
import { interviewerFilterTabs } from "./interviewerdata";

/** Search box + round filter segmented control + Add Interviewer action. Fully controlled. */
export default function InterviewerSearchFilterBar({
  searchTerm = "",
  onSearchChange = () => {},
  activeFilter = "All",
  onFilterChange = () => {},
  onAddInterviewer = () => {},
  filters = interviewerFilterTabs,
}) {
  return (
    <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="relative flex-1 sm:max-w-96">
        <Search
          className="w-4 h-4 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or corporate email..."
          aria-label="Search interviewers"
          className="w-full h-12 pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-400 text-gray-900 text-sm placeholder:text-gray-500 focus:outline-2 focus:outline-primary-600 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          aria-label="Filter by evaluation round"
          className="p-1 bg-primary-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-400 inline-flex items-center gap-1"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => onFilterChange(filter)}
              className={`px-5 py-2 rounded-lg text-sm font-medium leading-5 transition-colors ${
                activeFilter === filter
                  ? "bg-white text-primary-700 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  : "text-neutral-600 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddInterviewer}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-700 rounded-xl text-white text-sm font-semibold leading-5 shadow-[0px_10px_15px_-3px_rgba(124,58,237,0.20)] hover:bg-primary-800 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Interviewer
        </button>
      </div>
    </div>
  );
}