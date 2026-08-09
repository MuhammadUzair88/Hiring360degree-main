// src/components/interviewerDashboard/conductInterview/ResumeDocumentPreview.jsx

import React, { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Download,
  Printer,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ResumeDocumentPreview({ resume }) {
  const fileUrl = resume?.fileUrl;

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const cleanUrl = useMemo(() => {
    return fileUrl?.split("?")[0]?.toLowerCase() || "";
  }, [fileUrl]);

  const isPdf = cleanUrl.endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(cleanUrl);

  const handlePrint = () => {
    if (!fileUrl) return;

    const printWindow = window.open(fileUrl, "_blank");

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.15, 2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.15, 0.5));
  };

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  if (!fileUrl) {
    return (
      <div className="flex h-full min-h-[600px] items-center justify-center rounded-xl bg-gray-50">
        <p className="text-sm text-gray-500">
          No resume available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f6f7f9]">

      {/* Top action buttons */}
      <div className="flex items-center justify-end gap-2 px-5 py-4">
        <a
          href={fileUrl}
          download
          title="Download resume"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full border border-gray-200 bg-white
            text-gray-600 shadow-sm
            transition
            hover:border-gray-300 hover:text-primary-700
          "
        >
          <Download size={18} />
        </a>

        <button
          type="button"
          onClick={handlePrint}
          title="Print resume"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full border border-gray-200 bg-white
            text-gray-600 shadow-sm
            transition
            hover:border-gray-300 hover:text-primary-700
          "
        >
          <Printer size={18} />
        </button>

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open resume"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full border border-gray-200 bg-white
            text-gray-600 shadow-sm
            transition
            hover:border-gray-300 hover:text-primary-700
          "
        >
          <ExternalLink size={18} />
        </a>
      </div>

      {/* PDF */}
      {isPdf && (
        <div className="flex min-h-0 flex-1 flex-col">

          {/* Custom PDF toolbar */}
          <div className="mx-5 flex min-h-[52px] items-center justify-between rounded-t-xl border border-gray-200 bg-white px-4">

            {/* Page controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-md text-gray-500
                  hover:bg-gray-100
                  disabled:cursor-not-allowed disabled:opacity-30
                "
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {pageNumber}
                </span>

                <span className="mx-1">
                  /
                </span>

                <span>
                  {numPages || 1}
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-md text-gray-500
                  hover:bg-gray-100
                  disabled:cursor-not-allowed disabled:opacity-30
                "
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={zoomOut}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-md text-gray-500
                  hover:bg-gray-100
                "
              >
                <ZoomOut size={17} />
              </button>

              <div className="min-w-[55px] text-center text-xs font-medium text-gray-600">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={zoomIn}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-md text-gray-500
                  hover:bg-gray-100
                "
              >
                <ZoomIn size={17} />
              </button>
            </div>
          </div>

          {/* Resume canvas */}
          <div
            className="
              mx-5 mb-5
              min-h-0 flex-1
              overflow-auto
              rounded-b-xl
              border-x border-b border-gray-200
              bg-[#eef0f3]
            "
          >
            <div className="flex min-h-full justify-center px-8 py-8">
              <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setPageNumber(1);
                }}
                loading={
                  <div className="flex min-h-[500px] items-center justify-center">
                    <Loader2
                      size={26}
                      className="animate-spin text-primary-600"
                    />
                  </div>
                }
                error={
                  <div className="flex min-h-[500px] items-center justify-center">
                    <p className="text-sm text-red-500">
                      Unable to load resume.
                    </p>
                  </div>
                }
              >
                <div
                  className="
                    overflow-hidden
                    bg-white
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  "
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
              </Document>
            </div>
          </div>
        </div>
      )}

      {/* Image resume */}
      {isImage && (
        <div className="mx-5 mb-5 flex min-h-0 flex-1 justify-center overflow-auto rounded-xl border border-gray-200 bg-[#eef0f3] p-8">
          <img
            src={fileUrl}
            alt="Candidate resume"
            className="
              h-fit max-w-full
              bg-white
              shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            "
          />
        </div>
      )}

      {/* Unsupported */}
      {!isPdf && !isImage && (
        <div className="mx-5 mb-5 flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="text-center">
            <p className="mb-3 text-sm text-gray-500">
              Preview is not available for this file type.
            </p>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex rounded-lg
                bg-primary-700
                px-4 py-2
                text-sm font-medium text-white
              "
            >
              Open resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}