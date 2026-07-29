import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addAdvertisement, deleteAdvertisement, editAdvertisement, getAdvertisementById, getOrganizationAdvertisements } from "../controllers/AdvertisementController.js";


const router = express.Router();

router.post("/add", authMiddleware, addAdvertisement);

router.put("/edit/:advertisementId", authMiddleware, editAdvertisement);

router.get(
  "/",
  authMiddleware,
  getOrganizationAdvertisements
);

router.get(
  "/:advertisementId",
  authMiddleware,
  getAdvertisementById
);

router.delete(
  "/:advertisementId",
  authMiddleware,
  deleteAdvertisement
);

export default router;