import React, { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Eye,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIME = {
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PPT: "application/vnd.ms-powerpoint",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

function getExtension(url = "") {
  try {
    const parsed = new URL(url, window.location.origin);
    const pathname = decodeURIComponent(parsed.pathname || "").toLowerCase();
    return pathname.match(/\.([a-z0-9]+)$/i)?.[1] || "";
  } catch {
    const clean = String(url).split("?")[0].split("#")[0].toLowerCase();
    return clean.match(/\.([a-z0-9]+)$/i)?.[1] || "";
  }
}

function buildOfficeViewerUrl(fileUrl) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

function canUseOnlineOfficeViewer(fileUrl = "") {
  try {
    const parsed = new URL(fileUrl);
    return ["http:", "https:"].includes(parsed.protocol) &&
      !["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default function ResumePreviewPanel({ resume, candidateName }) {
  const fileUrl = String(resume?.url || resume?.fileUrl || "").trim();
  const mimeType = String(resume?.type || resume?.mimeType || "").toLowerCase();

  const [numPages, setNumPages] = useState(0);
  const [previewError, setPreviewError] = useState("");

  const extension = useMemo(() => getExtension(fileUrl), [fileUrl]);

  const isPdf = mimeType === MIME.PDF || extension === "pdf";
  const isWord =
    [MIME.DOC, MIME.DOCX].includes(mimeType) || ["doc", "docx"].includes(extension);
  const isSpreadsheet =
    [MIME.XLS, MIME.XLSX].includes(mimeType) || ["xls", "xlsx"].includes(extension);
  const isPresentation =
    [MIME.PPT, MIME.PPTX].includes(mimeType) || ["ppt", "pptx"].includes(extension);
  const isOffice = isWord || isSpreadsheet || isPresentation;
  const isImage =
    mimeType.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(extension);

  const officeViewerAvailable = isOffice && canUseOnlineOfficeViewer(fileUrl);

  if (!fileUrl) {
    return (
      <div className="w-full sm:w-72 shrink-0 flex flex-col gap-3 p-6 bg-secondary-100 border-t sm:border-t-0 sm:border-l border-secondary-300">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wide">
          <Eye className="w-3.5 h-3.5" />
          Resume Preview
        </div>

        <div className="flex-1 min-h-[20rem] rounded-xl bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <FileText className="w-10 h-10 text-secondary-400" />
          <p className="text-gray-500 text-xs">No resume file is available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-72 shrink-0 flex flex-col gap-3 p-6 bg-secondary-100 border-t sm:border-t-0 sm:border-l border-secondary-300">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wide">
          <Eye className="w-3.5 h-3.5" />
          Resume Preview
        </span>

        {isPdf && (
          <span className="px-2 py-0.5 rounded bg-secondary-200 text-gray-600 text-[10px] font-bold">
            {numPages || 1} pg{(numPages || 1) > 1 ? "s" : ""}
          </span>
        )}

        {isWord && (
          <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 text-[10px] font-bold">
            WORD
          </span>
        )}
      </div>

      <div className="flex-1 min-h-[26rem] rounded-xl bg-[#eef0f3] shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 overflow-hidden">
        {isPdf ? (
          previewError ? (
            <div className="min-h-[26rem] flex flex-col items-center justify-center gap-3 p-6 text-center bg-secondary-50">
              <AlertCircle className="w-8 h-8 text-warning-500" />
              <p className="text-slate-900 text-xs font-semibold">
                Resume preview could not be rendered.
              </p>
              <p className="text-gray-500 text-[11px] leading-4">{previewError}</p>
            </div>
          ) : (
            <div className="min-h-full flex justify-center overflow-auto p-3">
              <Document
                file={fileUrl}
                onLoadSuccess={({ numPages: loadedPages }) => {
                  setNumPages(loadedPages);
                  setPreviewError("");
                }}
                onLoadError={(error) => {
                  console.error("Resume preview failed:", error);
                  setPreviewError(error?.message || "Unable to load the resume PDF.");
                }}
                loading={
                  <div className="min-h-[26rem] w-full flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-700" />
                    <span className="text-xs text-gray-500">Loading resume…</span>
                  </div>
                }
                error={null}
              >
                <div className="overflow-hidden bg-white shadow-[0_6px_22px_rgba(0,0,0,0.10)]">
                  <Page
                    pageNumber={1}
                    width={220}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Document>
            </div>
          )
        ) : officeViewerAvailable ? (
          <iframe
            src={buildOfficeViewerUrl(fileUrl)}
            title={`${candidateName || "Candidate"} resume preview`}
            className="h-[30rem] w-full border-0 bg-white"
            loading="eager"
            allowFullScreen
          />
        ) : isOffice ? (
          <div className="min-h-[26rem] flex flex-col items-center justify-center gap-3 p-6 text-center bg-secondary-50">
            <FileText className="w-10 h-10 text-primary-500" />
            <p className="text-slate-900 text-xs font-semibold">
              The original Word file cannot be embedded from this URL.
            </p>
            <p className="text-gray-500 text-[11px] leading-4">
              Store the resume at a public HTTPS URL, then the real Word layout will display here.
            </p>
          </div>
        ) : isImage ? (
          <div className="min-h-[26rem] flex items-start justify-center overflow-auto p-3">
            <img
              src={fileUrl}
              alt={`${candidateName || "Candidate"} resume`}
              className="max-w-full h-auto bg-white shadow-[0_6px_22px_rgba(0,0,0,0.10)]"
            />
          </div>
        ) : (
          <div className="min-h-[26rem] flex flex-col items-center justify-center gap-3 p-6 text-center bg-secondary-50">
            <FileText className="w-10 h-10 text-secondary-400" />
            <p className="text-slate-900 text-xs font-semibold">
              Inline preview is unavailable for this file type.
            </p>
            <p className="text-gray-500 text-[11px] leading-4">
              Open the original resume to view it.
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs text-center truncate px-1">
        {candidateName || "Candidate"}'s Resume
      </p>

      <div className="flex gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-secondary-300 text-slate-900 text-xs font-medium hover:bg-secondary-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open
        </a>

        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-800 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}
