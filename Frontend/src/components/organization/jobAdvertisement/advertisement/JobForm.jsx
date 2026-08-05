// // import React from "react";
// // import { Briefcase, Building2, Clock, MapPin, DollarSign, CalendarDays, Loader2, Send } from "lucide-react";
// // import FormField from "./FormField";
// // import FormTextInput from "./FormTextInput";
// // import FormSelect from "./FormSelect";
// // import FormTextarea from "./FormTextarea";
// // import SkillsTagInput from "./SkillsTagInput";
// // import SegmentedOptionControl from "./SegmentedOptionControl";
// // import {
// //   employmentTypeOptions,
// //   workModeOptions,
// //   experienceLevelOptions,
// //   internshipPaidOptions,
// //   jobDescriptionMaxLength,
// // } from "./createadvertisementdata";

// // /**
// //  * "Job Information" card. Fully controlled — CreateAdvertisementOverview
// //  * owns `formData` and passes down change handlers, so this component
// //  * has no state of its own beyond what the field primitives manage
// //  * internally (e.g. the skills-input draft text).
// //  */
// // export default function JobForm({
// //   formData,
// //   onFieldChange,
// //   onSkillsChange,
// //   onSubmit,
// //   onCancel,
// //   isSubmitting = false,
// //   isSubmitDisabled = false,
// //   isEditMode = false,
// // }) {
// //   const isInternship = formData.employmentType === "Internship";
// //   const handleChange = (field) => (event) => onFieldChange(field, event.target.value);

// //   return (
// //     <form
// //       onSubmit={(event) => {
// //         event.preventDefault();
// //         onSubmit();
// //       }}
// //       className="bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden"
// //     >
// //       {/* Card header */}
// //       <div className="p-6 sm:p-8 border-b border-secondary-300 flex flex-col gap-1">
// //         <span className="text-primary-800 text-xs font-bold uppercase leading-4 tracking-wide">
// //           Advertisement Details
// //         </span>
// //         <h2 className="text-slate-900 text-2xl font-semibold leading-8">Job Information</h2>
// //         <p className="text-gray-700 text-sm leading-5">
// //           Specify the primary details for the new position advertisement.
// //         </p>
// //       </div>

// //       {/* Fields */}
// //       <div className="p-6 sm:p-8 flex flex-col gap-6">
// //         <FormField label="Job Title" required htmlFor="jobTitle">
// //           <FormTextInput
// //             id="jobTitle"
// //             icon={Briefcase}
// //             value={formData.jobTitle}
// //             onChange={handleChange("jobTitle")}
// //             placeholder="e.g. Senior Frontend Developer"
// //             required
// //           />
// //         </FormField>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //           <FormField label="Department" htmlFor="department">
// //             <FormTextInput
// //               id="department"
// //               icon={Building2}
// //               value={formData.department}
// //               onChange={handleChange("department")}
// //               placeholder="e.g. Engineering"
// //             />
// //           </FormField>

// //           <FormField label="Employment Type" required htmlFor="employmentType">
// //             <FormSelect
// //               id="employmentType"
// //               icon={Clock}
// //               value={formData.employmentType}
// //               onChange={handleChange("employmentType")}
// //               options={employmentTypeOptions}
// //               placeholder="Select employment type..."
// //               required
// //             />
// //           </FormField>

// //           <FormField label="Work Mode" required htmlFor="workMode">
// //             <FormSelect
// //               id="workMode"
// //               icon={MapPin}
// //               value={formData.workMode}
// //               onChange={handleChange("workMode")}
// //               options={workModeOptions}
// //               placeholder="Select work mode..."
// //               required
// //             />
// //           </FormField>

// //           <FormField label="Location" htmlFor="location">
// //             <FormTextInput
// //               id="location"
// //               icon={MapPin}
// //               value={formData.location}
// //               onChange={handleChange("location")}
// //               placeholder="e.g. Karachi, PK"
// //             />
// //           </FormField>

// //           <FormField label="Application Deadline" required htmlFor="deadline">
// //             <FormTextInput
// //               id="deadline"
// //               type="date"
// //               icon={CalendarDays}
// //               value={formData.deadline}
// //               onChange={handleChange("deadline")}
// //               required
// //             />
// //           </FormField>

