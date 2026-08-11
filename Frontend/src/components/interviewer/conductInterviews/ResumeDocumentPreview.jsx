// src/components/interviewer/conductInterviews/ResumeDocumentPreview.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Keep the worker version exactly aligned with react-pdf's PDF.js API.
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

function getFriendlyType(mimeType, extension) {
  if (mimeType === MIME.PDF || extension === "pdf") return "PDF document";
  if ([MIME.DOC, MIME.DOCX].includes(mimeType) || ["doc", "docx"].includes(extension)) {
    return "Word document";
  }
  if ([MIME.XLS, MIME.XLSX].includes(mimeType) || ["xls", "xlsx"].includes(extension)) {
    return "Spreadsheet";
  }
  if ([MIME.PPT, MIME.PPTX].includes(mimeType) || ["ppt", "pptx"].includes(extension)) {
    return "Presentation";
  }
  if (mimeType?.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return "Image document";
  }
  return "Resume document";
}

function OfficeDocumentViewer({ fileUrl, title }) {
  const canEmbed = canUseOnlineOfficeViewer(fileUrl);

  if (!canEmbed) {
    return (
      <div className="flex min-h-[620px] flex-1 items-center justify-center bg-[#e9ebee] p-6">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-primary-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            Word preview needs a public document URL
          </h3>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            The saved resume URL is local or private, so the Office viewer cannot fetch the original document.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white"
          >
            <ExternalLink size={14} />
            Open original
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 bg-[#e9ebee] p-3 sm:p-5">
      <div className="h-full min-h-[620px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <iframe
          src={buildOfficeViewerUrl(fileUrl)}
          title={title}
          className="h-full min-h-[620px] w-full border-0 bg-white"
          loading="eager"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function ResumeDocumentPreview({
  resume,
  candidateName = "Candidate",
  jobTitleTarget = "",
}) {
  const fileUrl = String(resume?.fileUrl || resume?.url || "").trim();
  const mimeType = String(resume?.type || resume?.mimeType || "").toLowerCase();
  const extension = useMemo(() => getExtension(fileUrl), [fileUrl]);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pdfError, setPdfError] = useState("");
  const [pdfRetryKey, setPdfRetryKey] = useState(0);

  const isPdf = mimeType === MIME.PDF || extension === "pdf";
  const isWord =
    [MIME.DOC, MIME.DOCX].includes(mimeType) || ["doc", "docx"].includes(extension);
  const isSpreadsheet =
    [MIME.XLS, MIME.XLSX].includes(mimeType) || ["xls", "xlsx"].includes(extension);
  const isPresentation =
    [MIME.PPT, MIME.PPTX].includes(mimeType) || ["ppt", "pptx"].includes(extension);
  const isOffice = isWord || isSpreadsheet || isPresentation;
  const isImage =
    mimeType.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);

  const friendlyType = getFriendlyType(mimeType, extension);

  useEffect(() => {
    setNumPages(0);
    setPageNumber(1);
    setScale(1);
    setPdfError("");
    setPdfRetryKey((value) => value + 1);
  }, [fileUrl]);

  const handlePrint = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  if (!fileUrl) {
    return (
      <div className="flex min-h-[600px] flex-1 items-center justify-center bg-[#f6f7f9] p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-200 text-gray-400">
            <FileText size={21} />
          </div>
          <p className="text-sm font-semibold text-slate-900">No resume available</p>
          <p className="mt-1 text-xs text-gray-500">
            This candidate does not have a resume attached to the application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f6f7f9]">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <FileText size={17} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {candidateName}'s Resume
            </p>
            <p className="truncate text-xs text-gray-400">
              {friendlyType}{jobTitleTarget ? ` · ${jobTitleTarget}` : ""}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            title="Download resume"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            <Download size={16} />
          </a>

          <button
            type="button"
            onClick={handlePrint}
            title="Open for printing"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            <Printer size={16} />
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original resume"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {isPdf && (
        <div className="flex min-h-0 flex-1 flex-col">
          {!pdfError && (
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPageNumber((previous) => Math.max(previous - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <div className="mx-2 min-w-[72px] text-center text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{pageNumber}</span>
                  <span className="mx-1.5">of</span>
                  <span>{numPages || "—"}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPageNumber((previous) => Math.min(previous + 1, numPages || 1))
                  }
                  disabled={!numPages || pageNumber >= numPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setScale((previous) => Math.max(previous - 0.15, 0.5))}
                  disabled={scale <= 0.5}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="min-w-[52px] text-center text-xs font-medium text-gray-600">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setScale((previous) => Math.min(previous + 0.15, 2))}
                  disabled={scale >= 2}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>
          )}

          {!pdfError ? (
            <div className="min-h-0 flex-1 overflow-auto bg-[#e9ebee]">
              <div className="flex min-h-full justify-center p-5 sm:p-8">
                <Document
                  key={pdfRetryKey}
                  file={fileUrl}
                  onLoadSuccess={({ numPages: pages }) => {
                    setNumPages(pages);
                    setPageNumber(1);
                    setPdfError("");
                  }}
                  onLoadError={(error) => {
                    console.error("Resume PDF preview failed:", error);
                    setPdfError(error?.message || "Unable to load this PDF.");
                  }}
                  loading={
                    <div className="flex min-h-[520px] min-w-[360px] flex-col items-center justify-center gap-3">
                      <Loader2 size={24} className="animate-spin text-primary-600" />
                      <p className="text-xs text-gray-500">Loading PDF…</p>
                    </div>
                  }
                  error={null}
                >
                  <div className="overflow-hidden bg-white shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </div>
                </Document>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col bg-[#e9ebee]">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-800">Using browser PDF viewer</p>
                  <p className="mt-0.5 truncate text-[11px] text-amber-700">{pdfError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfError("");
                    setPdfRetryKey((value) => value + 1);
                  }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
              <iframe
                src={fileUrl}
                title={`${candidateName} resume PDF`}
                className="h-full min-h-[620px] w-full flex-1 border-0 bg-white"
              />
            </div>
          )}
        </div>
      )}

      {isOffice && (
        <OfficeDocumentViewer fileUrl={fileUrl} title={`${candidateName} ${friendlyType}`} />
      )}

      {isImage && (
        <div className="min-h-0 flex-1 overflow-auto bg-[#e9ebee] p-5 sm:p-8">
          <div className="mx-auto w-fit overflow-hidden bg-white shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
            <img
              src={fileUrl}
              alt={`${candidateName} resume`}
              className="h-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {!isPdf && !isOffice && !isImage && (
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Preview unavailable</h3>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              This resume format cannot be rendered inside the browser. Open the original document to view it.
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-800"
            >
              <ExternalLink size={14} />
              Open resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
