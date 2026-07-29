import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      ref: "Organization",
    },
    jobTitle: { type: String, required: true },
    department: { type: String },
    employmentType: { type: String },
    workMode: { type: String },
    location: { type: String },
    salary: { type: String },
    internshipPaid: { type: String },
    internshipDuration: { type: String },
    deadline: { type: Date },
    skills: [{ type: String }],
    description: { type: String },
    experience: { type: String },
    status: {
      type: String,
      enum: ["Close", "Live"],
      default: "Live",
    },
  },
  { timestamps: true }
);

// ✅ SAFE MODEL EXPORT
export const Advertisement =
  mongoose.models.Advertisement ||
  mongoose.model("Advertisement", advertisementSchema);