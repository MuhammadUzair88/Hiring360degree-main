// models/interviewModel.js
import mongoose from "mongoose";

const scheduledInterviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },

    roundIndex: {
      type: Number,
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewTime: {
      type: String,
      required: true,
    },

    meetingLinkCandidate: {
      type: String,
      default: "",
    },

    meetingLinkInterviewer: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Ongoing",
        "Completed",
        "Cancelled",
        "No Show",
      ],
      default: "Scheduled",
    },

    feedbackEvaluation:{
    type: String,
      enum: [
        "Pending",
        "Completed",
      ],
      default: "Pending",
    },

    callId: {
      type: String,
      required: true,
    },

    // ============================
    // ADD THESE TWO FIELDS
    // ============================
    streamHostId: {
      type: String,
    },

    streamCandidateId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ScheduledInterview = mongoose.model(
  "ScheduledInterview",
  scheduledInterviewSchema
);