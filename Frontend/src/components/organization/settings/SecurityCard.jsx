

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { securitySettings } from "./settingdata";

export default function SecurityCard({
  title = securitySettings.title,
  subtitle = securitySettings.subtitle,
  icon: Icon = securitySettings.icon,
  passwordProtected = securitySettings.passwordProtected,
  lastChanged = securitySettings.lastChanged,
  onUpdatePassword = () => {},
}) {
  return (
    <div className="self-stretch rounded-xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-secondary-300/60 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
          {Icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600/10">
              <Icon className="h-6 w-6 text-primary-700" strokeWidth={2} />
            </span>
          )}

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">{title}</h2>
            <p className="text-sm font-normal leading-5 text-neutral-600">{subtitle}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 sm:justify-start sm:gap-4">
              {passwordProtected && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium leading-4 text-primary-600">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Password: Protected
                </span>
              )}
              <span className="hidden text-xs font-medium leading-4 text-neutral-600/60 sm:inline">•</span>
              <span className="text-xs font-medium leading-4 text-neutral-600">
                Last changed: {lastChanged}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onUpdatePassword}
          className="w-full shrink-0 rounded-lg bg-primary-800 px-6 py-2.5 text-sm font-bold leading-5 text-white transition-colors hover:bg-primary-700 sm:w-auto"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
