// import React from "react";
// import { ChevronLeft, ChevronRight, Users } from "lucide-react";
// import InterviewerTableRow from "./InterviewerTableRow";

// /**
//  * Data table for the Interviewer list page. Columns are fixed-width
//  * (matching the design), so on narrow screens the table scrolls
//  * horizontally as a whole rather than reflowing — the header and
//  * rows always stay aligned.
//  */
// export default function InterviewerTable({
//   interviewers = [],
//   totalCount = 0,
//   page = 1,
//   pageSize = 3,
//   onEdit = () => {},
//   onDelete = () => {},
//   onPageChange = () => {},
// }) {
//   const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
//   const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
//   const rangeEnd = Math.min(page * pageSize, totalCount);

//   return (
//     <div className="self-stretch bg-slate-50 rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden">
//       <div className="w-full overflow-x-auto">
//         <div role="table" aria-label="Interviewers" className="min-w-[900px] flex flex-col">
//           {/* Header */}
//           <div role="row" className="self-stretch bg-primary-50/50 border-b border-secondary-300 flex items-stretch">
//             <div role="columnheader" className="w-64 pl-8 pr-4 py-4 flex items-center shrink-0">
//               <span className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
//                 Interviewer
//               </span>
//             </div>
//             <div role="columnheader" className="w-52 px-6 py-4 flex items-center shrink-0">
//               <span className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
//                 Corporate Email
//               </span>
//             </div>
//             <div role="columnheader" className="w-48 px-6 py-4 flex items-center shrink-0">
//               <span className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
//                 Evaluation Round
//               </span>
//             </div>
//             <div role="columnheader" className="w-32 px-6 py-4 flex items-center shrink-0">
//               <span className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
//                 Status
//               </span>
//             </div>
//             <div role="columnheader" className="w-36 px-8 py-4 flex items-center justify-end shrink-0">
//               <span className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
//                 Actions
//               </span>
//             </div>
//           </div>

//           {/* Rows */}
//           {interviewers.length > 0 ? (
//             interviewers.map((interviewer, index) => (
//               <InterviewerTableRow
//                 key={interviewer.id}
//                 interviewer={interviewer}
//                 isLast={index === interviewers.length - 1}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//               />
//             ))
//           ) : (
//             <div className="self-stretch px-8 py-16 flex flex-col items-center justify-center gap-2 border-t border-secondary-300">
//               <Users className="w-6 h-6 text-neutral-400" />
//               <p className="text-gray-900 text-sm font-medium">No interviewers found</p>
//               <p className="text-neutral-600 text-xs">Try a different search term or filter.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer / pagination */}
//       <div className="self-stretch px-4 sm:px-8 py-4 bg-primary-50/30 border-t border-secondary-300 flex flex-col sm:flex-row gap-3 justify-between items-center">
//         <span className="text-neutral-600 text-sm font-normal leading-5">
//           {totalCount === 0
//             ? "No interviewers to show"
//             : `Showing ${rangeStart} to ${rangeEnd} of ${totalCount} interviewers`}
//         </span>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => onPageChange(page - 1)}
//             disabled={page <= 1}
//             aria-label="Previous page"
//             className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-secondary-200 transition-colors"
//           >
//             <ChevronLeft className="w-3.5 h-3.5" />
//           </button>
//           <button
//             type="button"
//             onClick={() => onPageChange(page + 1)}
//             disabled={page >= totalPages}
//             aria-label="Next page"
//             className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-secondary-200 transition-colors"
//           >
//             <ChevronRight className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import InterviewerTableRow from "./InterviewerTableRow";

/*
  Grid template lives here AND in InterviewerTableRow.jsx as an identical
  literal string ("md:grid-cols-[2fr_1.6fr_1.2fr_0.9fr_auto]") — Tailwind
  needs the full class as a literal in each file to generate it, so it
  can't be shared as a JS constant. If you change the columns, change it
  in both files.
*/
export default function InterviewerTable({
  interviewers = [],
  totalCount = 0,
  page = 1,
  pageSize = 3,
  onEdit = () => {},
  onDelete = () => {},
  onPageChange = () => {},
}) {
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return (
    <div className="self-stretch bg-slate-50 rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden">
      <div role="table" aria-label="Interviewers" className="flex flex-col">
        {/* Header — desktop/tablet only. Below md, each row is a labeled card instead. */}
        <div
          role="row"
          className="hidden md:grid md:grid-cols-[2fr_1.6fr_1.2fr_0.9fr_auto] md:items-center md:gap-4 bg-primary-50/50 border-b border-secondary-300 px-8 py-4"
        >
          <span role="columnheader" className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
            Interviewer
          </span>
          <span role="columnheader" className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
            Corporate Email
          </span>
          <span role="columnheader" className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
            Evaluation Round
          </span>
          <span role="columnheader" className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider">
            Status
          </span>
          <span role="columnheader" className="text-neutral-600 text-xs font-semibold uppercase leading-4 tracking-wider text-right">
            Actions
          </span>
        </div>

        {interviewers.length > 0 ? (
          interviewers.map((interviewer, index) => (
            <InterviewerTableRow
              key={interviewer.id}
              interviewer={interviewer}
              isLast={index === interviewers.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="px-8 py-16 flex flex-col items-center justify-center gap-2 border-t border-secondary-300 md:border-t-0">
            <Users className="w-6 h-6 text-neutral-400" />
            <p className="text-gray-900 text-sm font-medium">No interviewers found</p>
            <p className="text-neutral-600 text-xs">Try a different search term or filter.</p>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-8 py-4 bg-primary-50/30 border-t border-secondary-300 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <span className="text-neutral-600 text-sm font-normal leading-5">
          {totalCount === 0
            ? "No interviewers to show"
            : `Showing ${rangeStart} to ${rangeEnd} of ${totalCount} interviewers`}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-secondary-200 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-secondary-200 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}