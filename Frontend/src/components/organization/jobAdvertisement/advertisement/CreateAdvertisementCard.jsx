import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

/** Outlined CTA card that links to the job-creation flow. Always the first tile in AdvertisementGrid. */
export default function CreateAdvertisementCard({
  to = "/advertisement/add",
  title = "Create New Advertisement",
  subtitle = "Expand your team by reaching thousands of qualified candidates.",
}) {
  return (
    <Link
      to={to}
      className="min-h-80 px-6 py-12 rounded-xl outline outline-2 outline-offset-[-2px] outline-secondary-300 flex flex-col items-center justify-center text-center gap-4 hover:outline-primary-800 hover:bg-primary-50/40 transition-colors"
    >
      <span className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
        <PlusCircle className="w-7 h-7 text-primary-800" strokeWidth={1.75} />
      </span>

      <div className="flex flex-col gap-1 max-w-56">
        <span className="text-gray-700 text-base leading-6">{title}</span>
        <span className="text-gray-500 text-sm leading-5">{subtitle}</span>
      </div>
    </Link>
  );
}