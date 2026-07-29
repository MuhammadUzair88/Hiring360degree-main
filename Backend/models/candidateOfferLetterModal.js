// models/offerLetterModel.js
// One document per candidate/application. Content here overrides the
// OfferLetterSettings defaults for that specific candidate.

import mongoose from "mongoose";

const offerLetterSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true, // one offer letter per application
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

      paragraph1: { type: String, default: "" }, // Opening & Role
      paragraph2: { type: String, default: "" }, // Terms & Compensation
      paragraph3: { type: String, default: "" }, // Closing

      joiningDate: { type: Date },
      endingDate: { type: Date }, // only set for internships/contract roles

      additionalFields: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },

    status: {
      type: String,
      enum: ["Pending","Notified"],
      default: "Pending",
    },


  },
  { timestamps: true }
);

offerLetterSchema.index({ organizationId: 1, status: 1 });
offerLetterSchema.index({ advertisementId: 1 });

export const OfferLetter =
  mongoose.models.OfferLetter || mongoose.model("OfferLetter", offerLetterSchema);