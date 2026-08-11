
// controllers/applicationController.js

import mongoose from "mongoose";
import { Advertisement } from "../models/advertisementModel.js";
import { Application } from "../models/applicationModel.js";
import { Candidate } from "../models/candidateModel.js";
import { analyzeResume } from "../services/gemini/index.js";
import { logger } from "../utils/resumehandlers/logger.js";

// Submit Application — NO AI call here anymore
export const addApplication = async (req, res) => {
  try {
    const { advertisementId } = req.params;

    const {
      name,
      email,
      phone,
      organizationId,
      resumeUrl,
      resumeType,
      resumeText,
    } = req.body;

    // Find advertisement
    const advertisement = await Advertisement.findById(advertisementId);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found"
      });
    }

    // Find or create candidate
    let candidate = await Candidate.findOne({ email });
    if (!candidate) {
      candidate = await Candidate.create({
        name,
        email,
        phone
      });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      candidateId: candidate._id,
      advertisementId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this position"
      });
    }

    // Create application WITHOUT running AI analysis.
    // resumeText is stored (hidden field) so analysis can be triggered later.
    const application = await Application.create({
      candidateId: candidate._id,
      advertisementId,
      organizationId: organizationId || advertisement.organizationId,
      resume: {
        type: resumeType,
        url: resumeUrl,
      },
      resumeText, // hidden via select:false, kept for later analysis
      aiResult: {
        analysisStatus: "not_started",
      },
    });

    logger.info('Application submitted (analysis not yet run)', {
      candidateId: candidate._id,
      advertisementId,
      applicationId: application._id,
    });

    // Strip resumeText out of the response object (defense in depth,
    // even though select:false already hides it on fresh fetches)
    const responseApplication = application.toObject();
    delete responseApplication.resumeText;

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application: responseApplication,
    });

  } catch (error) {
    logger.error('Error in addApplication', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// NEW: Trigger AI analysis on demand (e.g., HR clicks "Analyze" button)
export const analyzeApplicationResume = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    // Scope the lookup to the authenticated organization and populate the
    // candidate immediately. This prevents the analyze response from briefly
    // turning the candidate into "Unknown candidate" on the frontend.
    const application = await Application.findOne({
      _id: applicationId,
      organizationId,
    })
      .select("+resumeText")
      .populate("candidateId", "name email phone");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or you are not authorized to analyze it",
      });
    }

    const serializeApplication = () => {
      const responseApplication = application.toObject();
      delete responseApplication.resumeText;
      return responseApplication;
    };

    // Avoid re-running if already completed, unless caller forces it.
    const { force } = req.query;
    if (
      application.aiResult?.analysisStatus === "completed" &&
      force !== "true"
    ) {
      return res.status(200).json({
        success: true,
        message: "Analysis already completed. Pass ?force=true to re-run.",
        application: serializeApplication(),
      });
    }

    if (!application.resumeText) {
      return res.status(400).json({
        success: false,
        message: "No resume text stored for this application; cannot run analysis.",
      });
    }

    const advertisement = await Advertisement.findOne({
      _id: application.advertisementId,
      organizationId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found for this application",
      });
    }

    application.aiResult.analysisStatus = "pending";
    await application.save();

    logger.info("Starting resume analysis", {
      applicationId,
      advertisementId: advertisement._id,
    });

    try {
      const aiResult = await analyzeResume(application.resumeText, advertisement);

      application.aiResult = {
        ...aiResult,
        analysisStatus: "completed",
      };

      await application.save();

      // save() can change population state depending on the Mongoose version;
      // explicitly repopulate before returning the response.
      await application.populate("candidateId", "name email phone");

      logger.info("Resume analysis complete", {
        applicationId,
        score: aiResult.overallScore,
        aiEnhanced: aiResult.aiEnhanced,
      });
    } catch (aiError) {
      application.aiResult.analysisStatus = "failed";
      await application.save();
      logger.error("Resume analysis failed", aiError);

      return res.status(502).json({
        success: false,
        message: "Resume analysis failed. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume analysis completed.",
      application: serializeApplication(),
    });
  } catch (error) {
    logger.error("Error in analyzeApplicationResume", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Application Stats
export const getApplicationStats = async (req, res) => {
  try {
    const { advertisementId } = req.params;
    const organizationId = req.organizationId;

    const stats = await Application.aggregate([
      {
        $match: {
          advertisementId: new mongoose.Types.ObjectId(advertisementId),
          organizationId: new mongoose.Types.ObjectId(organizationId),
        },
      },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          applied: { 
            $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] } 
          },
          bookmarked: { 
            $sum: { $cond: [{ $eq: ["$status", "Bookmarked"] }, 1, 0] } 
          },
          shortlisted: { 
            $sum: { $cond: [{ $eq: ["$status", "Shortlisted"] }, 1, 0] } 
          },
          rejected: { 
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } 
          },
          // Score statistics
          averageScore: { $avg: "$aiResult.overallScore" },
          highestScore: { $max: "$aiResult.overallScore" },
          lowestScore: { $min: "$aiResult.overallScore" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || { 
        applied: 0, 
        bookmarked: 0, 
        shortlisted: 0, 
        rejected: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      },
    });
  } catch (error) {
    logger.error('Error in getApplicationStats', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Applications
export const getApplications = async (req, res) => {
  try {
    const { advertisementId } = req.params;
    const organizationId = req.organizationId;

    const { 
      status, 
      minScore, 
      maxScore, 
      sortBy = 'createdAt', 
      order = 'desc',
      page = 1,
      limit = 20 
    } = req.query;

    // Build query
    const query = {
      advertisementId,
      organizationId,
    };

    if (status) {
      query.status = status;
    }

    if (minScore) {
      query['aiResult.overallScore'] = { 
        ...query['aiResult.overallScore'], 
        $gte: parseInt(minScore) 
      };
    }

    if (maxScore) {
      query['aiResult.overallScore'] = { 
        ...query['aiResult.overallScore'], 
        $lte: parseInt(maxScore) 
      };
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [applications, total] = await Promise.all([
      Application.find(query)
        .select("-resumeText") // Exclude raw resume text
        .populate("candidateId", "name email phone")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Application.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
    });
  } catch (error) {
    logger.error('Error in getApplications', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bookmark Candidate
export const bookmarkCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        organizationId,
      },
      {
        status: "Bookmarked",
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    logger.info('Candidate bookmarked', { applicationId });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Error in bookmarkCandidate', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Shortlist Candidate
export const shortlistCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        organizationId,
      },
      {
        status: "Shortlisted",
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    logger.info('Candidate shortlisted', { applicationId });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Error in shortlistCandidate', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject Candidate
export const rejectCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        organizationId,
      },
      {
        status: "Rejected",
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    logger.info('Candidate rejected', { applicationId });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Error in rejectCandidate', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Move to Applied
export const MoveCandidateToApplied = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        organizationId,
      },
      {
        status: "Applied",
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    logger.info('Candidate moved to applied', { applicationId });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Error in MoveCandidateToApplied', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const application = await Application.findOne({
      _id: applicationId,
      organizationId,
    })
      .populate({
        path: "candidateId",
        select: "name email phone",
      })
      .populate({
        path: "advertisementId",
        select: "jobTitle department employmentType location experience skills description",
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    logger.error('Error in getApplicationById', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Top Candidates by Score
export const getTopCandidates = async (req, res) => {
  try {
    const { advertisementId } = req.params;
    const organizationId = req.organizationId;
    const { limit = 10 } = req.query;

    const applications = await Application.find({
      advertisementId,
      organizationId,
    })
      .select("candidateId aiResult.overallScore aiResult.summary status")
      .populate("candidateId", "name email")
      .sort({ "aiResult.overallScore": -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    logger.error('Error in getTopCandidates', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};