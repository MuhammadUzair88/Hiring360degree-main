
// controllers/interviewerDashboardController.js
import mongoose from "mongoose";
import { ScheduledInterview } from "../models/interviewModel.js";
import { Application } from "../models/applicationModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { Organization } from "../models/organizationModel.js";

const MAX_LIST_LIMIT = 100;

function isValidId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function toDateOnlyString(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function normalizePage(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeLimit(value, fallback = 20) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, MAX_LIST_LIMIT);
}

function scheduleStatusBadge(status) {
  switch (status) {
    case "Scheduled":
      return "Upcoming";
    case "Ongoing":
      return "Ongoing";
    case "Completed":
      return "Completed";
    case "No Show":
      return "No Show";
    case "Cancelled":
      return "Cancelled";
    default:
      return status || "Upcoming";
  }
}

async function getPipelineMap(schedules, organizationId) {
  const advertisementIds = [
    ...new Set(
      schedules
        .map((schedule) => {
          const advertisement = schedule.applicationId?.advertisementId;
          return String(advertisement?._id || advertisement || "");
        })
        .filter(Boolean)
    ),
  ];

  if (advertisementIds.length === 0) return new Map();

  const pipelines = await InterviewPipeline.find({
    advertisementId: { $in: advertisementIds },
    organizationId,
  })
    .select("advertisementId rounds")
    .lean();

  return new Map(
    pipelines.map((pipeline) => [
      String(pipeline.advertisementId),
      pipeline.rounds || [],
    ])
  );
}

function getRoundName(schedule, pipelineMap) {
  const advertisement = schedule.applicationId?.advertisementId;
  const advertisementId = String(advertisement?._id || advertisement || "");
  const rounds = pipelineMap.get(advertisementId) || [];
  return rounds[schedule.roundIndex] || `Round ${Number(schedule.roundIndex || 0) + 1}`;
}

function buildJoinLink(schedule) {
  if (schedule.meetingLinkInterviewer) return schedule.meetingLinkInterviewer;
  if (schedule.callId && process.env.CLIENT_URL) {
    return `${process.env.CLIENT_URL}/interview/${schedule.callId}?role=interviewer`;
  }
  return "";
}

// =========================
// DASHBOARD STATS
// =========================
export const getDashboardStats = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [upcoming, newInterviews, missing, feedbackAwaiting] = await Promise.all([
      ScheduledInterview.countDocuments({
        interviewerId,
        status: "Scheduled",
      }),
      ScheduledInterview.countDocuments({
        interviewerId,
        createdAt: { $gte: sevenDaysAgo },
      }),
      ScheduledInterview.countDocuments({
        interviewerId,
        status: "No Show",
      }),
      ScheduledInterview.countDocuments({
        interviewerId,
        status: "Completed",
        feedbackEvaluation: "Pending",
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        upcoming,
        newInterviews,
        missing,
        feedbackAwaiting,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load dashboard statistics",
    });
  }
};

// =========================
// DASHBOARD CHART
// =========================
export const getDashboardChart = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const now = new Date();
    const requestedYear = Number(req.query.year);
    const requestedMonth = Number(req.query.month);
    const year =
      Number.isInteger(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100
        ? requestedYear
        : now.getFullYear();
    const monthIndex =
      Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
        ? requestedMonth - 1
        : now.getMonth();

    const startOfMonth = new Date(Date.UTC(year, monthIndex, 1));
    const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 1));

    const schedules = await ScheduledInterview.find({
      interviewerId,
      interviewDate: { $gte: startOfMonth, $lt: endOfMonth },
    })
      .select("interviewDate status")
      .lean();

    const numberOfWeeks = Math.ceil(
      new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate() / 7
    );

    const weeks = Array.from({ length: numberOfWeeks }, (_, index) => ({
      week: `Week ${index + 1}`,
      assignedSessions: 0,
      currentCycle: 0,
    }));

    let completedCount = 0;

    schedules.forEach((schedule) => {
      const date = new Date(schedule.interviewDate);
      const day = date.getUTCDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), weeks.length - 1);

      weeks[weekIndex].assignedSessions += 1;

      if (schedule.status === "Completed") {
        weeks[weekIndex].currentCycle += 1;
        completedCount += 1;
      }
    });

    const completionRate = schedules.length
      ? Number(((completedCount / schedules.length) * 100).toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      year,
      month: monthIndex + 1,
      weeks,
      completionRate,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Dashboard Chart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load interview activity",
    });
  }
};

