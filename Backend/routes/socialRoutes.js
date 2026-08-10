import express from "express";

import {
  ensureZernioProfile,
  connectSocialAccount,
  getConnectedSocialAccounts,
  getSocialAccountHealth,
  uploadSocialMediaImage,
  publishAdvertisementToSocials,
} from "../controllers/socialController.js";

import { socialImageUpload } from "../middlewares/uploadMiddleware.js";

// CHANGE THIS IMPORT TO YOUR ACTUAL AUTH MIDDLEWARE
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/profile",
  ensureZernioProfile
);

router.get(
  "/accounts",
  getConnectedSocialAccounts
);

router.get(
  "/accounts/health",
  getSocialAccountHealth
);

router.get(
  "/connect/:platform",
  connectSocialAccount
);

router.post(
  "/upload-image",
  socialImageUpload.single("image"),
  uploadSocialMediaImage
);

router.post(
  "/publish",
  publishAdvertisementToSocials
);

export default router;