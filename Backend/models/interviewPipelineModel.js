import mongoose from "mongoose";

const interviewPipelineSchema = new mongoose.Schema(
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

    rounds: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ SAFE MODEL EXPORT (prevents OverwriteModelError)
export const InterviewPipeline =
  mongoose.models.InterviewPipeline ||
  mongoose.model("InterviewPipeline", interviewPipelineSchema);