import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

export const publishModalCopy = {
  title: "Job Published Successfully!",
  subtitle: "Your job advertisement is now live and ready to receive applications.",
};

/** Keys match what PublishSuccessModal builds into `summaryValues`. */
export const publishSummaryFields = [
  { key: "jobTitle", label: "Job Title" },
  { key: "organizationName", label: "Organization" },
  { key: "department", label: "Department" },
];

/**
 * Generic icons only — this project's lucide-react version doesn't
 * export brand icons (Facebook / Linkedin / Instagram), which is why
 * createadvertisementdata.js's own publishRoutingTips already uses
 * Link2 for LinkedIn and Share2 for Facebook. Matched that same
 * convention here instead of the brand glyphs.
 *
 * "instagram" has no share-by-link intent on any platform — its
 * button is handled as a special case in SharePlatformButtons
 * (copies the caption, opens instagram.com) rather than opening a
 * share URL like the other three.
 */


export const sharePlatforms = [
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { key: "facebook", label: "Facebook", icon: FaFacebook },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { key: "instagram", label: "Instagram", icon: FaInstagram },
];
