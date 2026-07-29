// import React from "react";
// import { Pencil, Trash2 } from "lucide-react";
// import { getInitials } from "./Utils";

// const ROUND_BADGE_CLASSES = {
//   Technical: "bg-primary-700/10 text-primary-700 outline-primary-700/20",
//   HR: "bg-gray-500/10 text-gray-500 outline-gray-500/20",
// };

// /** Single row. Column widths must match InterviewerTable's header row exactly. */
// export default function InterviewerTableRow({
//   interviewer,
//   isLast = false,
//   onEdit = () => {},
//   onDelete = () => {},
// }) {
//   const { id, name, role, email, round, status, avatarUrl } = interviewer;
//   const isActive = status === "Active";
//   const roundClasses = ROUND_BADGE_CLASSES[round] ?? ROUND_BADGE_CLASSES.HR;

//   return (
//     <div
//       role="row"
//       className={`self-stretch flex items-stretch ${isLast ? "" : "border-t border-secondary-300"}`}
//     >
//       <div role="cell" className="w-64 pl-8 pr-4 py-6 flex items-center gap-3 shrink-0">
//         {avatarUrl ? (
//           <img
//             src={avatarUrl}
//             alt={name}
//             className="w-10 h-10 rounded-full object-cover shrink-0"
//           />
//         ) : (
//           <span className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
//             <span className="text-neutral-600 text-xs font-bold">{getInitials(name)}</span>
//           </span>
//         )}
//         <div className="min-w-0 flex flex-col">
//           <span className="text-gray-900 text-base font-medium leading-6 truncate">{name}</span>
//           <span className="text-neutral-600 text-xs font-normal leading-4 truncate">{role}</span>
//         </div>
//       </div>

//       <div role="cell" className="w-52 px-6 py-6 flex items-center shrink-0">
//         <span className="text-neutral-600 text-sm font-normal leading-5 truncate">{email}</span>
//       </div>

//       <div role="cell" className="w-48 px-6 py-6 flex items-center shrink-0">
//         <span
//           className={`px-2.5 py-0.5 rounded-full outline outline-1 outline-offset-[-1px] text-xs font-semibold leading-4 ${roundClasses}`}
//         >
//           {round}
//         </span>
//       </div>

//       <div role="cell" className="w-32 px-6 py-6 flex items-center shrink-0">
//         <span
//           className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 ${
//             isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-300/10 text-neutral-600"
//           }`}
//         >
//           <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-zinc-500"}`} />
//           {status}
//         </span>
//       </div>

//       <div role="cell" className="w-36 px-8 py-6 flex items-center justify-end gap-1 shrink-0">
//         <button
//           type="button"
//           onClick={() => onEdit(id)}
//           aria-label={`Edit ${name}`}
//           className="p-2 rounded-lg text-neutral-600 hover:text-primary-800 hover:bg-secondary-200 transition-colors"
//         >
//           <Pencil className="w-3.5 h-3.5" />
//         </button>
//         <button
//           type="button"
//           onClick={() => onDelete(id)}
//           aria-label={`Remove ${name}`}
//           className="p-2 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <Trash2 className="w-3.5 h-3.5" />
//         </button>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const ROUND_BADGE_CLASSES = {
  Technical: "bg-primary-700/10 text-primary-700 outline-primary-700/20",
  HR: "bg-gray-500/10 text-gray-500 outline-gray-500/20",
};

/** Single row. Grid template must match InterviewerTable's header row exactly. */
export default function InterviewerTableRow({
  interviewer,
  isLast = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const { id, name, role, email, round, status } = interviewer;
  const isActive = status === "Active";
  const roundClasses = ROUND_BADGE_CLASSES[round] ?? ROUND_BADGE_CLASSES.HR;

  const RoundBadge = (
    <span className={`inline-block px-2.5 py-0.5 rounded-full outline outline-1 outline-offset-[-1px] text-xs font-semibold leading-4 ${roundClasses}`}>
      {round}
    </span>
  );

  const StatusBadge = (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 ${
      isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-300/10 text-neutral-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-zinc-500"}`} />
      {status}
    </span>
  );

  const Actions = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(id)}
        aria-label={`Edit ${name}`}
        className="p-2 rounded-lg text-neutral-600 hover:text-primary-800 hover:bg-secondary-200 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label={`Remove ${name}`}
        className="p-2 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div
      role="row"
      className={`px-4 md:px-8 py-4 md:py-6 ${isLast ? "" : "border-t border-secondary-300"}`}
    >
      {/* Below md: stacked card, no fixed columns */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-900 text-base font-medium leading-6 truncate">{name}</p>
            <p className="text-neutral-600 text-xs leading-4 truncate">{role}</p>
          </div>
          {Actions}
        </div>
        <p className="text-neutral-600 text-sm leading-5 truncate">{email}</p>
        <div className="flex items-center gap-2">
          {RoundBadge}
          {StatusBadge}
        </div>
      </div>

      {/* md+: aligned with the table header */}
      <div className="hidden md:grid md:grid-cols-[2fr_1.6fr_1.2fr_0.9fr_auto] md:items-center md:gap-4">
        <div role="cell" className="min-w-0">
          <p className="text-gray-900 text-base font-medium leading-6 truncate">{name}</p>
          <p className="text-neutral-600 text-xs leading-4 truncate">{role}</p>
        </div>
        <div role="cell" className="min-w-0">
          <span className="text-neutral-600 text-sm leading-5 truncate block">{email}</span>
        </div>
        <div role="cell">{RoundBadge}</div>
        <div role="cell">{StatusBadge}</div>
        <div role="cell" className="flex justify-end">{Actions}</div>
      </div>
    </div>
  );
}