// src/utils/uploadImage.js
//
// Thin wrapper around Cloudinary's unsigned upload endpoint. Used
// anywhere the app needs to turn a local file into a public URL before
// sending it to the backend (organization logo at signup, logo changes
// in Settings, etc). Centralized here instead of duplicated per-page.
export async function uploadImageToCloudinary(file) {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", import.meta.env.VITE_PRESET);
  uploadData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) throw new Error("Image upload failed.");

  const uploaded = await response.json();
  if (!uploaded.secure_url) throw new Error("Image upload failed.");

  return uploaded.secure_url;
}
