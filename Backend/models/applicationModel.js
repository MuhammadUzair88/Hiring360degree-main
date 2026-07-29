// models/applicationModel.js

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
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

    resume: {
      type: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    // AI RESULT - Matches geminiService.js output
    aiResult: {
      // Core Scores
      overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      totalMatchScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      skillsScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      experienceScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      educationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      atsScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      // Breakdown
      breakdown: {
        skillsScore: { type: Number, default: 0, min: 0, max: 100 },
        experienceScore: { type: Number, default: 0, min: 0, max: 100 },
        educationScore: { type: Number, default: 0, min: 0, max: 100 },
        atsReadabilityScore: { type: Number, default: 0, min: 0, max: 100 },
      },

      // Reasoning
      reasoning: {
        type: String,
        default: '',
      },

      // Skills
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      bonusSkills: [{ type: String }],

      // Experience
      candidateExperienceYears: {
        type: Number,
        default: 0,
      },

      // Achievements & ATS Flags
      quantifiableAchievements: [{ type: String }],
      atsFormattingFlags: [{ type: String }],

      // Analysis
      strengths: [{ type: String }],
      redFlags: [{ type: String }],

      // Summary
      summary: {
        type: String,
        default: '',
      },

      // Metadata
      aiEnhanced: {
        type: Boolean,
        default: false,
      },
      analysisType: {
        type: String,
        enum: ['comprehensive', 'deterministic', 'failed'],
        default: 'deterministic',
      },
    },

    // Application Status
    status: {
      type: String,
      enum: [
        "Applied",
        "Bookmarked",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Offered",
        "Hired",
      ],
      default: "Applied",
    },

    currentRound: {
      type: Number,
      default: 0,
    },

roundResults: [
  {
    roundName: {
      type: String,
      required: true,
    },

    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Passed", "Failed"],
      default: "Pending",
    },

    evaluation: {
      technicalSkills: {
        type: Number,
        min: 1,
        max: 5,
      },

      problemSolving: {
        type: Number,
        min: 1,
        max: 5,
      },

      communication: {
        type: Number,
        min: 1,
        max: 5,
      },

      behavioralSkills: {
        type: Number,
        min: 1,
        max: 5,
      },

      culturalFit: {
        type: Number,
        min: 1,
        max: 5,
      },
    },

    coreStrengths: {
      type: String,
      trim: true,
    },

    areasForImprovement: {
      type: String,
      trim: true,
    },

    recommendation: {
      type: String,
      enum: [
        "Strong Hire",
        "Hire",
        "Hold",
        "No Hire",
      ],
    },

    finalComments: {
      type: String,
      trim: true,
    },
  },
],

    offerLetterUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ candidateId: 1, advertisementId: 1 }, { unique: true });
applicationSchema.index({ organizationId: 1, status: 1 });
applicationSchema.index({ "aiResult.overallScore": -1 });
applicationSchema.index({ "aiResult.totalMatchScore": -1 });
applicationSchema.index({ createdAt: -1 });

export const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);