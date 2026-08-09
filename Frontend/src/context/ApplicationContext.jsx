// src/context/ApplicationContext.jsx
import React, { createContext, useContext, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import applicationService from "../services/applicationService";
import { extractErrorMessage } from "../services/apiClient";
import { uploadImageToCloudinary } from "../utils/uploadImage";

// Configure PDF.js worker for text extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ApplicationContext = createContext();
export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // ---------------- 1. TEXT EXTRACTION (PDF & DOCX) ----------------
  const extractTextFromFile = async (file) => {
    const fileType = file.type;

    try {
      if (fileType === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ");
        }
        return text;
      } 
      else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } 
      else if (fileType === "application/msword") {
        throw new Error("Legacy .doc files are not supported. Please convert to .docx or .pdf");
      }

      throw new Error("Unsupported file format. Please upload a PDF or DOCX.");
    } catch (error) {
      throw new Error(error.message || "Failed to read the file contents.");
    }
  };

  // ---------------- 2. CLOUDINARY UPLOAD ----------------
  // Uses the shared uploader (utils/uploadImage.js) — same Cloudinary
  // unsigned-upload flow the organization logo uses in Login/Settings,
  // just applied to a resume file instead of an image.
  const uploadToCloudinary = uploadImageToCloudinary;

  // ---------------- 3. MAIN SUBMIT FUNCTION ----------------
  const submitApplication = async ({
    name,
    email,
    phone,
    file,
    advertisementId,
    organizationId,
  }) => {
    setLoading(true);

    try {
      // Step A: Extract raw text for AI processing
      const resumeText = await extractTextFromFile(file);

      // CRITICAL ATS GUARD: Prevent empty text from image-based PDFs
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error(
          "Could not extract readable text. If this is a scanned document or image, please upload a standard text-based PDF or Word document."
        );
      }

      // Step B: Upload file to Cloudinary
      const resumeUrl = await uploadToCloudinary(file);

      // Step C: Prepare flat payload matching the Express backend expectations
      const payload = {
        name,
        email,
        phone,
        resumeUrl,
        resumeType: file.type,
        resumeText,
        organizationId,
      };

      // Step D: Send to backend route
      const data = await applicationService.submit(advertisementId, payload);

      if (data?.success) {
        return data;
      } else {
        throw new Error(data?.message || "Submission failed to process.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      throw new Error(extractErrorMessage(error, "An unexpected error occurred during submission."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        loading,
        submitApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};