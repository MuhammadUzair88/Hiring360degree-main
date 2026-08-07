// import React, { useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   ShieldCheck,
//   ChevronDown,
//   BadgeCheck,
//   ClipboardCheck,
//   Lock,
// } from "lucide-react";
// import {
//   evaluationRoundOptions,
//   emptyInterviewerFormValues,
//   interviewerFormTrustBadges,
// } from "./interviewerdata";
// import { findInterviewer, addInterviewer, updateInterviewer } from "./InterviewerStore";

// const TRUST_BADGE_ICONS = {
//   verified: BadgeCheck,
//   tracking: ClipboardCheck,
//   security: Lock,
// };

// /**
//  * One form, two modes. `/interviewer/add` renders it with no :id, so it
//  * starts blank and creates a new record on submit. `/interviewer/edit/:id`
//  * renders the exact same component, prefilled from the store, and patches
//  * that record on submit instead. Nothing else about the page changes.
//  */
// export default function InterviewerForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const existingInterviewer = useMemo(
//     () => (isEditMode ? findInterviewer(id) : null),
//     [id, isEditMode]
//   );

//   const [values, setValues] = useState(() =>
//     existingInterviewer
//       ? {
//           name: existingInterviewer.name,
//           email: existingInterviewer.email,
//           round: existingInterviewer.round,
//         }
//       : emptyInterviewerFormValues
//   );

//   const handleChange = (field) => (e) => {
//     setValues((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const handleBack = () => navigate("/interviewer");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // TODO: replace with a real create/update interviewer API call.
//     if (isEditMode) {
//       updateInterviewer(existingInterviewer.id, values);
//     } else {
//       addInterviewer(values);
//     }

//     navigate("/interviewer");
//   };

//   // Someone followed a stale/bad edit link — bail out gracefully instead
//   // of rendering a form bound to nothing.
//   if (isEditMode && !existingInterviewer) {
//     return (
//       <div className="w-full max-w-xl mx-auto py-16 flex flex-col items-center gap-4 text-center">
//         <p className="text-gray-900 text-lg font-semibold">Interviewer not found</p>
//         <p className="text-neutral-600 text-sm">This interviewer may have already been removed.</p>
//         <button
//           type="button"
//           onClick={handleBack}
//           className="px-6 py-2.5 bg-primary-700 rounded-lg text-white text-sm font-bold hover:bg-primary-800 transition-colors"
//         >
//           Back to Interviewers
//         </button>
//       </div>
//     );
//   }

//   const pageTitle = isEditMode ? "Edit Interviewer" : "Add Interviewer";
//   const pageSubtitle = isEditMode
//     ? `Update ${existingInterviewer.name}'s details and evaluation round assignment.`
//     : "Create a new interviewer account and assign an evaluation round.";
//   const submitLabel = isEditMode ? "Save Changes" : "Create Interviewer";

//   return (
//     <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-8 sm:gap-10">
//       <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold leading-tight">{pageTitle}</h1>
//           <p className="text-neutral-600 text-sm sm:text-base leading-6 opacity-80">
//             {pageSubtitle}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleBack}
//           className="px-5 py-2.5 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 inline-flex items-center gap-2 text-gray-900 text-base font-medium hover:bg-secondary-100 transition-colors shrink-0"
//         >
//           <ArrowLeft className="w-3.5 h-3.5" />
//           Back to Interviewers
//         </button>
//       </div>

//       <div className="self-stretch flex justify-center">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-[700px] bg-white/90 rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col overflow-hidden"
//         >
//           <div className="self-stretch h-1.5 bg-primary-700" />

//           <div className="self-stretch p-6 sm:p-8 flex flex-col gap-6">
//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="interviewer-name"
//                 className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
//               >
//                 Full Name
//               </label>
//               <input
//                 id="interviewer-name"
//                 type="text"
//                 required
//                 value={values.name}
//                 onChange={handleChange("name")}
//                 placeholder="e.g. Jonathan Henderson"
//                 className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
//               />
//             </div>

