import express from "express";
import {
  home,
  login,
  organization,
  register,
  updateOrganization,
  updatePassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", home);
router.post("/register", register);
router.post("/login", login);

router.get("/organization", authMiddleware, organization);
router.put("/organization/update", authMiddleware, updateOrganization);
router.put("/organization/password", authMiddleware, updatePassword);

export default router;
