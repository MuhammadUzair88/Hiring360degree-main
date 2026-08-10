import apiClient from "./apiClient";

// ======================================
// Get connected accounts
// ======================================
export const getSocialAccounts = async () => {
  const response = await apiClient.get(
    "/api/organization/social/accounts"
  );

  return response.data;
};

// ======================================
// Connect platform
// ======================================
export const connectSocialPlatform = async (platform) => {
  const response = await apiClient.get(
    `/api/organization/social/connect/${platform}`
  );

  return response.data;
};

// ======================================
// Account health
// ======================================
export const getSocialAccountHealth = async () => {
  const response = await apiClient.get(
    "/api/organization/social/accounts/health"
  );

  return response.data;
};

// ======================================
// Upload image
// ======================================
export const uploadSocialImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiClient.post(
    "/api/organization/social/upload-image",
    formData,
    {
      headers: {
        // apiClient defaults to application/json — override for this
        // one call so the browser sets the correct multipart boundary.
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================================
// Publish
// ======================================
export const publishSocialPost = async ({
  content,
  mediaUrl,
  accountIds,
  scheduledFor,
  timezone,
}) => {
  const response = await apiClient.post(
    "/api/organization/social/publish",
    {
      content,
      mediaUrl,
      accountIds,
      scheduledFor,
      timezone,
    }
  );

  return response.data;
};