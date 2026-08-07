import React, { useRef, useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { RESUME_UPLOAD_CONFIG } from "./data";

export default function ResumeUploader({ file, onChange, error }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const selected = fileList?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-slate-900">
        Upload Resume
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={RESUME_UPLOAD_CONFIG.acceptAttr}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-secondary-300 bg-secondary-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-full bg-success-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-success-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 rounded-full text-gray-400 hover:bg-secondary-200 hover:text-danger-600 transition-colors shrink-0"
            aria-label="Remove resume"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-1 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40 ${
            isDragging
              ? "border-primary-700 bg-primary-50"
              : error
              ? "border-danger-300 bg-danger-50"
              : "border-secondary-300 bg-secondary-100 hover:bg-secondary-200"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5 text-primary-700" />
          </div>
          <p className="text-sm font-medium text-slate-900">Click to upload your resume</p>
          <p className="text-xs text-gray-400">
            {RESUME_UPLOAD_CONFIG.acceptedTypes.map((t) => t.replace(".", "").toUpperCase()).join(", ")}{" "}
            (Max {RESUME_UPLOAD_CONFIG.maxSizeMB}MB)
          </p>
        </div>
      )}

      {error && <span className="pl-1 text-xs text-danger-600">{error}</span>}
    </div>
  );
}