// //           <FormField label="Salary / Compensation" htmlFor="salary">
// //             <FormTextInput
// //               id="salary"
// //               icon={DollarSign}
// //               value={formData.salary}
// //               onChange={handleChange("salary")}
// //               placeholder="e.g. $3,500 - $5,000/mo"
// //             />
// //           </FormField>

// //           {/* Only relevant once Employment Type is "Internship" — these map
// //               directly to the internshipPaid / internshipDuration schema fields
// //               that had no home in either the Figma frame or the old form. */}
// //           {isInternship && (
// //             <>
// //               <FormField label="Internship Paid?" htmlFor="internshipPaid">
// //                 <SegmentedOptionControl
// //                   name="internshipPaid"
// //                   options={internshipPaidOptions}
// //                   value={formData.internshipPaid}
// //                   onChange={(value) => onFieldChange("internshipPaid", value)}
// //                 />
// //               </FormField>

// //               <FormField label="Internship Duration" htmlFor="internshipDuration">
// //                 <FormTextInput
// //                   id="internshipDuration"
// //                   icon={Clock}
// //                   value={formData.internshipDuration}
// //                   onChange={handleChange("internshipDuration")}
// //                   placeholder="e.g. 3 months"
// //                 />
// //               </FormField>
// //             </>
// //           )}
// //         </div>

// //         <FormField label="Experience Level" htmlFor="experience">
// //           <SegmentedOptionControl
// //             name="experience"
// //             options={experienceLevelOptions}
// //             value={formData.experience}
// //             onChange={(value) => onFieldChange("experience", value)}
// //           />
// //         </FormField>

// //         <FormField
// //           label="Required Skills"
// //           required
// //           htmlFor="skills"
// //           helperText="Press Enter or comma after each skill to add it."
// //         >
// //           <SkillsTagInput
// //             id="skills"
// //             skills={formData.skills}
// //             onChange={onSkillsChange}
// //             placeholder="e.g. React, TypeScript, Tailwind CSS"
// //           />
// //         </FormField>

// //         <FormField label="Job Description" required htmlFor="description">
// //           <FormTextarea
// //             id="description"
// //             value={formData.description}
// //             onChange={handleChange("description")}
// //             maxLength={jobDescriptionMaxLength}
// //             placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity exciting..."
// //             required
// //           />
// //         </FormField>
// //       </div>

// //       {/* Footer actions */}
// //       <div className="p-6 sm:p-8 border-t border-secondary-300 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
// //         <button
// //           type="button"
// //           onClick={onCancel}
// //           className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
// //         >
// //           Cancel
// //         </button>
// //         <button
// //           type="submit"
// //           disabled={isSubmitting || isSubmitDisabled}
// //           className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
// //         >
// //           {isSubmitting ? (
// //             <>
// //               <Loader2 className="w-4 h-4 animate-spin" />
// //               Publishing...
// //             </>
// //           ) : (
// //             <>
// //               <Send className="w-4 h-4" />
// //               {isEditMode ? "Update Job" : "Publish Job"}
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </form>
// //   );
// // }























// import React from "react";
// import { Briefcase, Building2, Clock, MapPin, DollarSign, CalendarDays, Loader2, Send } from "lucide-react";
// import FormField from "./FormField";
// import FormTextInput from "./FormTextInput";
// import FormSelect from "./FormSelect";
// import FormTextarea from "./FormTextarea";
// import SkillsTagInput from "./SkillsTagInput";
// import SegmentedOptionControl from "./SegmentedOptionControl";
// import {
//   employmentTypeOptions,
//   workModeOptions,
//   experienceLevelOptions,
//   internshipPaidOptions,
//   jobDescriptionMaxLength,
// } from "./createadvertisementdata";