//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="interviewer-email"
//                 className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
//               >
//                 Corporate Email
//               </label>
//               <input
//                 id="interviewer-email"
//                 type="email"
//                 required
//                 value={values.email}
//                 onChange={handleChange("email")}
//                 placeholder="j.henderson@hiring360.ai"
//                 className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
//               />
//               <p className="px-1 text-neutral-600/70 text-sm leading-5">
//                 Interview invitations will be sent to this address.
//               </p>
//             </div>

//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="interviewer-round"
//                 className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
//               >
//                 Evaluation Round
//               </label>
//               <div className="relative">
//                 <select
//                   id="interviewer-round"
//                   required
//                   value={values.round}
//                   onChange={handleChange("round")}
//                   className="w-full h-12 pl-4 pr-10 py-2 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base appearance-none focus:outline-2 focus:outline-primary-600 transition-colors"
//                 >
//                   <option value="" disabled>
//                     Select assigned round...
//                   </option>
//                   {evaluationRoundOptions.map((round) => (
//                     <option key={round} value={round}>
//                       {round}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="w-4 h-4 text-neutral-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
//               </div>
//             </div>

//             <div className="self-stretch p-4 bg-primary-50/50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex items-start gap-4">
//               <ShieldCheck className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
//               <div className="flex flex-col gap-1">
//                 <span className="text-gray-900 text-sm font-semibold leading-5">
//                   Round-specific access
//                 </span>
//                 <p className="text-neutral-600 text-xs leading-5">
//                   The interviewer will only be able to see candidate scorecards and profiles for
//                   their assigned rounds. This ensures data privacy across the evaluation funnel.
//                 </p>
//               </div>
//             </div>

//             <div className="self-stretch pt-6 border-t border-secondary-300 flex justify-end items-center gap-4">
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="px-6 py-3 text-neutral-600 text-base font-medium hover:text-gray-900 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-8 py-3 bg-primary-600 rounded-xl text-violet-100 text-base font-semibold shadow-[0px_10px_15px_-3px_rgba(124,58,237,0.20)] hover:bg-primary-700 transition-colors"
//               >
//                 {submitLabel}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       <div className="self-stretch pt-2 sm:pt-6 opacity-40 flex flex-wrap justify-center gap-6 sm:gap-4">
//         {interviewerFormTrustBadges.map(({ id: badgeId, label }) => {
//           const Icon = TRUST_BADGE_ICONS[badgeId];
//           return (
//             <div key={badgeId} className="w-28 sm:w-80 p-4 flex flex-col items-center gap-2">
//               {Icon && <Icon className="w-5 h-5 text-primary-600" />}
//               <span className="text-center text-gray-900 text-xs font-medium leading-4">
//                 {label}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  BadgeCheck,
  ClipboardCheck,
  Lock,
} from "lucide-react";
import {
  emptyInterviewerFormValues,
  interviewerFormTrustBadges,
} from "./interviewerdata";
import { findInterviewer, addInterviewer, updateInterviewer } from "./InterviewerStore";

const TRUST_BADGE_ICONS = {
  verified: BadgeCheck,
  tracking: ClipboardCheck,
  security: Lock,
};

/**
 * One form, two modes. `/interviewer/add` renders it with no :id, so it
 * starts blank and creates a new record on submit. `/interviewer/edit/:id`
 * renders the exact same component, prefilled from the store, and patches
 * that record on submit instead. Nothing else about the page changes.
 */
