import { toPng } from "html-to-image";

/* Date-only helpers intentionally avoid new Date("YYYY-MM-DD") because that
   string is parsed as UTC and can display one day earlier in local time. */
export function parseDateInput(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateInput() {
  return toDateInputValue(new Date());
}

export function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const date = parseDateInput(dateStr) || new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(dateStr, fallback = "") {
  if (!dateStr) return fallback;
  const date = parseDateInput(dateStr) || new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function requiresEndingDate(employmentType = "") {
  const type = String(employmentType).trim().toLowerCase();
  return type.includes("contract") || type.includes("intern");
}

export function calculateEndingDate(joiningDate, advertisement = {}) {
  const start = parseDateInput(joiningDate);
  if (!start) return "";

  const durationStr = advertisement?.internshipDuration || "";
  const match = durationStr.match(/(\d+)\s*(day|week|month|year)s?/i);
  const end = new Date(start);

  if (match) {
    const amount = Number.parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit === "day") end.setDate(end.getDate() + amount);
    else if (unit === "week") end.setDate(end.getDate() + amount * 7);
    else if (unit === "month") end.setMonth(end.getMonth() + amount);
    else if (unit === "year") end.setFullYear(end.getFullYear() + amount);
  } else {
    end.setMonth(end.getMonth() + 6);
  }

  return toDateInputValue(end);
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

async function waitForExportAssets(node) {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Font loading is not fatal to export.
    }
  }

  const images = Array.from(node.querySelectorAll("img"));

  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) {
        try {
          await img.decode?.();
        } catch {
          // Some browsers reject decode for already-decoded images.
        }
        return;
      }

      await new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        setTimeout(resolve, 5000);
      });
    })
  );
}

/**
 * Export a DOM node as PNG.
 *
 * IMPORTANT: this intentionally uses html-to-image rather than the old
 * SVG foreignObject -> canvas implementation. html-to-image embeds image
 * resources before it renders the canvas, which avoids the tainted-canvas
 * SecurityError caused by Cloudinary logo/signature URLs.
 */
export async function exportNodeAsPng(elementId, { scale = 2 } = {}) {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element "${elementId}" not found for export.`);
  }

  const rect = node.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    throw new Error("Element has no visible size to export.");
  }

  await waitForExportAssets(node);

  try {
    return await toPng(node, {
      cacheBust: true,
      pixelRatio: scale,
      backgroundColor: "#ffffff",
      imagePlaceholder: TRANSPARENT_PIXEL,
      skipAutoScale: true,
    });
  } catch (error) {
    console.error("Offer letter PNG export failed:", error);
    throw new Error(
      "Could not generate the offer letter image. Make sure the organization logo and signature are valid Cloudinary images."
    );
  }
}

export function openImageForPrint(dataUrl, title = "Document") {
  const printWindow = window.open("", "_blank", "width=900,height=1100");

  if (!printWindow) {
    console.warn("Popup blocked — allow popups for this site to print.");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${String(title).replace(/[<>]/g, "")}</title>
        <style>
          html, body { margin: 0; padding: 0; background: #fff; }
          body { display: flex; justify-content: center; align-items: flex-start; }
          img { display: block; max-width: 100%; height: auto; }
          @media print { img { width: 100%; } }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="Document" onload="window.print()" />
      </body>
    </html>
  `);

  printWindow.document.close();
}

/** Upload the generated PNG data URL to your existing unsigned Cloudinary preset. */
export async function uploadDataUrlToCloudinary(dataUrl) {
  if (!dataUrl) throw new Error("Offer letter image is empty.");

  const blob = await (await fetch(dataUrl)).blob();
  const formData = new FormData();

  formData.append("file", blob, `offer-letter-${Date.now()}.png`);
  formData.append("upload_preset", import.meta.env.VITE_PRESET);

  // cloud_name is not normally required by Cloudinary's upload endpoint,
  // but preserving it is harmless if your preset setup expects it.
  if (import.meta.env.VITE_CLOUDINARY_NAME) {
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);
  }

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      // ignore body parsing errors
    }
    console.error("Cloudinary offer-letter upload failed:", detail);
    throw new Error("Failed to upload the offer letter image.");
  }

  const uploaded = await response.json();
  if (!uploaded?.secure_url) {
    throw new Error("Cloudinary did not return an offer letter URL.");
  }

  return uploaded.secure_url;
}