// /**
//  * "Job Information" card. Fully controlled — CreateAdvertisementOverview
//  * owns `formData` and passes down change handlers, so this component
//  * has no state of its own beyond what the field primitives manage
//  * internally (e.g. the skills-input draft text).
//  */
// export default function JobForm({
//   formData,
//   onFieldChange,
//   onSkillsChange,
//   onSubmit,
//   onCancel,
//   isSubmitting = false,
//   isSubmitDisabled = false,
//   isEditMode = false,
// }) {
//   const isInternship = formData.employmentType === "Internship";
//   // THE FIX: Salary/Compensation only makes sense for a non-internship role,
//   // or a Paid internship (where it doubles as the stipend amount). An
//   // Unpaid internship has nothing to put here, so the field is hidden
//   // rather than left sitting there implying compensation that isn't offered.
//   const isPaidInternship = isInternship && formData.internshipPaid === "Paid";
//   const handleChange = (field) => (event) => onFieldChange(field, event.target.value);

//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         onSubmit();
//       }}
//       className="bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden"
//     >
//       {/* Card header */}
//       <div className="p-6 sm:p-8 border-b border-secondary-300 flex flex-col gap-1">
//         <span className="text-primary-800 text-xs font-bold uppercase leading-4 tracking-wide">
//           Advertisement Details
//         </span>
//         <h2 className="text-slate-900 text-2xl font-semibold leading-8">Job Information</h2>
//         <p className="text-gray-700 text-sm leading-5">
//           Specify the primary details for the new position advertisement.
//         </p>
//       </div>

//       {/* Fields */}
//       <div className="p-6 sm:p-8 flex flex-col gap-6">
//         <FormField label="Job Title" required htmlFor="jobTitle">
//           <FormTextInput
//             id="jobTitle"
//             icon={Briefcase}
//             value={formData.jobTitle}
//             onChange={handleChange("jobTitle")}
//             placeholder="e.g. Senior Frontend Developer"
//             required
//           />
//         </FormField>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <FormField label="Department" htmlFor="department">
//             <FormTextInput
//               id="department"
//               icon={Building2}
//               value={formData.department}
//               onChange={handleChange("department")}
//               placeholder="e.g. Engineering"
//             />
//           </FormField>

//           <FormField label="Employment Type" required htmlFor="employmentType">
//             <FormSelect
//               id="employmentType"
//               icon={Clock}
//               value={formData.employmentType}
//               onChange={handleChange("employmentType")}
//               options={employmentTypeOptions}
//               placeholder="Select employment type..."
//               required
//             />
//           </FormField>

//           <FormField label="Work Mode" required htmlFor="workMode">
//             <FormSelect
//               id="workMode"
//               icon={MapPin}
//               value={formData.workMode}
//               onChange={handleChange("workMode")}
//               options={workModeOptions}
//               placeholder="Select work mode..."
//               required
//             />
//           </FormField>

//           <FormField label="Location" htmlFor="location">
//             <FormTextInput
//               id="location"
//               icon={MapPin}
//               value={formData.location}
//               onChange={handleChange("location")}
//               placeholder="e.g. Karachi, PK"
//             />
//           </FormField>

//           <FormField label="Application Deadline" required htmlFor="deadline">
//             <FormTextInput
//               id="deadline"
//               type="date"
//               icon={CalendarDays}
//               value={formData.deadline}
//               onChange={handleChange("deadline")}
//               required
//             />
//           </FormField>

//           {/* Hidden for Unpaid internships — see isPaidInternship above.
//               Shown as normal for every other employment type, and for
//               Paid internships (where it represents the stipend). */}
//           {(!isInternship || isPaidInternship) && (
//             <FormField label="Salary / Compensation" htmlFor="salary">
//               <FormTextInput
//                 id="salary"
//                 icon={DollarSign}
//                 value={formData.salary}
//                 onChange={handleChange("salary")}
//                 placeholder="e.g. $3,500 - $5,000/mo"
//               />
//             </FormField>
//           )}

//           {/* Only relevant once Employment Type is "Internship" — these map
//               directly to the internshipPaid / internshipDuration schema fields
//               that had no home in either the Figma frame or the old form. */}
//           {isInternship && (
//             <>
//               <FormField label="Internship Paid?" htmlFor="internshipPaid">
//                 <SegmentedOptionControl
//                   name="internshipPaid"
//                   options={internshipPaidOptions}
//                   value={formData.internshipPaid}
//                   onChange={(value) => onFieldChange("internshipPaid", value)}
//                 />
//               </FormField>

