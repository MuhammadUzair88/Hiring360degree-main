import React from "react";
import { Building2 } from "lucide-react";
import { resolveOfferContent } from "./OfferLetterContent";

/* ─────────────────────────────────────────────────────────────
   DEFAULT DATA
───────────────────────────────────────────────────────────── */

export const DEFAULT_CANDIDATE = {
  name: "Candidate Name",
  email: "candidate@email.com",
  phone: "",
  address: "",
  position: "Job Title",
};

export const DEFAULT_COMPANY = {
  name: "Your Company Inc.",
  logoUrl: null,
  address: "123 Business Avenue, Suite 400, Hyderabad, Sindh, PK",
  email: "hr@yourcompany.com",
  phone: "+92 300 1234567",
  website: "www.yourcompany.com",
  socialLinks: {},
  offerDate: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  joiningDate: "August 1, 2026",
  endingDate: "",
  salary: "$85,000 / year",
  department: "Engineering",
  employmentType: "Full-time",
  internshipPaid: "",
  workMode: "On-site",
  experience: "",
  workLocation: "123 Business Avenue, Suite 400",
};

export const DEFAULT_OFFER_COLORS = {
  corporate: {
    primary: "#5B21B6",
    secondary: "#6B7280",
    text: "#1F2937",
    background: "#FFFFFF",
    accent: "#8B5CF6",
  },
  gradient: {
    primary: "#7C3AED",
    secondary: "#4F46E5",
    text: "#1E1B4B",
    background: "#FFFFFF",
    accent: "#22D3EE",
  },
  platinum: {
    primary: "#334155",
    secondary: "#64748B",
    text: "#1E293B",
    background: "#FFFFFF",
    accent: "#94A3B8",
  },
  minimal: {
    primary: "#111111",
    secondary: "#6B7280",
    text: "#1F1F1F",
    background: "#FFFFFF",
    accent: "#111111",
  },
  bold: {
    primary: "#6D28D9",
    secondary: "#8B5CF6",
    text: "#1E1B4B",
    background: "#F8FAFC",
    accent: "#4F46E5",
  },
  executive: {
    primary: "#0F4C3A",
    secondary: "#3F6F5E",
    text: "#1C1C1C",
    background: "#FFFFFF",
    accent: "#C9A24B",
  },
};

export function resolveOfferPalette(colors, theme = "corporate") {
  const fallback =
    DEFAULT_OFFER_COLORS[theme] || DEFAULT_OFFER_COLORS.corporate;

  // Backend stores one flat active palette. Older frontend builds may
  // still provide a theme-keyed object, so accept both shapes.
  if (colors?.primary) {
    return { ...fallback, ...colors };
  }

  if (colors?.[theme]?.primary) {
    return { ...fallback, ...colors[theme] };
  }

  return { ...fallback };
}

export const THEME_LIST = [
  { key: "corporate", label: "Corporate" },
  { key: "gradient", label: "Gradient" },
  { key: "platinum", label: "Platinum" },
  { key: "minimal", label: "Minimal" },
  { key: "bold", label: "Bold" },
  { key: "executive", label: "Executive" },
];

