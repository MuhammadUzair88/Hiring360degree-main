import React from "react";
import { Link } from "react-router-dom";


/** Card with a table of the most recent candidate applications. */
export default function RecentApplicationsTable({
  applications = [],
  viewAllTo = "/advertisement",
}) {
  return (
    <div className="self-stretch rounded-xl bg-secondary-50/80 outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 flex items-center justify-between gap-3">
        <h2 className="text-slate-900 text-lg font-semibold leading-6">Recent Applications</h2>
        <Link
          to={viewAllTo}
          className="text-primary-800 text-xs font-bold leading-4 tracking-tight hover:underline shrink-0"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-secondary-200/60 text-zinc-600 text-xs font-bold uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Candidate</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Applied On</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-300/60">
            {applications.map((app) => (
              <tr key={app.id || `${app.email || app.candidateName}-${app.appliedOn}`} className="hover:bg-secondary-200/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-primary-100 text-primary-800 text-[11px] font-bold flex items-center justify-center uppercase">
                      {app.initials}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-slate-900 text-sm font-semibold truncate">
                        {app.candidateName}
                      </span>
                      <span className="block text-zinc-600 text-xs truncate">{app.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700 text-sm font-medium">{app.roleLabel}</td>
                <td className="px-6 py-4 text-zinc-600 text-sm">{app.appliedOn}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 text-xs font-semibold">
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}