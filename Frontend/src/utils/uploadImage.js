

// src/utils/uploadImage.js
// Centralized Cloudinary unsigned image uploader.
export async function uploadImageToCloudinary(file) {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", import.meta.env.VITE_PRESET);
  uploadData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    let message = "Image upload failed.";
    try {
      const body = await response.json();
      message = body?.error?.message || body?.message || message;
    } catch {
      // Keep the generic message when Cloudinary does not return JSON.
    }
    throw new Error(message);
  }

  const uploaded = await response.json();
  if (!uploaded?.secure_url) throw new Error("Image upload failed.");

  return uploaded.secure_url;
}
