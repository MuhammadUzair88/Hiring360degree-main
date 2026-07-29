/* ────────────────────────────────────────────────────────────────────
   DATE HELPERS
──────────────────────────────────────────────────────────────────── */

/**
 * Formats an ISO date string ("2026-08-15") for display ("Aug 15, 2026").
 * Returns the raw input unchanged if it isn't a parseable date, and an
 * empty string for empty input.
 */
export function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * True if this employment type needs an "ending date" field on the
 * offer letter (contract roles and internships; regular full-time /
 * part-time roles don't).
 */
export function requiresEndingDate(employmentType = "") {
  const type = String(employmentType).trim().toLowerCase();
  return type.includes("contract") || type.includes("intern");
}

/**
 * Suggests an ending date from a joining date + the advertisement's
 * stated duration (e.g. advertisement.internshipDuration = "3 months",
 * "6 weeks", "2 years"). Falls back to +6 months if no duration is set.
 * Returns "" if joiningDate is missing/invalid.
 */
export function calculateEndingDate(joiningDate, advertisement = {}) {
  if (!joiningDate) return "";
  const start = new Date(joiningDate);
  if (Number.isNaN(start.getTime())) return "";

  const durationStr = advertisement?.internshipDuration || "";
  const match = durationStr.match(/(\d+)\s*(day|week|month|year)/i);

  const end = new Date(start);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit === "day") end.setDate(end.getDate() + amount);
    else if (unit === "week") end.setDate(end.getDate() + amount * 7);
    else if (unit === "month") end.setMonth(end.getMonth() + amount);
    else if (unit === "year") end.setFullYear(end.getFullYear() + amount);
  } else {
    end.setMonth(end.getMonth() + 6); // sensible default when no duration is stated
  }

  return end.toISOString().split("T")[0];
}

/* ────────────────────────────────────────────────────────────────────
   FILE HELPERS
──────────────────────────────────────────────────────────────────── */

/**
 * Reads a File (e.g. an uploaded signature image) into a base64 data
 * URL so it can be stored/previewed without a backend upload step.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Triggers a browser download of a data URL.
 * @param {string} dataUrl
 * @param {string} filename
 */
export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ────────────────────────────────────────────────────────────────────
   DOM-TO-PNG EXPORT (no external library)
──────────────────────────────────────────────────────────────────── */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to render captured content"));
    img.src = src;
  });
}

// Recursively copies computed styles from the live node onto its clone
// so the exported image matches on-screen rendering (Tailwind classes
// resolve to computed CSS, but a cloned/detached node doesn't carry
// that computed styling on its own).
function inlineComputedStyles(source, target) {
  const computed = window.getComputedStyle(source);
  let cssText = "";
  for (let i = 0; i < computed.length; i += 1) {
    const prop = computed[i];
    cssText += `${prop}:${computed.getPropertyValue(prop)};`;
  }
  target.setAttribute("style", cssText);

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let i = 0; i < sourceChildren.length; i += 1) {
    inlineComputedStyles(sourceChildren[i], targetChildren[i]);
  }
}

/**
 * Renders a DOM element (by id) to a PNG data URL. Used to turn the
 * live A4Preview letter into a downloadable/printable image.
 * @param {string} elementId
 * @param {{scale?: number}} [options]
 * @returns {Promise<string>} PNG data URL
 */
export async function exportNodeAsPng(elementId, { scale = 2 } = {}) {
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element "${elementId}" not found for export.`);

  const { width, height } = node.getBoundingClientRect();
  if (!width || !height) throw new Error("Element has no visible size to export.");

  const clone = node.cloneNode(true);
  inlineComputedStyles(node, clone);

  const serializer = new XMLSerializer();
  const svgMarkup =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject width="100%" height="100%">${serializer
      .serializeToString(clone)
      .replace(/#/g, "%23")}</foreignObject></svg>`;

  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Opens a PNG data URL in a new window and triggers the browser print
 * dialog once it's loaded — used for "Print / Save as PDF".
 * @param {string} dataUrl
 * @param {string} [title]
 */
export function openImageForPrint(dataUrl, title = "Document") {
  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    console.warn("Popup blocked — allow popups for this site to print.");
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style>
      @page { margin: 0; }
      html, body { margin: 0; padding: 0; }
      img { width: 100%; height: auto; display: block; }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" onload="window.focus(); window.print();" />
  </body>
</html>`);
  printWindow.document.close();
}