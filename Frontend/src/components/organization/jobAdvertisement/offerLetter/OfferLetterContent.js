// src/components/organization/jobAdvertisement/offerLetter/OfferLetterContent.js

/**
 * Job-type-adaptive offer letter content generation.
 */

function normalize(str = "") {
  return str.toString().trim().toLowerCase();
}

let fieldIdSeq = 0;

function generateFieldId() {
  fieldIdSeq += 1;
  return `field_${Date.now().toString(36)}_${fieldIdSeq}`;
}

export function classifyEmploymentType(employmentType = "", internshipPaid = "") {
  const type = normalize(employmentType);
  const paid = normalize(internshipPaid);

  if (type.includes("intern")) {
    return paid === "unpaid" ? "unpaid-internship" : "paid-internship";
  }
  if (type.includes("contract")) return "contract";
  if (type.includes("part")) return "part-time";
  if (type.includes("full")) return "full-time";
  return "other";
}

export const JOB_KIND_LABELS = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  contract: "Contract",
  "paid-internship": "Paid Internship",
  "unpaid-internship": "Unpaid Internship",
  other: "General",
};

const ROLE_LABELS = {
  "full-time": "Offer of Employment",
  "part-time": "Offer of Part-Time Employment",
  contract: "Contract Offer of Employment",
  "paid-internship": "Paid Internship Offer",
  "unpaid-internship": "Unpaid Internship Offer",
  other: "Offer Letter",
};

const LETTER_HEADINGS = {
  "full-time": "JOB OFFER LETTER",
  "part-time": "JOB OFFER LETTER",
  contract: "CONTRACT OFFER LETTER",
  "paid-internship": "INTERNSHIP OFFER LETTER",
  "unpaid-internship": "INTERNSHIP OFFER LETTER",
  other: "OFFER LETTER",
};

export const ADDITIONAL_FIELDS_SECTION_LABEL = {
  "full-time": "Compensation & Benefits",
  "part-time": "Compensation & Benefits",
  contract: "Contract Terms & Benefits",
  "paid-internship": "Internship Benefits & Certificate",
  "unpaid-internship": "Internship Benefits & Certificate",
  other: "Additional Information",
};

function defaultAdditionalFields(kind, company) {
  const raw = (() => {
    switch (kind) {
      case "full-time":
        return [
          {
            label: "Health Insurance",
            value: `Comprehensive health insurance coverage for you, in accordance with ${company.name}'s policy.`
          },
          {
            label: "Performance Bonus",
            value: "You will be eligible for periodic performance-based bonuses, subject to company and individual performance."
          },
          {
            label: "Paid Leave",
            value: "Annual paid leave, sick leave, and public holidays in accordance with company policy."
          },
          {
            label: "Employee Benefits",
            value: `Access to additional employee perks and benefits as per ${company.name}'s policies.`
          },
        ];
      case "part-time":
        return [
          {
            label: "Employee Benefits",
            value: `You will be eligible for applicable part-time employee benefits in accordance with ${company.name}'s policies.`
          },
        ];
      case "contract":
        return [
          {
            label: "Contract Terms",
            value: `This engagement is governed by the terms outlined in this offer and the accompanying contract agreement with ${company.name}.`
          },
          {
            label: "Renewal Conditions",
            value: "This contract may be renewed or extended by mutual agreement, subject to performance and business needs."
          },
        ];
      case "paid-internship":
        return [
          {
            label: "Internship Certificate",
            value: "You will receive an internship completion certificate and a letter of recommendation upon successful completion, subject to satisfactory performance."
          },
          {
            label: "Stipend Details",
            value: `A monthly stipend of ${company.salary} will be provided for the duration of the internship.`
          },
        ];
      case "unpaid-internship":
        return [
          {
            label: "Internship Completion Certificate",
            value: "You will receive an internship completion certificate upon successfully completing the internship, along with mentorship and hands-on project experience."
          },
        ];
      default:
        return [
          {
            label: "Additional Benefits",
            value: "Any additional benefits applicable to this role will be communicated separately by HR."
          },
        ];
    }
  })();

  return raw.map((f) => ({ id: generateFieldId(), ...f }));
}