export default function InterviewerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const existingInterviewer = useMemo(
    () => (isEditMode ? findInterviewer(id) : null),
    [id, isEditMode]
  );

  const [values, setValues] = useState(() =>
    existingInterviewer
      ? {
          name: existingInterviewer.name,
          email: existingInterviewer.email,
          round: existingInterviewer.round,
        }
      : emptyInterviewerFormValues
  );

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBack = () => navigate("/interviewer");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: replace with a real create/update interviewer API call.
    if (isEditMode) {
      updateInterviewer(existingInterviewer.id, values);
    } else {
      addInterviewer(values);
    }

    navigate("/interviewer");
  };

  // Someone followed a stale/bad edit link — bail out gracefully instead
  // of rendering a form bound to nothing.
  if (isEditMode && !existingInterviewer) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 flex flex-col items-center gap-4 text-center">
        <p className="text-gray-900 text-lg font-semibold">Interviewer not found</p>
        <p className="text-neutral-600 text-sm">This interviewer may have already been removed.</p>
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2.5 bg-primary-700 rounded-lg text-white text-sm font-bold hover:bg-primary-800 transition-colors"
        >
          Back to Interviewers
        </button>
      </div>
    );
  }

  const pageTitle = isEditMode ? "Edit Interviewer" : "Add Interviewer";
  const pageSubtitle = isEditMode
    ? `Update ${existingInterviewer.name}'s details and evaluation round assignment.`
    : "Create a new interviewer account and assign an evaluation round.";
  const submitLabel = isEditMode ? "Save Changes" : "Create Interviewer";

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-8 sm:gap-10">
      <div className="self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold leading-tight">{pageTitle}</h1>
          <p className="text-neutral-600 text-sm sm:text-base leading-6 opacity-80">
            {pageSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 inline-flex items-center gap-2 text-gray-900 text-base font-medium hover:bg-secondary-100 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Interviewers
        </button>
      </div>

      <div className="self-stretch flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[700px] bg-white/90 rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col overflow-hidden"
        >
          <div className="self-stretch h-1.5 bg-primary-700" />

          <div className="self-stretch p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="interviewer-name"
                className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
              >
                Full Name
              </label>
              <input
                id="interviewer-name"
                type="text"
                required
                value={values.name}
                onChange={handleChange("name")}
                placeholder="e.g. Jonathan Henderson"
                className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="interviewer-email"
                className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
              >
                Corporate Email
              </label>
              <input
                id="interviewer-email"
                type="email"
                required
                value={values.email}
                onChange={handleChange("email")}
                placeholder="j.henderson@hiring360.ai"
                className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
              />
              <p className="px-1 text-neutral-600/70 text-sm leading-5">
                Interview invitations will be sent to this address.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="interviewer-round"
                className="text-neutral-600 text-xs font-medium leading-4 tracking-tight"
              >
                Evaluation Round
              </label>
              <input
                id="interviewer-round"
                type="text"
                required
                value={values.round}
                onChange={handleChange("round")}
                placeholder="e.g. Technical Round or HR Round"
                className="self-stretch h-12 px-4 py-3 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-gray-900 text-base placeholder:text-zinc-500/60 focus:outline-2 focus:outline-primary-600 transition-colors"
              />
            </div>

            <div className="self-stretch p-4 bg-primary-50/50 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-gray-900 text-sm font-semibold leading-5">
                  Round-specific access
                </span>
                <p className="text-neutral-600 text-xs leading-5">
                  The interviewer will only be able to see candidate scorecards and profiles for
                  their assigned rounds. This ensures data privacy across the evaluation funnel.
                </p>
              </div>
            </div>

            <div className="self-stretch pt-6 border-t border-secondary-300 flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-neutral-600 text-base font-medium hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 rounded-xl text-violet-100 text-base font-semibold shadow-[0px_10px_15px_-3px_rgba(124,58,237,0.20)] hover:bg-primary-700 transition-colors"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="self-stretch pt-2 sm:pt-6 opacity-40 flex flex-wrap justify-center gap-6 sm:gap-4">
        {interviewerFormTrustBadges.map(({ id: badgeId, label }) => {
          const Icon = TRUST_BADGE_ICONS[badgeId];
          return (
            <div key={badgeId} className="w-28 sm:w-80 p-4 flex flex-col items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-primary-600" />}
              <span className="text-center text-gray-900 text-xs font-medium leading-4">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}