import React from "react";
import { Edit3, Share2, MapPin, Briefcase, DollarSign, CalendarDays, Tag } from "lucide-react";

const statusStyles = {
  Live: "bg-emerald-100 text-emerald-700",
  Active: "bg-emerald-100 text-emerald-700",
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
};

function formatDeadline(deadline) {
  if (!deadline) return "Open";
  const date = new Date(deadline);
  return Number.isNaN(date.getTime()) ? deadline : date.toLocaleDateString();
}

function formatCompensation(job) {
  if (job.employmentType === "Internship" && job.internshipPaid === "Paid") {
    return job.stipend || "Stipend TBD";
  }
  if (job.employmentType === "Internship" && job.internshipPaid === "Unpaid") {
    return "Unpaid";
  }
  if (typeof job.salary === "number") return job.salary.toLocaleString();
  return job.salary || "Competitive";
}

/** Left "Advertisement Details" card — department badge, title, key facts, and the two primary actions (Edit / Share). */
export default function JobOverviewDetailsCard({ job, onEdit, onShare }) {
  const details = [
    { icon: MapPin, label: "Location", value: job.location || "Remote" },
    {
      icon: Briefcase,
      label: "Job Type",
      value: `${job.employmentType || "Full-time"}${job.workMode ? ` · ${job.workMode}` : ""}`,
    },
    { icon: DollarSign, label: "Compensation", value: formatCompensation(job) },
    { icon: CalendarDays, label: "Deadline", value: formatDeadline(job.deadline) },
  ];

  return (
    <div className="w-full lg:w-[35%] flex flex-col justify-between bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm p-6 gap-6">
      <div className="flex flex-col gap-5">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-tight bg-primary-800/10 text-primary-800">
            {job.department || "General"}
          </span>
          <h2 className="text-black text-2xl font-semibold leading-tight mt-3">{job.jobTitle}</h2>
        </div>

        <div className="flex flex-col gap-4 border-t border-secondary-300 pt-5">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center text-primary-800 shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-black/50 text-caption uppercase tracking-tight">{label}</span>
                <span className="text-black text-sm font-medium truncate">{value}</span>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center text-primary-800 shrink-0">
              <Tag className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-black/50 text-caption uppercase tracking-tight">Status</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                  statusStyles[job.status] || "bg-sky-100 text-sky-700"
                }`}
              >
                {job.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-secondary-300">
        <button
          type="button"
          onClick={onEdit}
          className="w-full py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 text-black text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary-100 hover:outline-primary-800/40 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Edit Details
        </button>
        <button
          type="button"
          onClick={onShare}
          className="w-full py-3 rounded-xl bg-primary-800 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-800/20"
        >
          <Share2 className="w-4 h-4" />
          Share Advertisement
        </button>
      </div>
    </div>
  );
}