// =========================
// RECENT INTERVIEWS
// =========================
export const getRecentInterviews = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;
    const page = normalizePage(req.query.page, 1);
    const limit = normalizeLimit(req.query.limit, 20);
    const skip = (page - 1) * limit;

    const filter = { interviewerId };

    const [total, schedules] = await Promise.all([
      ScheduledInterview.countDocuments(filter),
      ScheduledInterview.find(filter)
        .populate({
          path: "applicationId",
          select: "candidateId advertisementId",
          populate: [
            { path: "candidateId", select: "name email" },
            { path: "advertisementId", select: "jobTitle department" },
          ],
        })
        .sort({ interviewDate: -1, interviewTime: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const pipelineMap = await getPipelineMap(schedules, organizationId);

    const recentInterviews = schedules
      .filter((schedule) => schedule.applicationId?.candidateId)
      .map((schedule) => ({
        scheduleId: String(schedule._id),
        applicationId: String(schedule.applicationId?._id || ""),
        callId: schedule.callId || "",
        candidateName: schedule.applicationId.candidateId.name,
        candidateEmail: schedule.applicationId.candidateId.email || "",
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        department: schedule.applicationId.advertisementId?.department || "N/A",
        roundName: getRoundName(schedule, pipelineMap),
        interviewDate: toDateOnlyString(schedule.interviewDate),
        interviewTime: schedule.interviewTime || "",
        status: schedule.status,
        feedbackEvaluation: schedule.feedbackEvaluation || "Pending",
        joinLink: buildJoinLink(schedule),
      }));

    return res.status(200).json({
      success: true,
      recentInterviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Recent Interviews Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load recent interviews",
    });
  }
};

// =========================
// LIVE INTERVIEWS
// =========================
export const getLiveInterviews = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    const schedules = await ScheduledInterview.find({
      interviewerId,
      status: "Ongoing",
    })
      .populate({
        path: "applicationId",
        select: "candidateId advertisementId",
        populate: [
          { path: "candidateId", select: "name email" },
          { path: "advertisementId", select: "jobTitle department" },
        ],
      })
      .sort({ interviewDate: 1, interviewTime: 1 })
      .lean();

    const pipelineMap = await getPipelineMap(schedules, organizationId);

    const liveInterviews = schedules
      .filter((schedule) => schedule.applicationId?.candidateId)
      .map((schedule) => ({
        scheduleId: String(schedule._id),
        applicationId: String(schedule.applicationId?._id || ""),
        callId: schedule.callId || "",
        candidateName: schedule.applicationId.candidateId.name,
        candidateEmail: schedule.applicationId.candidateId.email || "",
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        department: schedule.applicationId.advertisementId?.department || "N/A",
        roundName: getRoundName(schedule, pipelineMap),
        interviewDate: toDateOnlyString(schedule.interviewDate),
        interviewTime: schedule.interviewTime || "",
        status: schedule.status,
        joinLink: buildJoinLink(schedule),
      }));

    return res.status(200).json({
      success: true,
      liveInterviews,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Live Interviews Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load live interviews",
    });
  }
};

// =========================
// ALL ASSIGNED INTERVIEWS
// =========================
export const getAllCandidates = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    const schedules = await ScheduledInterview.find({ interviewerId })
      .populate({
        path: "applicationId",
        select: "candidateId advertisementId",
        populate: [
          { path: "candidateId", select: "name email phone" },
          {
            path: "advertisementId",
            select: "jobTitle department employmentType workMode experience skills description",
          },
        ],
      })
      .sort({ interviewDate: -1, interviewTime: -1 })
      .lean();

    const pipelineMap = await getPipelineMap(schedules, organizationId);

    const candidates = schedules
      .filter((schedule) => schedule.applicationId?.candidateId)
      .map((schedule) => ({
        scheduleId: String(schedule._id),
        applicationId: String(schedule.applicationId?._id || ""),
        callId: schedule.callId || "",
        candidateName: schedule.applicationId.candidateId.name,
        candidateEmail: schedule.applicationId.candidateId.email || "",
        candidatePhone: schedule.applicationId.candidateId.phone || "",
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        department: schedule.applicationId.advertisementId?.department || "N/A",
        assignedStage: getRoundName(schedule, pipelineMap),
        roundIndex: schedule.roundIndex,
        interviewDate: toDateOnlyString(schedule.interviewDate),
        interviewTime: schedule.interviewTime || "",
        rawStatus: schedule.status,
        statusBadge: scheduleStatusBadge(schedule.status),
        evaluationStatus: schedule.feedbackEvaluation || "Pending",
        joinLink: buildJoinLink(schedule),
      }));

    const counts = candidates.reduce(
      (accumulator, candidate) => {
        accumulator.total += 1;
        switch (candidate.statusBadge) {
          case "Upcoming":
            accumulator.upcoming += 1;
            break;
          case "Ongoing":
            accumulator.ongoing += 1;
            break;
          case "Completed":
            accumulator.completed += 1;
            break;
          case "No Show":
            accumulator.noShow += 1;
            break;
          case "Cancelled":
            accumulator.cancelled += 1;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        upcoming: 0,
        ongoing: 0,
        completed: 0,
        noShow: 0,
        cancelled: 0,
        total: 0,
      }
    );

    return res.status(200).json({
      success: true,
      counts,
      candidates,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get All Candidates Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load assigned interviews",
    });
  }
};

