import React from "react";
import {
  Eye,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

const ResumePreviewPanel = ({ resume, candidateName }) => {
  if (!resume) return null;

  return (
    <div className="w-full sm:w-72 shrink-0 flex flex-col gap-3 p-6 bg-secondary-100 border-t sm:border-t-0 sm:border-l border-secondary-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wide">
          <Eye className="w-3.5 h-3.5" />
          Resume Preview
        </span>

        <span className="px-2 py-0.5 rounded bg-secondary-200 text-gray-600 text-[10px] font-bold">
          {resume.pageCount || 1} pg
          {(resume.pageCount || 1) > 1 ? "s" : ""}
        </span>
      </div>

      {/* Resume Preview */}
      <div className="flex-1 min-h-[16rem] rounded-xl bg-secondary-50 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col items-center justify-center gap-3 p-6">
        <FileText className="w-10 h-10 text-secondary-400" />

        <p className="text-gray-500 text-xs text-center">
          {candidateName || "Candidate"}'s Resume (PDF)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <a
          href={resume.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-secondary-300 text-slate-900 text-xs font-medium hover:bg-secondary-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open
        </a>

        <a
          href={resume.url}
          download
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
};

export default ResumePreviewPanel;