import React from "react";
import SettingsFormField from "./SettingsFormField";
import { companyInformationFields } from "./settingdata";

/**
 * Company Information card. `fields` supplies labels/icons/types,
 * `values` supplies the current (editable) copy owned by the parent —
 * this component never holds its own state, it's a pure form view.
 */
export default function CompanyInformationCard({
  title = "Company Information",
  fields = companyInformationFields,
  values,
  onFieldChange = () => {},
}) {
  return (
    <div className="self-stretch p-6 sm:p-8 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex flex-col gap-6 sm:gap-8">
      <h2 className="text-gray-900 text-xl font-semibold leading-7">{title}</h2>

      <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        {fields.map((field) => (
          <SettingsFormField
            key={field.id}
            {...field}
            value={values?.[field.id] ?? field.value}
            onChange={onFieldChange}
          />
        ))}
      </div>
    </div>
  );
}