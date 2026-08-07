import React from "react";
import { FileText } from "lucide-react";

export default function AboutRole({ description }) {
  return (
    <div className="bg-secondary-50 rounded-2xl shadow-sm ring-1 ring-secondary-300/60 p-5 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2.5">
        <FileText className="w-5 h-5 text-primary-700 shrink-0" />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
          About This Role
        </h2>
      </div>

      <p
        className={`mt-3 text-sm sm:text-base leading-relaxed whitespace-pre-line ${
          description ? "text-gray-500" : "text-gray-400 italic"
        }`}
      >
        {description || "No description has been provided for this role yet."}
      </p>
    </div>
  );
}