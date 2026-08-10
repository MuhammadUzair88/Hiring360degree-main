import { Organization } from "../models/organizationModel.js";
import {
  createZernioProfile,
  getZernioConnectUrl,
  getZernioAccounts,
  getZernioAccountHealth,
  getZernioMediaUploadUrl,
  uploadToZernioStorage,
  createZernioPost,
} from "../services/zernioService.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const SUPPORTED_PLATFORMS = [
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "threads",
  "tiktok",
  "youtube",
  "pinterest",
  "reddit",
  "bluesky",
];


// ======================================
// Ensure organization has Zernio profile
// ======================================

export const ensureZernioProfile = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const organization = await Organization.findById(
      organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.zernioProfileId) {
      return res.status(200).json({
        success: true,
        profileId: organization.zernioProfileId,
      });
    }

    const result = await createZernioProfile({
      name: organization.name,
      description: `Hiring360 social profile for ${organization.name}`,
    });

    const profileId = result?.profile?._id;

    if (!profileId) {
      throw new Error(
        "Zernio did not return a profile ID"
      );
    }

    organization.zernioProfileId = profileId;

    await organization.save();

    return res.status(201).json({
      success: true,
      profileId,
    });
  } catch (error) {
    console.error(
      "ensureZernioProfile:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to create Zernio profile",
    });
  }
};


// ======================================
// Connect social account
// ======================================

export const connectSocialAccount = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const { platform } = req.params;

    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported social platform",
      });
    }

    const organization = await Organization.findById(
      organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    let profileId = organization.zernioProfileId;

    // Create profile automatically
    if (!profileId) {
      const result = await createZernioProfile({
        name: organization.name,
        description: `Hiring360 social profile for ${organization.name}`,
      });

      profileId = result?.profile?._id;

      if (!profileId) {
        throw new Error(
          "Could not create Zernio profile"
        );
      }

      organization.zernioProfileId = profileId;

      await organization.save();
    }

    const redirectUrl =
      `${FRONTEND_URL}/organization/social/callback`;

    const result = await getZernioConnectUrl({
      platform,
      profileId,
      redirectUrl,
    });

    return res.status(200).json({
      success: true,
      authUrl: result.authUrl,
      profileId,
      platform,
    });
  } catch (error) {
    console.error(
      "connectSocialAccount:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to connect social account",
    });
  }
};


// ======================================
// Get connected accounts
// ======================================

export const getConnectedSocialAccounts = async (
  req,
  res
) => {
  try {
    const organizationId = req.organizationId;

    const organization = await Organization.findById(
      organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (!organization.zernioProfileId) {
      return res.status(200).json({
        success: true,
        accounts: [],
      });
    }

    const result = await getZernioAccounts({
      profileId: organization.zernioProfileId,
    });

    return res.status(200).json({
      success: true,
      accounts: result.accounts || [],
    });
  } catch (error) {
    console.error(
      "getConnectedSocialAccounts:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to get connected accounts",
    });
  }
};


// ======================================
// Account health
// ======================================

export const getSocialAccountHealth = async (
  req,
  res
) => {
  try {
    const organizationId = req.organizationId;

    const organization = await Organization.findById(
      organizationId
    );

    if (!organization?.zernioProfileId) {
      return res.status(200).json({
        success: true,
        accounts: [],
      });
    }

    const result = await getZernioAccountHealth({
      profileId: organization.zernioProfileId,
    });

    return res.status(200).json({
      success: true,
      accounts: result,
    });
  } catch (error) {
    console.error(
      "getSocialAccountHealth:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message,
    });
  }
};


// ======================================
// Upload image to Zernio
// ======================================

export const uploadSocialMediaImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const file = req.file;

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "Image must be smaller than 10MB",
      });
    }

    const upload = await getZernioMediaUploadUrl({
      filename: file.originalname,
      contentType: file.mimetype,
      size: file.size,
    });

    await uploadToZernioStorage({
      uploadUrl: upload.uploadUrl,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    return res.status(200).json({
      success: true,
      media: {
        url: upload.publicUrl,
        type: "image",
        filename: file.originalname,
      },
    });
  } catch (error) {
    console.error(
      "uploadSocialMediaImage:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to upload image",
    });
  }
};


// ======================================
// Publish advertisement
// ======================================

export const publishAdvertisementToSocials =
  async (req, res) => {
    try {
      const organizationId = req.organizationId;

      const {
        content,
        mediaUrl,
        accountIds,
        scheduledFor,
        timezone,
      } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Post content is required",
        });
      }

      if (
        !Array.isArray(accountIds) ||
        accountIds.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Select at least one social account",
        });
      }

      const organization = await Organization.findById(
        organizationId
      );

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      if (!organization.zernioProfileId) {
        return res.status(400).json({
          success: false,
          message:
            "Organization does not have a Zernio profile",
        });
      }

      // Get accounts belonging to this organization
      const accountsResult = await getZernioAccounts({
        profileId: organization.zernioProfileId,
      });

      const accounts = accountsResult.accounts || [];

      const selectedAccounts = accounts.filter(
        (account) =>
          accountIds.includes(account._id) &&
          account.isActive !== false
      );

      if (
        selectedAccounts.length !== accountIds.length
      ) {
        return res.status(403).json({
          success: false,
          message:
            "One or more selected social accounts are invalid",
        });
      }

      const platforms = selectedAccounts.map(
        (account) => ({
          platform: account.platform,
          accountId: account._id,
        })
      );

      const mediaItems = mediaUrl
        ? [
            {
              url: mediaUrl,
              type: "image",
            },
          ]
        : [];

      const result = await createZernioPost({
        content: content.trim(),
        mediaItems,
        platforms,
        publishNow: !scheduledFor,
        scheduledFor,
        timezone:
          timezone || "Asia/Karachi",
      });

      return res.status(200).json({
        success: true,
        message: scheduledFor
          ? "Post scheduled successfully"
          : "Post published successfully",
        post: result,
        platforms,
      });
    } catch (error) {
      console.error(
        "publishAdvertisementToSocials:",
        error.response?.data || error
      );

      return res.status(500).json({
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to publish social post",
      });
    }
  };