function exportSafeImageUrl(url) {
  if (!url) return "";

  const value = String(url);

  if (value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const separator = value.includes("?") ? "&" : "?";
  return `${value}${separator}offer_export=1`;
}

/* ─────────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────────── */

export function BrandMark({
  brandingPreference,
  companyName,
  logoUrl,
  colors,
  logoSize,
}) {
  const showLogo =
    brandingPreference === "logo-only" || brandingPreference === "logo-name";
  const showName =
    brandingPreference === "name-only" || brandingPreference === "logo-name";
  const logoPx = Math.round(40 * (logoSize / 100));

  return (
    <div className="flex items-center gap-3">
      {showLogo &&
        (logoUrl ? (
          <img
            src={exportSafeImageUrl(logoUrl)}
            alt={companyName}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{
              width: logoPx,
              height: logoPx,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          <div
            className="rounded-lg flex items-center justify-center shrink-0"
            style={{
              width: logoPx,
              height: logoPx,
              backgroundColor: colors.primary + "1a",
              border: `1px solid ${colors.primary}40`,
            }}
          >
            <Building2
              style={{
                width: logoPx * 0.55,
                height: logoPx * 0.55,
                color: colors.primary,
              }}
            />
          </div>
        ))}
      {showName && (
        <span
          className="font-bold tracking-tight"
          style={{
            color: colors.primary,
            fontSize: Math.max(15, 17 * (logoSize / 100)),
          }}
        >
          {companyName}
        </span>
      )}
    </div>
  );
}

export function WatermarkMark({
  logoUrl,
  color,
  size = 210,
  opacity = 0.09,
  className = "",
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {logoUrl ? (
        <img
          src={exportSafeImageUrl(logoUrl)}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          alt=""
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      ) : (
        <Building2 style={{ width: size, height: size, color }} />
      )}
    </div>
  );
}

export function CompanyFooter({ company, colors, variant = "rule" }) {
  const contact = [company.phone, company.email, company.website]
    .filter(Boolean)
    .join("  ·  ");
  const line = [company.address, contact].filter(Boolean).join("   ·   ");

  switch (variant) {
    case "gradient-band":
      return (
        <div
          className="text-center text-[9px] text-white py-2 px-2"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
          }}
        >
          <p className="font-medium">{company.name}</p>
          <p className="opacity-90">{line}</p>
        </div>
      );
    case "block-accent":
      return (
        <div
          className="text-center text-[9px] text-white py-2 px-2"
          style={{ backgroundColor: colors.primary }}
        >
          <p>{line}</p>
        </div>
      );
    case "mono-line":
      return (
        <p
          className="text-[9px] text-center mt-3"
          style={{ color: colors.secondary }}
        >
          {line}
        </p>
      );
    case "rule":
      return (
        <p
          className="text-[9px] mt-4 pt-3"
          style={{
            color: colors.secondary,
            borderTop: `1px solid ${colors.text}15`,
          }}
        >
          {line}
        </p>
      );
    case "split-bar":
      return (
        <div
          className="flex items-center justify-between text-[9px] pt-3 mt-3"
          style={{
            borderTop: `1px solid ${colors.primary}30`,
            color: colors.secondary,
          }}
        >
          <span className="font-medium" style={{ color: colors.primary }}>
            {company.name}
          </span>
          <span>{contact}</span>
        </div>
      );
    default:
      return (
        <p className="text-[10px] mt-1.5" style={{ color: colors.secondary }}>
          {line}
        </p>
      );
  }
}

function SignatureMark({ signature, signatureSize, height, fontSize, style }) {
  const imgSrc = signature?.url || signature?.previewUrl;

  if (imgSrc) {
    return (
      <img
        src={exportSafeImageUrl(imgSrc)}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        alt="Signature"
        className="object-contain mb-1"
        style={{
          height: `${height * (signatureSize / 100)}px`,
        }}
      />
    );
  }

  return (
    <p
      style={{
        fontSize: `${fontSize * (signatureSize / 100)}px`,
        color: style?.color || "#333",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontStyle: "italic",
        letterSpacing: "0.3px",
        marginBottom: "4px",
      }}
    >
      {style?.name || "Company Name"}
    </p>
  );
}

function OrgSignature({
  signature,
  signatureSize,
  height,
  fontSize,
  colors,
  companyName,
}) {
  return (
    <div>
      <SignatureMark
        signature={signature}
        signatureSize={signatureSize}
        height={height}
        fontSize={fontSize}
        style={{ color: colors.primary, name: companyName }}
      />
      <div
        className="w-36 h-px mb-1"
        style={{ backgroundColor: colors.text }}
      />
      <p className="text-[11px] font-semibold" style={{ color: colors.text }}>
        {companyName}
      </p>
      <p className="text-[10px]" style={{ color: colors.secondary }}>
        Company Signatory
      </p>
    </div>
  );
}