// =========================
// CANDIDATE / INTERVIEW DETAIL
// =========================
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid interview schedule ID" });
    }

    const schedule = await ScheduledInterview.findOne({
      _id: id,
      interviewerId,
    })
      .populate({
        path: "applicationId",
        populate: [
          { path: "candidateId", select: "name email phone" },
          {
            path: "advertisementId",
            select:
              "jobTitle department employmentType workMode experience skills description location salary",
          },
        ],
      })
      .lean();

    if (!schedule?.applicationId?.candidateId) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const application = schedule.applicationId;
    const candidate = application.candidateId;
    const advertisement = application.advertisementId;

    const pipeline = await InterviewPipeline.findOne({
      advertisementId: advertisement?._id,
      organizationId,
    })
      .select("rounds")
      .lean();

    const rounds = pipeline?.rounds || [];
    const roundName = rounds[schedule.roundIndex] || `Round ${Number(schedule.roundIndex || 0) + 1}`;

    const timeline = rounds.map((name, index) => ({
      name,
      status:
        index < schedule.roundIndex
          ? "done"
          : index === schedule.roundIndex
            ? "active"
            : "pending",
    }));

    const previousFeedbacks = [];

    if (Array.isArray(application.roundResults)) {
      const previousResults = application.roundResults.slice(0, schedule.roundIndex);
      const interviewerIds = previousResults
        .map((result) => result?.interviewerId)
        .filter(Boolean);

      const previousInterviewers = interviewerIds.length
        ? await Interviewer.find({ _id: { $in: interviewerIds } })
            .select("name")
            .lean()
        : [];

      const interviewerMap = new Map(
        previousInterviewers.map((item) => [String(item._id), item.name])
      );

      previousResults.forEach((result, index) => {
        if (!result) return;

        const ratings = [
          result.evaluation?.technicalSkills,
          result.evaluation?.problemSolving,
          result.evaluation?.communication,
          result.evaluation?.behavioralSkills,
          result.evaluation?.culturalFit,
        ].filter((rating) => Number.isFinite(rating));

        const averageRating = ratings.length
          ? `${(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)}/5`
          : "N/A";

        previousFeedbacks.push({
          round: result.roundName || rounds[index] || `Round ${index + 1}`,
          interviewer:
            interviewerMap.get(String(result.interviewerId || "")) || "Unknown",
          rating: averageRating,
          remarks:
            result.finalComments ||
            result.coreStrengths ||
            "No remarks",
          recommendation: result.recommendation || "N/A",
        });
      });
    }

    return res.status(200).json({
      success: true,
      candidate: {
        scheduleId: String(schedule._id),
        applicationId: String(application._id),
        candidateId: String(candidate._id),
        callId: schedule.callId || "",
        status: schedule.status,
        statusBadge: scheduleStatusBadge(schedule.status),
        feedbackEvaluation: schedule.feedbackEvaluation || "Pending",
        roundIndex: schedule.roundIndex,
        totalRounds: rounds.length,
        assignedStage: roundName,

        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || "N/A",

        jobTitleTarget: advertisement?.jobTitle || "N/A",
        departmentPool: advertisement?.department || "N/A",
        employmentType: advertisement?.employmentType || "N/A",
        workMode: advertisement?.workMode || "N/A",
        workLocation: advertisement?.location || "N/A",
        salary: advertisement?.salary || "N/A",
        experienceRequired: advertisement?.experience || "N/A",
        requiredSkills: advertisement?.skills || [],
        jobDescription: advertisement?.description || "No description available",

        resume: application.resume?.url
          ? {
              fileUrl: application.resume.url,
              url: application.resume.url,
              type: application.resume.type || "",
            }
          : null,

        meetingLink: buildJoinLink(schedule),
        interviewDate: toDateOnlyString(schedule.interviewDate),
        interviewTime: schedule.interviewTime || "",

        previousFeedbacks,
        timeline,
      },
    });
  } catch (error) {
    console.error("Get Candidate By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load candidate details",
    });
  }
};