//               <FormField label="Internship Duration" htmlFor="internshipDuration">
//                 <FormTextInput
//                   id="internshipDuration"
//                   icon={Clock}
//                   value={formData.internshipDuration}
//                   onChange={handleChange("internshipDuration")}
//                   placeholder="e.g. 3 months"
//                 />
//               </FormField>
//             </>
//           )}
//         </div>

//         <FormField label="Experience Level" htmlFor="experience">
//           <SegmentedOptionControl
//             name="experience"
//             options={experienceLevelOptions}
//             value={formData.experience}
//             onChange={(value) => onFieldChange("experience", value)}
//           />
//         </FormField>

//         <FormField
//           label="Required Skills"
//           required
//           htmlFor="skills"
//           helperText="Press Enter or comma after each skill to add it."
//         >
//           <SkillsTagInput
//             id="skills"
//             skills={formData.skills}
//             onChange={onSkillsChange}
//             placeholder="e.g. React, TypeScript, Tailwind CSS"
//           />
//         </FormField>

//         <FormField label="Job Description" required htmlFor="description">
//           <FormTextarea
//             id="description"
//             value={formData.description}
//             onChange={handleChange("description")}
//             maxLength={jobDescriptionMaxLength}
//             placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity exciting..."
//             required
//           />
//         </FormField>
//       </div>

//       {/* Footer actions */}
//       <div className="p-6 sm:p-8 border-t border-secondary-300 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting || isSubmitDisabled}
//           className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Publishing...
//             </>
//           ) : (
//             <>
//               <Send className="w-4 h-4" />
//               {isEditMode ? "Update Job" : "Publish Job"}
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }




import React from "react";
import { Briefcase, Building2, Clock, MapPin, DollarSign, CalendarDays, Loader2, Send } from "lucide-react";
import FormField from "./FormField";
import FormTextInput from "./FormTextInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import SkillsTagInput from "./SkillsTagInput";
import SegmentedOptionControl from "./SegmentedOptionControl";
import {
  employmentTypeOptions,
  workModeOptions,
  experienceLevelOptions,
  internshipPaidOptions,
  jobDescriptionMaxLength,
} from "./createadvertisementdata";

/**
 * "Job Information" card. Fully controlled — CreateAdvertisementOverview
 * owns `formData` and passes down change handlers, so this component
 * has no state of its own beyond what the field primitives manage
 * internally (e.g. the skills-input draft text).
 */
