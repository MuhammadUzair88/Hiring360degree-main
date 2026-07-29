import mongoose from "mongoose";

const interviewerSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password:{
      type:String,
    },

    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate interviewer emails within the same organization
interviewerSchema.index(
  { organizationId: 1, email: 1 },
  { unique: true }
);

// ✅ SAFE MODEL EXPORT (fix for OverwriteModelError)
export const Interviewer =
  mongoose.models.Interviewer || mongoose.model("Interviewer", interviewerSchema);