// =========================
// EVALUATIONS
// =========================
export const getAllEvaluations = async (req, res) => {
  try {
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    const schedules = await ScheduledInterview.find({
      interviewerId,
      status: "Completed",
    })
      .populate({
        path: "applicationId",
        select: "candidateId advertisementId",
        populate: [
          { path: "candidateId", select: "name email" },
          { path: "advertisementId", select: "jobTitle department" },
        ],
      })
      .sort({ interviewDate: -1, interviewTime: -1 })
      .lean();

    const pipelineMap = await getPipelineMap(schedules, organizationId);

    const evaluations = schedules
      .filter((schedule) => schedule.applicationId?.candidateId)
      .map((schedule) => ({
        scheduleId: String(schedule._id),
        applicationId: String(schedule.applicationId?._id || ""),
        candidateName: schedule.applicationId.candidateId.name,
        candidateEmail: schedule.applicationId.candidateId.email || "",
        jobTitle: schedule.applicationId.advertisementId?.jobTitle || "N/A",
        department: schedule.applicationId.advertisementId?.department || "N/A",
        roundName: getRoundName(schedule, pipelineMap),
        interviewDate: toDateOnlyString(schedule.interviewDate),
        interviewTime: schedule.interviewTime || "",
        evaluationStatus: schedule.feedbackEvaluation || "Pending",
      }));

    const stats = evaluations.reduce(
      (accumulator, item) => {
        accumulator.totalFinishedInterviews += 1;
        if (item.evaluationStatus === "Completed") {
          accumulator.submittedScorecards += 1;
        } else {
          accumulator.pendingHrFeedback += 1;
        }
        return accumulator;
      },
      {
        totalFinishedInterviews: 0,
        pendingHrFeedback: 0,
        submittedScorecards: 0,
      }
    );

    return res.status(200).json({
      success: true,
      stats,
      evaluations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get All Evaluations Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load evaluations",
    });
  }
};

export const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid interview schedule ID" });
    }

    const schedule = await ScheduledInterview.findOne({
      _id: id,
      interviewerId,
    })
      .populate({
        path: "applicationId",
        populate: [
          { path: "candidateId", select: "name email phone" },
          {
            path: "advertisementId",
            select: "jobTitle department employmentType workMode location",
          },
        ],
      })
      .lean();

    if (!schedule?.applicationId?.candidateId) {
      return res.status(404).json({ success: false, message: "Evaluation not found" });
    }

    const application = schedule.applicationId;
    const candidate = application.candidateId;
    const advertisement = application.advertisementId;
    const roundResult = application.roundResults?.[schedule.roundIndex] || null;
    const isSubmitted = schedule.feedbackEvaluation === "Completed";

    const pipeline = await InterviewPipeline.findOne({
      advertisementId: advertisement?._id,
      organizationId,
    })
      .select("rounds")
      .lean();

    const roundName =
      pipeline?.rounds?.[schedule.roundIndex] ||
      roundResult?.roundName ||
      `Round ${Number(schedule.roundIndex || 0) + 1}`;

    return res.status(200).json({
      success: true,
      scheduleId: String(schedule._id),
      applicationId: String(application._id),
      isSubmitted,
      canSubmit: schedule.status === "Completed" && !isSubmitted,
      interviewStatus: schedule.status,
      feedbackEvaluation: schedule.feedbackEvaluation || "Pending",
      roundIndex: schedule.roundIndex,
      roundName,
      interviewDate: toDateOnlyString(schedule.interviewDate),
      interviewTime: schedule.interviewTime || "",
      resumeUrl: application.resume?.url || null,
      candidate: {
        id: String(candidate._id),
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || "",
      },
      assignedTargetRole: advertisement?.jobTitle || "N/A",
      department: advertisement?.department || "N/A",
      employmentType: advertisement?.employmentType || "N/A",
      workMode: advertisement?.workMode || "N/A",
      workLocation: advertisement?.location || "N/A",
      evaluation: isSubmitted
        ? {
            ratings: roundResult?.evaluation || {},
            coreStrengths: roundResult?.coreStrengths || "",
            areasForImprovement: roundResult?.areasForImprovement || "",
            recommendation: roundResult?.recommendation || "",
            finalComments: roundResult?.finalComments || "",
          }
        : null,
    });
  } catch (error) {
    console.error("Get Evaluation By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load evaluation",
    });
  }
};

