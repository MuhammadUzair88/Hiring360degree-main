

import mongoose from "mongoose";

const additionalFieldSchema = new mongoose.Schema(
  {
    id: { type: String, default: "" },
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const offerLetterSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    advertisementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    templateSettingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfferLetterSettings",
      required: true,
    },

    content: {
      paragraph1: { type: String, default: "" },
      paragraph2: { type: String, default: "" },
      paragraph3: { type: String, default: "" },
      fieldsSectionLabel: { type: String, default: "" },

      // Keep Date for compatibility with existing MongoDB documents.
      // API responses normalize these to YYYY-MM-DD before reaching the UI.
      joiningDate: { type: Date, default: null },
      endingDate: { type: Date, default: null },

      additionalFields: {
        type: [additionalFieldSchema],
        default: [],
      },
    },

    // Hosted PNG generated from the exact personalized A4 preview.
    offerLetterUrl: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Notified"],
      default: "Pending",
    },

    notifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

offerLetterSchema.index({ organizationId: 1, status: 1 });
offerLetterSchema.index({ advertisementId: 1 });

export const OfferLetter =
  mongoose.models.OfferLetter || mongoose.model("OfferLetter", offerLetterSchema);
