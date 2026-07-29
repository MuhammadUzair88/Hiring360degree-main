import mongoose from "mongoose";

const aiPamphletSchema = new mongoose.Schema(
  {
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

    template: {
      type: String,
      default: "corporate",
    },

    colors: {
      primary: {
        type: String,
        default: "#2563EB",
      },

      accent: {
        type: String,
        default: "#3B82F6",
      },

      background: {
        type: String,
        default: "#FFFFFF",
      },

      text: {
        type: String,
        default: "#111827",
      },
    },

    brandingPreference: {
      type: String,
      enum: ["logo-only", "name-only", "logo-name"],
      default: "logo-name",
    },

    logoSize: {
      type: String,
      // enum: ["sm", "md", "lg"],
      default: "md",
    },

    headingSize: {
      type: String,
      // enum: ["sm", "md", "lg"],
      default: "md",
    },

    generatedImageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const AIPamphlet = mongoose.model(
  "AIPamphlet",
  aiPamphletSchema
);