export default function JobForm({
  formData,
  onFieldChange,
  onSkillsChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSubmitDisabled = false,
  isEditMode = false,
}) {
  const isInternship = formData.employmentType === "Internship";
  // Salary/Compensation only makes sense for a non-internship role, or a
  // Paid internship (where it doubles as the stipend amount). For Unpaid
  // internships there's nothing to put here.
  const isPaidInternship = isInternship && formData.internshipPaid === "Paid";
  const handleChange = (field) => (event) => onFieldChange(field, event.target.value);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col overflow-hidden"
    >
      {/* Card header */}
      <div className="p-6 sm:p-8 border-b border-secondary-300 flex flex-col gap-1">
        <span className="text-primary-800 text-xs font-bold uppercase leading-4 tracking-wide">
          Advertisement Details
        </span>
        <h2 className="text-slate-900 text-2xl font-semibold leading-8">Job Information</h2>
        <p className="text-gray-700 text-sm leading-5">
          Specify the primary details for the new position advertisement.
        </p>
      </div>

      {/* Fields */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <FormField label="Job Title" required htmlFor="jobTitle">
          <FormTextInput
            id="jobTitle"
            icon={Briefcase}
            value={formData.jobTitle}
            onChange={handleChange("jobTitle")}
            placeholder="e.g. Senior Frontend Developer"
            required
          />
        </FormField>

        {/*
          Common fields only — this grid's contents no longer change shape
          based on Paid/Unpaid, so its layout is identical every time
          Internship is selected. Salary/Compensation only appears here for
          non-internship types; internships get their own Stipend field
          below, inside the dedicated internship block.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Department" htmlFor="department">
            <FormTextInput
              id="department"
              icon={Building2}
              value={formData.department}
              onChange={handleChange("department")}
              placeholder="e.g. Engineering"
            />
          </FormField>

          <FormField label="Employment Type" required htmlFor="employmentType">
            <FormSelect
              id="employmentType"
              icon={Clock}
              value={formData.employmentType}
              onChange={handleChange("employmentType")}
              options={employmentTypeOptions}
              placeholder="Select employment type..."
              required
            />
          </FormField>

          <FormField label="Work Mode" required htmlFor="workMode">
            <FormSelect
              id="workMode"
              icon={MapPin}
              value={formData.workMode}
              onChange={handleChange("workMode")}
              options={workModeOptions}
              placeholder="Select work mode..."
              required
            />
          </FormField>

          <FormField label="Location" htmlFor="location">
            <FormTextInput
              id="location"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="e.g. Karachi, PK"
            />
          </FormField>

          <FormField label="Application Deadline" required htmlFor="deadline">
            <FormTextInput
              id="deadline"
              type="date"
              icon={CalendarDays}
              value={formData.deadline}
              onChange={handleChange("deadline")}
              required
            />
          </FormField>

          {!isInternship && (
            <FormField label="Salary / Compensation" htmlFor="salary">
              <FormTextInput
                id="salary"
                icon={DollarSign}
                value={formData.salary}
                onChange={handleChange("salary")}
                placeholder="e.g. $3,500 - $5,000/mo"
              />
            </FormField>
          )}
        </div>

        {/*
          Internship terms — isolated from the grid above on purpose. The
          Paid/Unpaid toggle always sits on its own row; Duration always
          sits on the left; Stipend Amount only ever appears on the right,
          next to Duration, and only for Paid. Nothing here ever swaps
          places with Application Deadline or any other common field.
        */}
        {isInternship && (
          <div className="rounded-xl border border-secondary-300 bg-secondary-100/60 p-5 flex flex-col gap-4">
            <FormField label="Internship Paid?" htmlFor="internshipPaid">
              <SegmentedOptionControl
                name="internshipPaid"
                options={internshipPaidOptions}
                value={formData.internshipPaid}
                onChange={(value) => onFieldChange("internshipPaid", value)}
              />
            </FormField>

            <div className={`grid grid-cols-1 gap-4 ${isPaidInternship ? "sm:grid-cols-2" : ""}`}>
              <FormField label="Internship Duration" htmlFor="internshipDuration">
                <FormTextInput
                  id="internshipDuration"
                  icon={Clock}
                  value={formData.internshipDuration}
                  onChange={handleChange("internshipDuration")}
                  placeholder="e.g. 3 months"
                />
              </FormField>

              {isPaidInternship && (
                <FormField label="Stipend Amount" htmlFor="salary">
                  <FormTextInput
                    id="salary"
                    icon={DollarSign}
                    value={formData.salary}
                    onChange={handleChange("salary")}
                    placeholder="e.g. $500/month"
                  />
                </FormField>
              )}
            </div>
          </div>
        )}

        <FormField label="Experience Level" htmlFor="experience">
          <SegmentedOptionControl
            name="experience"
            options={experienceLevelOptions}
            value={formData.experience}
            onChange={(value) => onFieldChange("experience", value)}
          />
        </FormField>

        <FormField
          label="Required Skills"
          required
          htmlFor="skills"
          helperText="Press Enter or comma after each skill to add it."
        >
          <SkillsTagInput
            id="skills"
            skills={formData.skills}
            onChange={onSkillsChange}
            placeholder="e.g. React, TypeScript, Tailwind CSS"
          />
        </FormField>

        <FormField label="Job Description" required htmlFor="description">
          <FormTextarea
            id="description"
            value={formData.description}
            onChange={handleChange("description")}
            maxLength={jobDescriptionMaxLength}
            placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity exciting..."
            required
          />
        </FormField>
      </div>

      {/* Footer actions */}
      <div className="p-6 sm:p-8 border-t border-secondary-300 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isSubmitDisabled}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {isEditMode ? "Update Job" : "Publish Job"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}