function CandidateSignature({ sigHeight, colors, candidateName }) {
  return (
    <div className="text-right">
      <div style={{ height: sigHeight }} />
      <div
        className="w-36 h-px mb-1 ml-auto"
        style={{ backgroundColor: colors.text }}
      />
      <p className="text-[11px] font-semibold" style={{ color: colors.text }}>
        {candidateName}
      </p>
      <p className="text-[10px]" style={{ color: colors.secondary }}>
        Candidate Signature
      </p>
    </div>
  );
}

function JoiningEndingLine({ company, colors }) {
  if (!company.joiningDate || company.joiningDate === "To be confirmed")
    return null;
  return (
    <p className="mb-3 text-justify">
      You are invited to join on{" "}
      <strong style={{ color: colors.primary }}>{company.joiningDate}</strong>
      {company.endingDate ? (
        <>
          , and your engagement with us will conclude on{" "}
          <strong style={{ color: colors.primary }}>
            {company.endingDate}
          </strong>
          .
        </>
      ) : (
        "."
      )}
    </p>
  );
}

function AdditionalFieldsBlock({ heading, fields, colors }) {
  if (!fields || fields.length === 0) return null;
  return (
    <p className="mb-3 text-justify">
      <span className="font-semibold" style={{ color: colors.primary }}>
        {heading}.{" "}
      </span>
      {fields.map((f, i) => (
        <React.Fragment key={f.id || i}>
          {f.label ? <span className="font-semibold">{f.label}: </span> : null}
          <span>{f.value}</span>
          {i < fields.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </p>
  );
}

function useLetterData({ candidate, company }) {
  const mergedCompany = { ...DEFAULT_COMPANY, ...company };
  return {
    candidate: { ...DEFAULT_CANDIDATE, ...candidate },
    company: mergedCompany,
  };
}

/* ─────────────────────────────────────────────────────────────
   TEMPLATE RENDERER
───────────────────────────────────────────────────────────── */

function OfferLetterTemplate({ selectedTheme, ...props }) {
  const {
    colors,
    brandingPreference,
    logoSize = 145,
    headingSize = 145,
    bodyFontSize = 150,
    signatureSize = 120,
    spacing = 100,
    candidate,
    company,
    signature,
    customContent,
  } = props;

  const { candidate: c, company: co } = useLetterData({ candidate, company });
  const content = resolveOfferContent({
    candidate: c,
    company: co,
    customContent,
  });

  // ── 1. CORPORATE ──────────────────────────────────────────────
  function renderTheme1() {
    const bodyFont = 12 * (bodyFontSize / 100);
    const pad = 44 * (spacing / 100);
    const sigHeight = 36 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex flex-col relative"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          padding: pad,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <WatermarkMark
          logoUrl={co.logoUrl}
          color={colors.primary}
          size={220}
          opacity={0.09}
        />
        <div
          className="relative z-10 flex items-start justify-between pb-3"
          style={{ borderBottom: `2px solid ${colors.primary}` }}
        >
          <BrandMark
            brandingPreference={brandingPreference}
            companyName={co.name}
            logoUrl={co.logoUrl}
            colors={colors}
            logoSize={logoSize}
          />
          <div className="text-right">
            <p
              style={{
                fontSize: 15 * (headingSize / 100),
                color: colors.primary,
              }}
              className="font-bold tracking-wide"
            >
              {content.heading || "OFFER LETTER"}
            </p>
            <p className="text-[11px] mt-1" style={{ color: colors.secondary }}>
              Date: {co.offerDate}
            </p>
          </div>
        </div>
        <CompanyFooter company={co} colors={colors} variant="header-line" />
        <div
          className="relative z-10 mt-5 flex-1"
          style={{ fontSize: bodyFont, lineHeight: "1.55" }}
        >
          <p className="mb-1">To:</p>
          <p className="font-bold mb-0.5">{c.name}</p>
          {c.address && (
            <p className="mb-0.5" style={{ color: colors.secondary }}>
              {c.address}
            </p>
          )}
          <p className="mb-4" style={{ color: colors.secondary }}>
            {c.email}
            {c.phone ? ` · ${c.phone}` : ""}
          </p>
          <p className="font-bold underline mb-4">
            Subject: {content.roleLabel || "Offer of Employment"}
          </p>
          <p className="mb-3">
            Dear <strong>{c.name}</strong>,
          </p>
          <p className="mb-3 text-justify">{content.paragraph1}</p>
          <p className="mb-3 text-justify">{content.paragraph2}</p>
          <JoiningEndingLine company={co} colors={colors} />
          <p className="mb-3 text-justify">
            This offer is contingent upon successful completion of all pre-
            {content.isInternship ? "placement" : "employment"} requirements,
            including document verification and any additional onboarding
            formalities required by the company.
          </p>
          <AdditionalFieldsBlock
            heading={content.fieldsSectionLabel}
            fields={content.additionalFields}
            colors={colors}
          />
          <p className="mb-4 text-justify">{content.paragraph3}</p>
          <p className="mb-1">Sincerely,</p>
          <div
            className="mt-3 pt-3 flex items-end justify-between"
            style={{ borderTop: `1px solid ${colors.primary}20` }}
          >
            <OrgSignature
              signature={signature}
              signatureSize={signatureSize}
              height={36}
              fontSize={18}
              colors={colors}
              companyName={co.name}
            />
            <CandidateSignature
              sigHeight={sigHeight}
              colors={colors}
              candidateName={c.name}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── 2. GRADIENT ──────────────────────────────────────────────
  function renderTheme2() {
    const bodyFont = 12 * (bodyFontSize / 100);
    const pad = 40 * (spacing / 100);
    const sigHeight = 34 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex flex-col"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: pad,
            paddingBottom: pad * 0.6,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
        >
          <BrandMark
            brandingPreference={brandingPreference}
            companyName={co.name}
            logoUrl={co.logoUrl}
            colors={{ ...colors, primary: "#ffffff" }}
            logoSize={logoSize}
          />
          <div className="text-right text-white/90">
            <p
              style={{ fontSize: 14 * (headingSize / 100) }}
              className="font-semibold italic"
            >
              {content.roleLabel || "Offer of Employment"}
            </p>
            <p className="text-[10px] opacity-80 mt-0.5">{co.offerDate}</p>
          </div>
        </div>
        <div className="relative flex-1" style={{ padding: pad }}>
          <WatermarkMark
            logoUrl={co.logoUrl}
            color={colors.primary}
            size={200}
            opacity={0.09}
          />
          <div
            className="relative z-10"
            style={{ fontSize: bodyFont, lineHeight: "1.55" }}
          >
            <p className="text-[10px] mb-4" style={{ color: colors.secondary }}>
              Prepared for <strong>{c.name}</strong> · {c.email}
              {c.phone ? ` · ${c.phone}` : ""}
            </p>
            <p className="mb-3">
              Dear <strong style={{ color: colors.primary }}>{c.name}</strong>,
            </p>
            <p className="mb-3 text-justify">{content.paragraph1}</p>
            <p className="mb-3 text-justify">{content.paragraph2}</p>
            <JoiningEndingLine company={co} colors={colors} />
            <AdditionalFieldsBlock
              heading={content.fieldsSectionLabel}
              fields={content.additionalFields}
              colors={colors}
            />
            <p className="mb-4 text-justify">{content.paragraph3}</p>
            <p className="mb-1">Warm Regards,</p>
            <p
              className="text-right text-[10px] mb-1"
              style={{ color: colors.secondary }}
            >
              OFFER-{c.id || "001"}
            </p>
            <div
              className="mt-3 pt-3 flex items-end justify-between"
              style={{ borderTop: `1px solid ${colors.primary}25` }}
            >
              <OrgSignature
                signature={signature}
                signatureSize={signatureSize}
                height={34}
                fontSize={17}
                colors={colors}
                companyName={co.name}
              />
              <CandidateSignature
                sigHeight={sigHeight}
                colors={colors}
                candidateName={c.name}
              />
            </div>
          </div>
        </div>
        <CompanyFooter company={co} colors={colors} variant="gradient-band" />
      </div>
    );
  }

  // ── 3. PLATINUM ──────────────────────────────────────────────
  function renderTheme3() {
    const bodyFont = 12 * (bodyFontSize / 100);
    const pad = 44 * (spacing / 100);
    const sigHeight = 34 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex flex-col relative"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          padding: pad,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${colors.primary} 0%, transparent 70%)`,
          }}
        />
        <WatermarkMark
          logoUrl={co.logoUrl}
          color={colors.accent}
          size={210}
          opacity={0.06}
        />
        <div
          className="relative z-10 flex items-center justify-between pb-3"
          style={{ borderBottom: `1px solid ${colors.accent}60` }}
        >
          <BrandMark
            brandingPreference={brandingPreference}
            companyName={co.name}
            logoUrl={co.logoUrl}
            colors={colors}
            logoSize={logoSize}
          />
          <div className="text-right">
            <p
              className="text-[10px] font-semibold"
              style={{ color: colors.primary }}
            >
              {co.offerDate}
            </p>
            <p className="text-[9px]" style={{ color: colors.secondary }}>
              OFFER-{c.id || "001"}
            </p>
          </div>
        </div>
        <div
          className="relative z-10 mt-5 flex-1"
          style={{ fontSize: bodyFont, lineHeight: "1.55" }}
        >
          <p className="text-[10px] mb-4" style={{ color: colors.secondary }}>
            To: {c.name} · {c.email}
            {c.phone ? ` · ${c.phone}` : ""}
          </p>
          <h1
            style={{
              fontSize: 18 * (headingSize / 100),
              color: colors.primary,
            }}
            className="font-bold uppercase tracking-widest mb-4"
          >
            {content.heading || "OFFER LETTER"}
          </h1>
          <p className="mb-3">
            Dear <strong style={{ color: colors.primary }}>{c.name}</strong>,
          </p>
          <p className="mb-3 text-justify">{content.paragraph1}</p>
          <p className="mb-3 text-justify">{content.paragraph2}</p>
          <JoiningEndingLine company={co} colors={colors} />
          <AdditionalFieldsBlock
            heading={content.fieldsSectionLabel}
            fields={content.additionalFields}
            colors={colors}
          />
          <p className="mb-4 text-justify">{content.paragraph3}</p>
          <p className="mb-1">Yours Faithfully,</p>
          <div
            className="mt-4 pt-3 flex items-end justify-between"
            style={{ borderTop: `1px solid ${colors.accent}40` }}
          >
            <OrgSignature
              signature={signature}
              signatureSize={signatureSize}
              height={34}
              fontSize={17}
              colors={colors}
              companyName={co.name}
            />
            <CandidateSignature
              sigHeight={sigHeight}
              colors={colors}
              candidateName={c.name}
            />
          </div>
        </div>
        <CompanyFooter company={co} colors={colors} variant="mono-line" />
      </div>
    );
  }

  // ── 4. MINIMAL ──────────────────────────────────────────────
  function renderTheme4() {
    const bodyFont = 12.5 * (bodyFontSize / 100);
    const pad = 56 * (spacing / 100);
    const sigHeight = 32 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex flex-col relative"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          padding: pad,
          fontFamily: "'Helvetica', 'Arial', sans-serif",
        }}
      >
        <WatermarkMark
          logoUrl={co.logoUrl}
          color={colors.primary}
          size={190}
          opacity={0.07}
        />
        <div
          className="relative z-10 pb-5"
          style={{ borderBottom: `1px solid ${colors.text}20` }}
        >
          <BrandMark
            brandingPreference={brandingPreference}
            companyName={co.name}
            logoUrl={co.logoUrl}
            colors={colors}
            logoSize={logoSize}
          />
          <p
            className="text-[10px] uppercase tracking-[0.2em] mt-2"
            style={{ color: colors.secondary }}
          >
            {co.offerDate}
          </p>
        </div>
        <div
          className="relative z-10 mt-6 flex-1"
          style={{ fontSize: bodyFont, lineHeight: "1.9" }}
        >
          <p className="text-[10px] mb-5" style={{ color: colors.secondary }}>
            {c.name} · {c.email}
            {c.phone ? ` · ${c.phone}` : ""}
          </p>
          <h1
            style={{ fontSize: 20 * (headingSize / 100) }}
            className="font-light tracking-tight mb-5"
          >
            {content.roleLabel || "Offer of Employment"}
          </h1>
          <p className="mb-3">Dear {c.name},</p>
          <p className="mb-4 text-justify">{content.paragraph1}</p>
          <p className="mb-4 text-justify">{content.paragraph2}</p>
          <JoiningEndingLine company={co} colors={colors} />
          <AdditionalFieldsBlock
            heading={content.fieldsSectionLabel}
            fields={content.additionalFields}
            colors={colors}
          />
          <p className="mb-5 text-justify">{content.paragraph3}</p>
          <p className="mb-1">Best Regards,</p>
          <p
            className="text-right text-[10px] mb-1"
            style={{ color: colors.secondary }}
          >
            OFFER-{c.id || "001"}
          </p>
          <div
            className="mt-4 pt-4"
            style={{ borderTop: `1px solid ${colors.text}15` }}
          >
            <div className="flex items-end justify-between">
              <OrgSignature
                signature={signature}
                signatureSize={signatureSize}
                height={32}
                fontSize={16}
                colors={colors}
                companyName={co.name}
              />
              <CandidateSignature
                sigHeight={sigHeight}
                colors={colors}
                candidateName={c.name}
              />
            </div>
          </div>
        </div>
        <CompanyFooter company={co} colors={colors} variant="rule" />
      </div>
    );
  }

  // ── 5. BOLD ──────────────────────────────────────────────
  function renderTheme5() {
    const bodyFont = 12 * (bodyFontSize / 100);
    const pad = 40 * (spacing / 100);
    const sigHeight = 34 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex flex-col relative"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: pad,
            paddingBottom: pad * 0.7,
            backgroundColor: colors.primary,
          }}
        >
          <BrandMark
            brandingPreference={brandingPreference}
            companyName={co.name}
            logoUrl={co.logoUrl}
            colors={{ ...colors, primary: "#ffffff" }}
            logoSize={logoSize}
          />
          <div className="text-right text-white">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              OFFER
            </span>
            <p className="text-[10px] mt-1 opacity-90">{co.offerDate}</p>
          </div>
        </div>
        <div className="relative flex-1" style={{ padding: pad }}>
          <WatermarkMark
            logoUrl={co.logoUrl}
            color={colors.primary}
            size={210}
            opacity={0.08}
          />
          <div
            className="relative z-10"
            style={{ fontSize: bodyFont, lineHeight: "1.55" }}
          >
            <p className="text-[10px] mb-4" style={{ color: colors.secondary }}>
              Recipient: {c.name} ({c.email}
              {c.phone ? `, ${c.phone}` : ""})
            </p>
            <h1
              style={{
                fontSize: 20 * (headingSize / 100),
                color: colors.primary,
              }}
              className="font-black uppercase mb-4 tracking-tight"
            >
              {content.roleLabel || "Offer of Employment"}
            </h1>
            <p className="mb-3">
              Dear <strong style={{ color: colors.primary }}>{c.name}</strong>,
            </p>
            <p className="mb-3 text-justify">{content.paragraph1}</p>
            <p className="mb-3 text-justify">{content.paragraph2}</p>
            <JoiningEndingLine company={co} colors={colors} />
            <AdditionalFieldsBlock
              heading={content.fieldsSectionLabel}
              fields={content.additionalFields}
              colors={colors}
            />
            <p className="mb-4 text-justify">{content.paragraph3}</p>
            <p className="mb-1">Sincerely,</p>
            <div
              className="mt-4 pt-3 flex items-end justify-between"
              style={{ borderTop: `2px solid ${colors.primary}25` }}
            >
              <OrgSignature
                signature={signature}
                signatureSize={signatureSize}
                height={34}
                fontSize={17}
                colors={colors}
                companyName={co.name}
              />
              <CandidateSignature
                sigHeight={sigHeight}
                colors={colors}
                candidateName={c.name}
              />
            </div>
          </div>
        </div>
        <CompanyFooter company={co} colors={colors} variant="block-accent" />
      </div>
    );
  }

  // ── 6. EXECUTIVE ──────────────────────────────────────────────
  function renderTheme6() {
    const bodyFont = 12 * (bodyFontSize / 100);
    const pad = 42 * (spacing / 100);
    const sigHeight = 34 * (signatureSize / 100);

    return (
      <div
        className="w-full h-full flex relative"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div
          className="shrink-0"
          style={{ width: 14, backgroundColor: colors.primary }}
        />
        <div className="flex-1 relative flex flex-col" style={{ padding: pad }}>
          <WatermarkMark
            logoUrl={co.logoUrl}
            color={colors.primary}
            size={200}
            opacity={0.08}
          />
          <div
            className="relative z-10 flex flex-col items-center text-center pb-4"
            style={{ borderBottom: `1px solid ${colors.primary}30` }}
          >
            <BrandMark
              brandingPreference={brandingPreference}
              companyName={co.name}
              logoUrl={co.logoUrl}
              colors={colors}
              logoSize={logoSize}
            />
            <p
              style={{
                fontSize: 11 * (headingSize / 100),
                color: colors.accent,
              }}
              className="uppercase tracking-[0.3em] mt-3 font-semibold"
            >
              {content.roleLabel || "Offer of Employment"}
            </p>
            <p className="text-[10px] mt-1" style={{ color: colors.secondary }}>
              {co.offerDate}
            </p>
          </div>
          <div
            className="relative z-10 mt-6 flex-1"
            style={{ fontSize: bodyFont, lineHeight: "1.6" }}
          >
            <div
              className="flex justify-between text-[10px] mb-5"
              style={{ color: colors.secondary }}
            >
              <div>
                <p className="font-semibold" style={{ color: colors.text }}>
                  {c.name}
                </p>
                {c.address && <p>{c.address}</p>}
                <p>
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p>Position: {c.position}</p>
              </div>
            </div>
            <p className="mb-3">
              Dear <strong style={{ color: colors.primary }}>{c.name}</strong>,
            </p>
            <p className="mb-3 text-justify">{content.paragraph1}</p>
            <p className="mb-3 text-justify">{content.paragraph2}</p>
            <JoiningEndingLine company={co} colors={colors} />
            <AdditionalFieldsBlock
              heading={content.fieldsSectionLabel}
              fields={content.additionalFields}
              colors={colors}
            />
            <p className="mb-4 text-justify">{content.paragraph3}</p>
            <p className="mb-1">Yours sincerely,</p>
            <div
              className="mt-4 pt-3 flex items-end justify-between"
              style={{ borderTop: `1px solid ${colors.primary}20` }}
            >
              <OrgSignature
                signature={signature}
                signatureSize={signatureSize}
                height={34}
                fontSize={18}
                colors={colors}
                companyName={co.name}
              />
              <CandidateSignature
                sigHeight={sigHeight}
                colors={colors}
                candidateName={c.name}
              />
            </div>
            <CompanyFooter company={co} colors={colors} variant="split-bar" />
          </div>
        </div>
      </div>
    );
  }

  const themeRenderers = {
    1: renderTheme1,
    2: renderTheme2,
    3: renderTheme3,
    4: renderTheme4,
    5: renderTheme5,
    6: renderTheme6,
  };

  return themeRenderers[selectedTheme]?.() || renderTheme1();
}

/* ─────────────────────────────────────────────────────────────
   Theme Exports
───────────────────────────────────────────────────────────── */

const THEME_KEY_TO_ID = {
  corporate: 1,
  gradient: 2,
  platinum: 3,
  minimal: 4,
  bold: 5,
  executive: 6,
};

export function CorporateTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.corporate} {...props} />
  );
}
export function GradientTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.gradient} {...props} />
  );
}
export function PlatinumTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.platinum} {...props} />
  );
}
export function MinimalTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.minimal} {...props} />
  );
}
export function BoldTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.bold} {...props} />
  );
}
export function ExecutiveTemplate(props) {
  return (
    <OfferLetterTemplate selectedTheme={THEME_KEY_TO_ID.executive} {...props} />
  );
}

export const themeTemplates = {
  corporate: CorporateTemplate,
  gradient: GradientTemplate,
  platinum: PlatinumTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  executive: ExecutiveTemplate,
};
