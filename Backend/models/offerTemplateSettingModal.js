
import mongoose from "mongoose";

const offerLetterSettingsSchema = new mongoose.Schema(
  {
    advertisementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement",
      required: true,
      unique: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    template: {
      type: String,
      enum: ["corporate", "gradient", "platinum", "minimal", "bold", "executive"],
      default: "corporate",
    },

    colors: {
      primary: { type: String, default: "#1a3a6e" },
      secondary: { type: String, default: "#4a6a8e" },
      text: { type: String, default: "#1f2937" },
      background: { type: String, default: "#ffffff" },
      accent: { type: String, default: "#c9a24b" },
    },

    brandingPreference: {
      type: String,
      enum: ["logo-only", "name-only", "logo-name"],
      default: "logo-name",
    },

    logoSize: { type: Number, default: 145 },
    headingSize: { type: Number, default: 145 },
    bodyFontSize: { type: Number, default: 150 },
    signatureSize: { type: Number, default: 120 },
    spacing: { type: Number, default: 100 },

    // Org signature — uploaded once, stamped on every offer letter for this ad
    signature: {
      url: { type: String, default: "" },
      uploadedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const OfferLetterSettings =
  mongoose.models.OfferLetterSettings ||
  mongoose.model("OfferLetterSettings", offerLetterSettingsSchema);