export const submitEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewerId = req.interviewerId;
    const organizationId = req.organizationId;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid interview schedule ID" });
    }

    const {
      technicalSkills,
      problemSolving,
      communication,
      behavioralSkills,
      culturalFit,
      coreStrengths,
      areasForImprovement,
      recommendation,
      finalComments = "",
    } = req.body || {};

    const ratings = {
      technicalSkills: Number(technicalSkills),
      problemSolving: Number(problemSolving),
      communication: Number(communication),
      behavioralSkills: Number(behavioralSkills),
      culturalFit: Number(culturalFit),
    };

    const invalidRating = Object.values(ratings).some(
      (rating) => !Number.isFinite(rating) || rating < 1 || rating > 5
    );

    if (invalidRating) {
      return res.status(400).json({
        success: false,
        message: "Every competency rating must be a number from 1 to 5",
      });
    }

    const strengths = String(coreStrengths || "").trim();
    const improvements = String(areasForImprovement || "").trim();
    const recommendationValue = String(recommendation || "").trim();
    const comments = String(finalComments || "").trim();
    const allowedRecommendations = ["Strong Hire", "Hire", "Hold", "No Hire"];

    if (!strengths || !improvements || !allowedRecommendations.includes(recommendationValue)) {
      return res.status(400).json({
        success: false,
        message: "Strengths, areas for improvement, and a valid recommendation are required",
      });
    }

    const schedule = await ScheduledInterview.findOne({
      _id: id,
      interviewerId,
    });

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
      return res.status(409).json({
        success: false,
        message: "Evaluation already submitted for this interview",
      });
    }

    const application = await Application.findOne({
      _id: schedule.applicationId,
      organizationId,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const pipeline = await InterviewPipeline.findOne({
      advertisementId: application.advertisementId,
      organizationId,
    })
      .select("rounds")
      .lean();

    const roundName =
      pipeline?.rounds?.[schedule.roundIndex] ||
      application.roundResults?.[schedule.roundIndex]?.roundName ||
      `Round ${Number(schedule.roundIndex || 0) + 1}`;

    if (!application.roundResults[schedule.roundIndex]) {
      application.roundResults[schedule.roundIndex] = {
        roundName,
        interviewerId,
        status: "Pending",
      };
    }

    const roundResult = application.roundResults[schedule.roundIndex];

    roundResult.roundName = roundResult.roundName || roundName;
    roundResult.interviewerId = interviewerId;
    roundResult.evaluation = ratings;
    roundResult.coreStrengths = strengths;
    roundResult.areasForImprovement = improvements;
    roundResult.recommendation = recommendationValue;
    roundResult.finalComments = comments;

    await application.save();

    schedule.feedbackEvaluation = "Completed";
    await schedule.save();

    return res.status(200).json({
      success: true,
      message: "Evaluation submitted successfully",
      evaluation: {
        ratings,
        coreStrengths: strengths,
        areasForImprovement: improvements,
        recommendation: recommendationValue,
        finalComments: comments,
      },
      feedbackEvaluation: schedule.feedbackEvaluation,
    });
  } catch (error) {
    console.error("Submit Evaluation Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit evaluation",
    });
  }
};

// =========================
// INTERVIEWER ORGANIZATION
// =========================
export const getInterviewerOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.organizationId)
      .select("name logo location email website industry")
      .lean();

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      organization: {
        id: String(organization._id),
        name: organization.name,
        logo: organization.logo || "",
        location: organization.location || "",
        email: organization.email || "",
        website: organization.website || "",
        industry: organization.industry || "",
      },
    });
  } catch (error) {
    console.error("Get Interviewer Organization Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load organization",
    });
  }
};
