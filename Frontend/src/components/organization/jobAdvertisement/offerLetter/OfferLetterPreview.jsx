import React from "react";
import { resolveOfferPalette, themeTemplates } from "./Theme";
import { formatLongDate, getTodayDateInput } from "./offerDateUtils";

export default function OfferLetterPreview({
  theme = "corporate",
  candidate = null,
  colors = null,
  brandingPreference = "logo-name",
  logoSize = 100,
  headingSize = 100,
  bodyFontSize = 100,
  signatureSize = 100,
  spacing = 100,
  organization = {},
  advertisement = {},
  formData = {},
  signature = null,
  customContent = null,
}) {
  const activePalette = resolveOfferPalette(colors, theme);
  const TemplateComponent = themeTemplates?.[theme] || themeTemplates?.corporate;

  if (!TemplateComponent) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          color: "#666",
          fontFamily: "sans-serif",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Offer Letter</h2>
          <p style={{ fontSize: "14px" }}>Template is loading...</p>
        </div>
      </div>
    );
  }

  const joiningDate = formatLongDate(
    formData?.joiningDate,
    formatLongDate(getTodayDateInput())
  );
  const endingDate = formatLongDate(formData?.endingDate, "");

  const company = {
    name: organization?.name || "Your Company",
    logoUrl: organization?.logo?.url || organization?.logo || null,
    address: organization?.location || "",
    workLocation: advertisement?.location || organization?.location || "",
    email: organization?.email || "",
    phone: organization?.phone || "",
    website: organization?.website || "",
    offerDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    joiningDate,
    endingDate,
    department: advertisement?.department || "",
    employmentType: advertisement?.employmentType || "",
    internshipPaid: advertisement?.internshipPaid || "",
    workMode: advertisement?.workMode || "",
    salary: advertisement?.salary || "Competitive",
    experience: advertisement?.experience || "",
    position: advertisement?.jobTitle || candidate?.position || "Position",
  };

  const candidateData = {
    name: candidate?.name || "Candidate",
    email: candidate?.email || "candidate@email.com",
    phone: candidate?.phone || "",
    address: candidate?.address || "",
    position: candidate?.position || advertisement?.jobTitle || "Position",
    id: candidate?.applicationId || candidate?.id || "001",
  };

  return (
    <TemplateComponent
      colors={activePalette}
      brandingPreference={brandingPreference}
      logoSize={logoSize}
      headingSize={headingSize}
      bodyFontSize={bodyFontSize}
      signatureSize={signatureSize}
      spacing={spacing}
      candidate={candidateData}
      company={company}
      signature={signature}
      customContent={customContent}
    />
  );
}
