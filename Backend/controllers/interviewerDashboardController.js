// controllers/interviewerController.js
import { ScheduledInterview } from "../models/interviewModel.js";
import { Application } from "../models/applicationModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { Organization } from "../models/organizationModel.js";

// =========================
// DASHBOARD STATS (4 top cards)
// =========================
export const getDashboardStats = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const upcoming = await ScheduledInterview.countDocuments({
      interviewerId,
      status: "Scheduled",
      interviewDate: { $gte: now },
    });

    const newInterviews = await ScheduledInterview.countDocuments({
      interviewerId,
      createdAt: { $gte: sevenDaysAgo },
    });

    const missing = await ScheduledInterview.countDocuments({
      interviewerId,
      status: "No Show",
    });

    const feedbackAwaiting = await ScheduledInterview.countDocuments({
      interviewerId,
      status: "Completed",
      feedbackEvaluation: "Pending",
    });

    return res.status(200).json({
      success: true,
      stats: { upcoming, newInterviews, missing, feedbackAwaiting },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// DASHBOARD CHART (weekly bars + completion rate)
// =========================
export const getDashboardChart = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const schedules = await ScheduledInterview.find({
      interviewerId,
      interviewDate: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const weeks = [
      { week: "Week 1", assignedSessions: 0, currentCycle: 0 },
      { week: "Week 2", assignedSessions: 0, currentCycle: 0 },
      { week: "Week 3", assignedSessions: 0, currentCycle: 0 },
      { week: "Week 4", assignedSessions: 0, currentCycle: 0 },
    ];

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const day = new Date(schedule.interviewDate).getDate();
      let weekIndex = Math.ceil(day / 7) - 1;
      if (weekIndex > 3) weekIndex = 3;

      weeks[weekIndex].assignedSessions += 1;
      if (schedule.status === "Completed") {
        weeks[weekIndex].currentCycle += 1;
      }
    }

    let completedCount = 0;
    for (let i = 0; i < schedules.length; i++) {
      if (schedules[i].status === "Completed") completedCount++;
    }

    const completionRate = schedules.length
      ? Number(((completedCount / schedules.length) * 100).toFixed(1))
      : 0;

    return res.status(200).json({ success: true, weeks, completionRate });
  } catch (error) {
    console.error("Get Dashboard Chart Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// RECENT INTERVIEWS (dashboard table)
// =========================
export const getRecentInterviews = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await ScheduledInterview.countDocuments({ interviewerId });

    const schedules = await ScheduledInterview.find({ interviewerId })
      .populate({
        path: "applicationId",
        populate: [
          { path: "candidateId", select: "name" },
          { path: "advertisementId", select: "jobTitle" },
        ],
      })
      .sort({ interviewDate: -1, interviewTime: -1 })
      .skip(skip)
      .limit(limit);

    const recentInterviews = [];

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.applicationId || !schedule.applicationId.candidateId) continue;

      let roundName = "Interview Round";
      const pipeline = await InterviewPipeline.findOne({
        advertisementId: schedule.applicationId.advertisementId,
      });
      if (pipeline && pipeline.rounds && pipeline.rounds[schedule.roundIndex]) {
        roundName = pipeline.rounds[schedule.roundIndex];
      }

      recentInterviews.push({
        scheduleId: schedule._id,
        candidateName: schedule.applicationId.candidateId.name,
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        roundName,
        interviewDate: schedule.interviewDate,
        interviewTime: schedule.interviewTime,
        status: schedule.status,
      });
    }

    return res.status(200).json({
      success: true,
      recentInterviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Recent Interviews Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// LIVE INTERVIEWS (Live Active Channels panel)
// =========================
export const getLiveInterviews = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const now = new Date();
    
    const schedules = await ScheduledInterview.find({
      interviewerId,
      status: "Ongoing",
    }).populate({
      path: "applicationId",
      populate: [
        { path: "candidateId", select: "name" },
        { path: "advertisementId", select: "jobTitle" },
      ],
    });

    const liveInterviews = [];

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.applicationId || !schedule.applicationId.candidateId) continue;

      let roundName = "Interview Round";
      const pipeline = await InterviewPipeline.findOne({
        advertisementId: schedule.applicationId.advertisementId,
      });
      if (pipeline && pipeline.rounds && pipeline.rounds[schedule.roundIndex]) {
        roundName = pipeline.rounds[schedule.roundIndex];
      }

      liveInterviews.push({
        scheduleId: schedule._id,
        callId: schedule.callId,
        candidateName: schedule.applicationId.candidateId.name,
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        roundName,
        interviewTime: schedule.interviewTime,
        joinLink:
          schedule.meetingLinkInterviewer ||
          `${process.env.CLIENT_URL}/interview/${schedule.callId}?role=interviewer`,
      });
    }

    return res.status(200).json({ success: true, liveInterviews });
  } catch (error) {
    console.error("Get Live Interviews Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// GET ALL CANDIDATES (Conduct Interviews list)
// =========================
export const getAllCandidates = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;

    const schedules = await ScheduledInterview.find({ interviewerId })
      .populate({
        path: "applicationId",
        populate: [
          { path: "candidateId", select: "name" },
          { path: "advertisementId", select: "jobTitle department" },
        ],
      })
      .sort({ interviewDate: -1 });

    const candidates = [];

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.applicationId || !schedule.applicationId.candidateId) continue;

      let roundName = "Interview Round";
      const pipeline = await InterviewPipeline.findOne({
        advertisementId: schedule.applicationId.advertisementId,
      });
      if (pipeline && pipeline.rounds && pipeline.rounds[schedule.roundIndex]) {
        roundName = pipeline.rounds[schedule.roundIndex];
      }

      let statusBadge = "Upcoming";
      if (schedule.status === "Completed") statusBadge = "Completed";
      if (schedule.status === "Ongoing") statusBadge = "Ongoing";

      candidates.push({
        scheduleId: schedule._id,
        candidateName: schedule.applicationId.candidateId.name,
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        department: schedule.applicationId.advertisementId?.department || "N/A",
        assignedStage: roundName,
        interviewDate: schedule.interviewDate,
        interviewTime: schedule.interviewTime,
        statusBadge,
        evaluationStatus: schedule.feedbackEvaluation || "Pending",
      });
    }

    let upcomingCount = 0;
    let ongoingCount = 0;
    let completedCount = 0;

    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].statusBadge === "Upcoming") upcomingCount++;
      if (candidates[i].statusBadge === "Ongoing") ongoingCount++;
      if (candidates[i].statusBadge === "Completed") completedCount++;
    }

    return res.status(200).json({
      success: true,
      counts: {
        upcoming: upcomingCount,
        ongoing: ongoingCount,
        completed: completedCount,
        total: candidates.length,
      },
      candidates,
    });
  } catch (error) {
    console.error("Get All Candidates Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// GET CANDIDATE BY ID (Conduct Interviews detail) - SIMPLIFIED
// =========================
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;

    const schedule = await ScheduledInterview.findOne({
      _id: id,
      interviewerId,
    }).populate({
      path: "applicationId",
      populate: [
        { path: "candidateId", select: "name email phone" },
        { 
          path: "advertisementId", 
          select: "jobTitle department employmentType workMode experience skills description" 
        },
      ],
    });

    if (!schedule || !schedule.applicationId || !schedule.applicationId.candidateId) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const application = schedule.applicationId;
    const candidate = application.candidateId;
    const advertisement = application.advertisementId;

    // Get round name from pipeline
    let roundName = "Interview Round";
    const pipeline = await InterviewPipeline.findOne({ advertisementId: advertisement?._id });
    if (pipeline && pipeline.rounds && pipeline.rounds[schedule.roundIndex]) {
      roundName = pipeline.rounds[schedule.roundIndex];
    }

    // Get total rounds
    const totalRounds = pipeline?.rounds?.length || 0;

    // Build timeline/workflow progress
    const timeline = [];
    if (pipeline && pipeline.rounds) {
      for (let i = 0; i < pipeline.rounds.length; i++) {
        let status = "pending";
        if (i < schedule.roundIndex) {
          status = "done";
        } else if (i === schedule.roundIndex) {
          status = "active";
        }
        
        timeline.push({
          name: pipeline.rounds[i],
          status: status,
        });
      }
    }

    // Get all previous round feedbacks
    const previousFeedbacks = [];
    if (application.roundResults && application.roundResults.length > 0) {
      for (let i = 0; i < schedule.roundIndex; i++) {
        const result = application.roundResults[i];
        if (result) {
          let interviewerName = "Unknown";
          if (result.interviewerId) {
            const prevInterviewer = await Interviewer.findById(result.interviewerId).select("name");
            if (prevInterviewer) interviewerName = prevInterviewer.name;
          }

          // Calculate average rating
          let avgRating = "N/A";
          if (result.evaluation) {
            const ratings = [
              result.evaluation.technicalSkills,
              result.evaluation.problemSolving,
              result.evaluation.communication,
              result.evaluation.behavioralSkills,
              result.evaluation.culturalFit,
            ].filter(r => r);
            
            if (ratings.length > 0) {
              avgRating = (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) + "/5";
            }
          }

          previousFeedbacks.push({
            round: result.roundName || `Round ${i + 1}`,
            interviewer: interviewerName,
            rating: avgRating,
            remarks: result.finalComments || result.coreStrengths || "No remarks",
            recommendation: result.recommendation || "N/A",
          });
        }
      }
    }

    // Meeting link
    const meetingLink =
      schedule.meetingLinkInterviewer ||
      `${process.env.CLIENT_URL}/interview/${schedule.callId}?role=interviewer`;

    return res.status(200).json({
      success: true,
      candidate: {
        // Schedule Info
        scheduleId: schedule._id,
        callId: schedule.callId,
        status: schedule.status,
        feedbackEvaluation: schedule.feedbackEvaluation,
        roundIndex: schedule.roundIndex,
        totalRounds: totalRounds,
        assignedStage: roundName,
        
        // Candidate Info
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || "N/A",
        
        // Job/Position Info
        jobTitleTarget: advertisement?.jobTitle || "N/A",
        departmentPool: advertisement?.department || "N/A",
        employmentType: advertisement?.employmentType || "N/A",
        workMode: advertisement?.workMode || "N/A",
        experienceRequired: advertisement?.experience || "N/A",
        requiredSkills: advertisement?.skills || [],
        jobDescription: advertisement?.description || "No description available",
        
        // Resume
        resume: application.resume?.url || null,
        
        // Meeting Details
        meetingLink,
        interviewDate: schedule.interviewDate,
        interviewTime: schedule.interviewTime,
        
        // Feedback History
        previousFeedbacks,
        
        // Timeline/Workflow
        timeline,
      },
    });
  } catch (error) {
    console.error("Get Candidate By Id Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// GET ALL EVALUATIONS (Post-Interview Roster Queue)
// =========================
export const getAllEvaluations = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;

    const schedules = await ScheduledInterview.find({
      interviewerId,
      status: "Completed",
    }).populate({
      path: "applicationId",
      populate: [
        { path: "candidateId", select: "name email" },
        { path: "advertisementId", select: "jobTitle" },
      ],
    });

    const evaluations = [];
    let pendingCount = 0;
    let submittedCount = 0;

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.applicationId || !schedule.applicationId.candidateId) continue;

      if (schedule.feedbackEvaluation === "Pending") pendingCount++;
      if (schedule.feedbackEvaluation === "Completed") submittedCount++;

      evaluations.push({
        scheduleId: schedule._id,
        candidateName: schedule.applicationId.candidateId.name,
        candidateEmail: schedule.applicationId.candidateId.email,
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        evaluationStatus: schedule.feedbackEvaluation,
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalFinishedInterviews: evaluations.length,
        pendingHrFeedback: pendingCount,
        submittedScorecards: submittedCount,
      },
      evaluations,
    });
  } catch (error) {
    console.error("Get All Evaluations Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// GET EVALUATION BY ID
// =========================
export const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;

    const schedule = await ScheduledInterview.findOne({
      _id: id,
      interviewerId,
    }).populate({
      path: "applicationId",
      populate: [
        { path: "candidateId", select: "name email" },
        { path: "advertisementId", select: "jobTitle" },
      ],
    });

    if (!schedule || !schedule.applicationId) {
      return res.status(404).json({ success: false, message: "Evaluation not found" });
    }

    const application = schedule.applicationId;
    const roundResult = application.roundResults[schedule.roundIndex] || null;
    const isSubmitted = schedule.feedbackEvaluation === "Completed";

    return res.status(200).json({
      success: true,
      isSubmitted,
      candidate: {
        name: application.candidateId.name,
        email: application.candidateId.email,
      },
      assignedTargetRole: application.advertisementId?.jobTitle || "N/A",
      evaluation: isSubmitted
        ? {
            ratings: roundResult?.evaluation || {},
            coreStrengths: roundResult?.coreStrengths || "",
            areasForImprovement: roundResult?.areasForImprovement || "",
            recommendation: roundResult?.recommendation || null,
            finalComments: roundResult?.finalComments || "",
          }
        : null,
    });
  } catch (error) {
    console.error("Get Evaluation By Id Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// =========================
// SUBMIT EVALUATION
// =========================
export const submitEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;
    const {
      technicalSkills,
      problemSolving,
      communication,
      behavioralSkills,
      culturalFit,
      coreStrengths,
      areasForImprovement,
      recommendation,
      finalComments,
    } = req.body;

    if (
      !technicalSkills ||
      !problemSolving ||
      !communication ||
      !behavioralSkills ||
      !culturalFit ||
      !coreStrengths ||
      !areasForImprovement ||
      !recommendation
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except final comments",
      });
    }

    const schedule = await ScheduledInterview.findOne({ _id: id, interviewerId });
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    if (schedule.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Interview must be completed before it can be evaluated",
      });
    }

    if (schedule.feedbackEvaluation === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Evaluation already submitted for this interview",
      });
    }

    const application = await Application.findById(schedule.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }


    application.roundResults[schedule.roundIndex].evaluation = {
      technicalSkills,
      problemSolving,
      communication,
      behavioralSkills,
      culturalFit,
    };
    application.roundResults[schedule.roundIndex].coreStrengths = coreStrengths;
    application.roundResults[schedule.roundIndex].areasForImprovement = areasForImprovement;
    application.roundResults[schedule.roundIndex].recommendation = recommendation;
    application.roundResults[schedule.roundIndex].finalComments = finalComments || "";

    await application.save();

    schedule.feedbackEvaluation = "Completed";
    await schedule.save();

    return res.status(200).json({ success: true, message: "Evaluation submitted successfully" });
  } catch (error) {
    console.error("Submit Evaluation Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Get organization details for interviewer
export const getInterviewerOrganization = async (req, res) => {
  try {
    const organizationId = req.organizationId; // From auth middleware
    
    const organization = await Organization.findById(organizationId)
      .select('name logo location email website industry');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      organization: {
        id: organization._id,
        name: organization.name,
        logo: organization.logo,
        location: organization.location,
        email: organization.email,
        website: organization.website,
        industry: organization.industry,
      },
    });
  } catch (error) {
    console.error("Get Interviewer Organization Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};