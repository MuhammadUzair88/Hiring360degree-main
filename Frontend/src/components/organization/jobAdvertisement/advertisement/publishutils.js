/**
 * organization/advertisement/publishUtils.js
 * ------------------------------------------------------------------
 * Helpers for the post-publish share screen. Kept separate from
 * pamphletUtils.js since these are about the social-share text/links,
 * not the pamphlet image itself.
 * ------------------------------------------------------------------
 */

/**
 * Builds the link that gets shared. There's no real backend endpoint
 * for a published job yet (see the TODO in pages/CreateAdvertisement.jsx),
 * so this falls back to the job listing page. Swap in the real public
 * job URL (ideally one with og:image set to the pamphlet) once the
 * publish endpoint returns an id/slug.
 */
export function buildApplyUrl(jobId) {
  if (typeof window === "undefined") return "";
  return jobId ? `${window.location.origin}/advertisement/job/${jobId}` : `${window.location.origin}/advertisement`;
}

export function buildSocialPostText({ jobTitle, organizationName, department, applyUrl }) {
  const title = jobTitle || "a new role";
  const org = organizationName || "our team";

  const intro = `🚀 We're hiring! Join ${org} as a ${title}.`;
  const body = department
    ? `We're looking for a ${title} to join our ${department} team — come help us build something great.`
    : `We're looking for a ${title} to join our team — come help us build something great.`;
  const cta = `Apply here: ${applyUrl}\n#Hiring #JobOpening #CareerOpportunity`;

  return [intro, body, cta].join("\n\n");
}

/**
 * LinkedIn and Facebook's share intents only accept a URL — they read
 * title/description/image from that page's Open Graph tags. Facebook
 * additionally accepts a `quote` param for pre-filled text. WhatsApp
 * accepts free-form pre-filled text including the link. There is no
 * builder for Instagram here; it has no web share-by-link intent.
 */
export function buildShareLinks({ text, url }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  };
}

export async function copyTextToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}