export function buildDefaultOfferContent({ candidate, company }) {
  const kind = classifyEmploymentType(company.employmentType, company.internshipPaid);
  const isInternship = kind === "paid-internship" || kind === "unpaid-internship";
  const endingClause = company.endingDate
    ? ` and conclude on ${company.endingDate}`
    : "";

  const templates = {
    "full-time": {
      paragraph1: `We are delighted to extend to you an offer of employment for the position of ${company.position} at ${company.name}. Following a thorough evaluation of your qualifications and interview performance, we are pleased to welcome you to our ${company.department} team.`,
      paragraph2: `Your employment will commence on ${company.joiningDate}. This is a full-time, ${company.workMode} position based at ${company.workLocation}, and continues on an ongoing basis subject to the terms of our employment policies. Your monthly gross salary will be ${company.salary}, payable in accordance with the company's standard payroll schedule.`,
      paragraph3: `We are excited about the opportunity to have you join our organization and look forward to a successful, long-term working relationship.`,
    },
    "part-time": {
      paragraph1: `We are pleased to offer you a part-time position as ${company.position} at ${company.name}. We were impressed by your qualifications and interview performance, and look forward to having you join our ${company.department} team.`,
      paragraph2: `Your employment will commence on ${company.joiningDate}. This is a part-time, ${company.workMode} position based at ${company.workLocation}. Your compensation will be ${company.salary}, payable in accordance with the company's standard payroll schedule.`,
      paragraph3: `We look forward to a productive and mutually rewarding working relationship with you.`,
    },
    contract: {
      paragraph1: `We are pleased to offer you a contract engagement for the position of ${company.position} with ${company.name}. Your experience and interview performance stood out during our evaluation, and we look forward to your contribution to our ${company.department} team on this fixed-term basis.`,
      paragraph2: `Your engagement will commence on ${company.joiningDate}${endingClause}, unless extended or terminated earlier in accordance with the terms of this agreement. This is a contract, ${company.workMode} engagement based at ${company.workLocation}. You will receive compensation of ${company.salary}, payable in accordance with the schedule agreed with ${company.name}.`,
      paragraph3: `We look forward to a productive engagement and to the value your work will bring to ${company.name} during this contract period.`,
    },
    "paid-internship": {
      paragraph1: `We are excited to offer you a paid internship position as ${company.position} at ${company.name}. Your application and interview reflected strong potential, and we're pleased to invite you to gain hands-on experience with our ${company.department} team.`,
      paragraph2: `Your internship will commence on ${company.joiningDate}${endingClause}. This is a ${company.workMode} internship based at ${company.workLocation}. During your internship, you will receive a monthly stipend of ${company.salary} in recognition of your contribution to the team.`,
      paragraph3: `We're excited to have you join our team for this internship and look forward to supporting your growth throughout the program.`,
    },
    "unpaid-internship": {
      paragraph1: `We are pleased to offer you an unpaid internship position as ${company.position} at ${company.name}. This internship is designed to give you meaningful, hands-on learning and professional development experience within our ${company.department} team.`,
      paragraph2: `Your internship will commence on ${company.joiningDate}${endingClause}. This is a ${company.workMode} unpaid learning placement based at ${company.workLocation}. This is an unpaid internship and does not carry a monetary stipend or salary.`,
      paragraph3: `We're glad to offer you this learning opportunity and look forward to supporting your development throughout your time with us.`,
    },
    other: {
      paragraph1: `We are pleased to offer you the position of ${company.position} at ${company.name}. We were impressed by your qualifications and interview performance and look forward to having you join our ${company.department} team.`,
      paragraph2: `This role will commence on ${company.joiningDate}${endingClause} and is based at ${company.workLocation}. Your compensation will be ${company.salary}.`,
      paragraph3: `We look forward to working with you and to a successful working relationship.`,
    },
  };

  const t = templates[kind] || templates.other;

  return {
    kind,
    roleLabel: ROLE_LABELS[kind] || ROLE_LABELS.other,
    heading: LETTER_HEADINGS[kind] || LETTER_HEADINGS.other,
    fieldsSectionLabel: ADDITIONAL_FIELDS_SECTION_LABEL[kind] || ADDITIONAL_FIELDS_SECTION_LABEL.other,
    isInternship,
    paragraph1: t.paragraph1,
    paragraph2: t.paragraph2,
    paragraph3: t.paragraph3,
    additionalFields: defaultAdditionalFields(kind, company),
  };
}

export function resolveOfferContent({ candidate, company, customContent }) {
  const defaults = buildDefaultOfferContent({ candidate, company });
  if (!customContent) return defaults;

  return {
    ...defaults,
    paragraph1: customContent.paragraph1?.trim()
      ? customContent.paragraph1
      : defaults.paragraph1,
    paragraph2: customContent.paragraph2?.trim()
      ? customContent.paragraph2
      : defaults.paragraph2,
    paragraph3: customContent.paragraph3?.trim()
      ? customContent.paragraph3
      : defaults.paragraph3,
    fieldsSectionLabel: customContent.fieldsSectionLabel?.trim()
      ? customContent.fieldsSectionLabel
      : defaults.fieldsSectionLabel,
    additionalFields: Array.isArray(customContent.additionalFields)
      ? customContent.additionalFields.filter(
          (f) => f && (f.label?.trim() || f.value?.trim())
        )
      : defaults.additionalFields,
  };
}