import React from "react";
import { CheckCircle2 } from "lucide-react";
import { securitySettings } from "./settingdata";

/** Account security summary card with a single primary action. */
export default function SecurityCard({
  title = securitySettings.title,
  subtitle = securitySettings.subtitle,
  icon: Icon = securitySettings.icon,
  passwordProtected = securitySettings.passwordProtected,
  lastChanged = securitySettings.lastChanged,
  onUpdatePassword = () => {},
}) {
  return (
    <div className="self-stretch p-6 sm:p-8 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
        {Icon && (
          <span className="w-12 h-12 bg-primary-600/10 rounded-xl flex justify-center items-center shrink-0">
            <Icon className="w-6 h-6 text-primary-700" strokeWidth={2} />
          </span>
        )}

        <div className="flex flex-col gap-1">
          <h2 className="text-gray-900 text-xl font-semibold leading-7">{title}</h2>
          <p className="text-neutral-600 text-sm font-normal leading-5">{subtitle}</p>

          <div className="pt-2 flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4">
            {passwordProtected && (
              <span className="inline-flex items-center gap-1.5 text-primary-600 text-xs font-medium leading-4">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                Password: Protected
              </span>
            )}
            <span className="hidden sm:inline text-neutral-600/60 text-xs font-medium leading-4">
              •
            </span>
            <span className="text-neutral-600 text-xs font-medium leading-4">
              Last changed: {lastChanged}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onUpdatePassword}
        className="w-full sm:w-auto px-6 py-2.5 bg-primary-800 rounded-lg text-white text-sm font-bold leading-5 hover:bg-primary-700 transition-colors shrink-0"
      >
        Update Password
      </button>
    </div>
  );
}