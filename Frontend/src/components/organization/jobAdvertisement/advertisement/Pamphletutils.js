let loadPromise = null;

function loadHtmlToImage() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.htmlToImage) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js";
      script.onload = () => setTimeout(resolve, 100);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

/** Renders a DOM node to a PNG data URL. */
export async function exportNodeAsPng(elementId) {
  await loadHtmlToImage();
  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Could not find #${elementId} to export.`);
  return window.htmlToImage.toPng(node, { quality: 1, pixelRatio: 2, backgroundColor: "#ffffff" });
}

/** Opens a PNG data URL in a new tab and triggers the browser's print (→ "Save as PDF") dialog. */
export function openImageForPrint(dataUrl, title = "Job Pamphlet") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(
    `<html><head><title>${title}</title></head>` +
      `<body style="margin:0;display:flex;align-items:center;justify-content:center;">` +
      `<img src="${dataUrl}" style="max-width:100%;height:auto;" onload="window.print()" alt="Job pamphlet" />` +
      `</body></html>`
  );
  printWindow.document.close();
}


/**
 * Uploads a PNG data URL to Cloudinary (same unsigned-preset flow
 * ApplicationContext.jsx uses for resumes) and returns the hosted
 * https URL. This is how the client-rendered pamphlet becomes the
 * `generatedImageUrl` the backend stores on the advertisement.
 */
export async function uploadDataUrlToCloudinary(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", import.meta.env.VITE_PRESET);
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload the pamphlet image.");
  }

  const uploaded = await response.json();
  return uploaded.secure_url;
}