
// controllers/interviewController.js

import { ScheduledInterview } from "../models/interviewModel.js";
import { Application } from "../models/applicationModel.js";
import { Candidate } from "../models/candidateModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
import { Advertisement } from "../models/advertisementModel.js";
import { Organization } from "../models/organizationModel.js";
import { chatClient, streamClient, createStreamUser, createVideoCall, ensureInterviewChatChannel, admitParticipant, removeParticipant, endCall, muteParticipant } from "../utils/stream.js";
import { sendInterviewEmails } from "../middlewares/email-middleware.js";
import mongoose from "mongoose";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseDateOnlyToUtc(value) {
  if (typeof value !== "string" || !DATE_ONLY_RE.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function toDateOnlyString(value) {
  if (!value) return "";
  if (typeof value === "string" && DATE_ONLY_RE.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // IMPORTANT: use UTC/ISO for a date-only Mongo value. Using local
  // getDate()/getMonth() can turn Aug 10 into Aug 9 on servers west of UTC.
  return date.toISOString().slice(0, 10);
}

function parseLocalScheduleDateTime(dateValue, timeValue) {
  const date = parseDateOnlyToUtc(dateValue);
  if (!date || typeof timeValue !== "string" || !TIME_24_RE.test(timeValue)) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

// =========================
// GET CALL DETAILS (PUBLIC)
// =========================
export const getCallDetails = async (req, res) => {
  try {
    const { callId } = req.params;

    const interview = await ScheduledInterview.findOne({ callId })
      .populate({
        path: "applicationId",
        select: "candidateId advertisementId",
        populate: { path: "candidateId", select: "name email" },
      })
      .populate({ path: "interviewerId", select: "name email" });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview call not found",
      });
    }

    const application = interview.applicationId;
    const candidate = application?.candidateId;
    const interviewer = interview.interviewerId;

    let roundName = "Interview Round";
    try {
      const pipeline = await InterviewPipeline.findOne({
        advertisementId: application?.advertisementId,
      }).lean();
      if (pipeline?.rounds?.[interview.roundIndex]) {
        roundName = pipeline.rounds[interview.roundIndex];
      }
    } catch (err) {
      console.warn("Could not fetch pipeline:", err.message);
    }

    const streamHostId =
      interview.streamHostId || `interviewer_${interviewer?._id || interview.interviewerId}`;
    const streamCandidateId =
      interview.streamCandidateId || `candidate_${candidate?._id || candidate || "candidate"}`;

    return res.status(200).json({
      success: true,
      scheduleId: String(interview._id),
      interviewId: String(interview._id),
      applicationId: String(application?._id || ""),
      roundIndex: interview.roundIndex,
      roundName,
      status: interview.status,
      feedbackEvaluation: interview.feedbackEvaluation,
      callId: interview.callId,
      streamHostId,
      streamCandidateId,
      candidateName: candidate?.name || "Candidate",
      interviewerName: interviewer?.name || "Interviewer",
      meetingLinkCandidate: interview.meetingLinkCandidate,
      meetingLinkInterviewer: interview.meetingLinkInterviewer,
    });
  } catch (error) {
    console.error("getCallDetails error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// MARK CALL STARTED
// =========================
export const markInterviewCallStarted = async (req, res) => {
  try {
    const { callId } = req.params;

    const interview = await ScheduledInterview.findOne({ callId });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (["Completed", "Cancelled", "No Show"].includes(interview.status)) {
      return res.status(409).json({
        success: false,
        message: "This interview is no longer active",
      });
    }

    if (interview.status === "Scheduled") {
      interview.status = "Ongoing";
      await interview.save();
    }

    return res.status(200).json({
      success: true,
      scheduleId: String(interview._id),
      status: interview.status,
    });
  } catch (error) {
    console.error("markInterviewCallStarted error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark interview as ongoing",
    });
  }
};

// =========================
// CREATE INTERVIEW
// =========================
export const createInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewerId,
      roundIndex,
      interviewDate,
      interviewTime,
    } = req.body;
  
    const organizationId = req.organizationId;


    // Validation
    if (!applicationId || !interviewerId || roundIndex === undefined || !interviewDate || !interviewTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate the date/time without converting the date-only value through
    // the server's local timezone. The date is stored at UTC midnight below.
    const normalizedInterviewDate = parseDateOnlyToUtc(interviewDate);
    const scheduledDateTime = parseLocalScheduleDateTime(interviewDate, interviewTime);
    if (!normalizedInterviewDate || !scheduledDateTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview date or time. Use YYYY-MM-DD and HH:mm.",
      });
    }

    if (scheduledDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot schedule interview in the past. Please select a future date and time.",
      });
    }

    // Get Application
    const application = await Application.findOne({
      _id: applicationId,
      organizationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check Interviewer Availability
    const [hours, minutes] = interviewTime.split(":").map(Number);
    const interviewStartMinutes = hours * 60 + minutes;
    const interviewEndMinutes = interviewStartMinutes + 60;

    const existingInterviews = await ScheduledInterview.find({
      interviewerId: new mongoose.Types.ObjectId(interviewerId),
      interviewDate: normalizedInterviewDate,
      status: { $ne: "Cancelled" },
    });

    for (const existing of existingInterviews) {
      const [existingHours, existingMinutes] = existing.interviewTime.split(":").map(Number);
      const existingStartMinutes = existingHours * 60 + existingMinutes;
      const existingEndMinutes = existingStartMinutes + 60;

      if (
        (interviewStartMinutes >= existingStartMinutes && interviewStartMinutes < existingEndMinutes) ||
        (interviewEndMinutes > existingStartMinutes && interviewEndMinutes <= existingEndMinutes) ||
        (interviewStartMinutes <= existingStartMinutes && interviewEndMinutes >= existingEndMinutes)
      ) {
        return res.status(409).json({
          success: false,
          message: `Interviewer is already scheduled at ${existing.interviewTime} on ${interviewDate}. Please choose a different time slot.`,
        });
      }
    }

    // Check Candidate Availability
    const candidateInterviews = await ScheduledInterview.find({
      applicationId: new mongoose.Types.ObjectId(applicationId),
      interviewDate: normalizedInterviewDate,
      status: { $ne: "Cancelled" },
    });

    for (const existing of candidateInterviews) {
      const [existingHours, existingMinutes] = existing.interviewTime.split(":").map(Number);
      const existingStartMinutes = existingHours * 60 + existingMinutes;
      const existingEndMinutes = existingStartMinutes + 60;

      if (
        (interviewStartMinutes >= existingStartMinutes && interviewStartMinutes < existingEndMinutes) ||
        (interviewEndMinutes > existingStartMinutes && interviewEndMinutes <= existingEndMinutes) ||
        (interviewStartMinutes <= existingStartMinutes && interviewEndMinutes >= existingEndMinutes)
      ) {
        return res.status(409).json({
          success: false,
          message: "Candidate already has another interview scheduled at this time.",
        });
      }
    }

    // Prevent duplicate scheduling for same round
    const existingRoundInterview = await ScheduledInterview.findOne({
      applicationId: new mongoose.Types.ObjectId(applicationId),
      roundIndex,
      status: { $ne: "Cancelled" },
    });

    if (existingRoundInterview) {
      return res.status(400).json({
        success: false,
        message: "This interview round is already scheduled",
      });
    }

    // Get Candidate
    const candidate = await Candidate.findById(application.candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Get Interviewer
    const interviewer = await Interviewer.findOne({
      _id: interviewerId,
      organizationId,
    });
    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // Get Advertisement
    const advertisement = await Advertisement.findById(application.advertisementId);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Get Organization
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Get Interview Pipeline
    const pipeline = await InterviewPipeline.findOne({
      advertisementId: application.advertisementId,
      organizationId,
    });
    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Interview pipeline not found",
      });
    }

    const roundName = pipeline.rounds[roundIndex];
    if (!roundName) {
      return res.status(400).json({
        success: false,
        message: "Invalid round index",
      });
    }

    // Generate Call ID and Stream User IDs
    const callId = `interview_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const interviewerStreamId = `interviewer_${interviewer._id}`;
    const candidateStreamId = `candidate_${candidate._id}`;

    console.log("📹 Creating Stream call:", callId);
    console.log("  Host ID:", interviewerStreamId);
    console.log("  Candidate ID:", candidateStreamId);

    // Stream resources are part of scheduling success. If this fails we do NOT
    // save a broken interview record or email unusable meeting links.
    await createStreamUser({
      id: interviewerStreamId,
      name: interviewer.name,
      role: "user",
    });

    await createStreamUser({
      id: candidateStreamId,
      name: candidate.name,
      role: "user",
    });

    await createVideoCall(
      callId,
      interviewerStreamId,
      interviewer.name,
      candidateStreamId,
      candidate.name,
      {
        applicationId: application._id.toString(),
        roundName,
        interviewDate,
        interviewTime,
        organizationId: organizationId.toString(),
      }
    );

    await ensureInterviewChatChannel({
      callId,
      hostId: interviewerStreamId,
      participantId: candidateStreamId,
      roundName,
    });

    // Identity comes from the scheduled interview on the backend, not query-string names.
    const meetingLinkCandidate = `${process.env.CLIENT_URL}/interview/${callId}?role=candidate`;
    const meetingLinkInterviewer = `${process.env.CLIENT_URL}/interview/${callId}?role=interviewer`;

    // Save Interview with Stream IDs
    const interview = await ScheduledInterview.create({
      applicationId,
      interviewerId,
      roundIndex,
      interviewDate: normalizedInterviewDate,
      interviewTime,
      meetingLinkCandidate,
      meetingLinkInterviewer,
      callId,
      streamHostId: interviewerStreamId, // SAVE HOST ID
      streamCandidateId: candidateStreamId, // SAVE CANDIDATE ID
      status: "Scheduled",
    });

    // Update Application
    application.status = "Interview";
    if (!application.roundResults[roundIndex]) {
      application.roundResults[roundIndex] = {};
    }
    application.roundResults[roundIndex] = {
      ...application.roundResults[roundIndex],
      roundName,
      interviewerId,
      status: "Pending",
    };
    await application.save();

    // Send Emails
    try {
      const scheduledAt = scheduledDateTime;
      await sendInterviewEmails({
        candidateEmail: candidate.email,
        candidateName: candidate.name,
        interviewerEmail: interviewer.email,
        interviewerName: interviewer.name,
        jobTitle: advertisement.jobTitle,
        orgName: organization.name,
        scheduledAt,
        meetingLinkCandidate,
        meetingLinkInterviewer,
        supportEmail: organization.email,
        organizationLogo: organization.logo,
        roundName,
        callId,
      });
      console.log("✅ Emails sent successfully");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
    }

    // Response
    res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview: {
        ...interview.toObject(),
        roundName,
        streamHostId: interviewerStreamId,
        streamCandidateId: candidateStreamId,
        candidate: {
          id: candidate._id,
          name: candidate.name,
          email: candidate.email,
        },
        interviewer: {
          id: interviewer._id,
          name: interviewer.name,
          email: interviewer.email,
        },
      },
    });
  } catch (error) {
    console.error("❌ createInterview error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// =========================
// CHECK INTERVIEWER AVAILABILITY
// =========================
export const checkInterviewerAvailability = async (req, res) => {
  try {
    const { interviewerId, date, time, excludeScheduleId } = req.query;

    if (!interviewerId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "interviewerId, date, and time are required",
      });
    }

    const normalizedInterviewDate = parseDateOnlyToUtc(date);
    if (!normalizedInterviewDate || !TIME_24_RE.test(time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time. Use YYYY-MM-DD and HH:mm.",
      });
    }

    const interviewerExists = await Interviewer.exists({
      _id: interviewerId,
      organizationId: req.organizationId,
    });
    if (!interviewerExists) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    const [hours, minutes] = time.split(":").map(Number);
    const interviewStartMinutes = hours * 60 + minutes;
    const interviewEndMinutes = interviewStartMinutes + 60;

    const query = {
      interviewerId: new mongoose.Types.ObjectId(interviewerId),
      interviewDate: normalizedInterviewDate,
      status: { $ne: "Cancelled" },
    };

    if (excludeScheduleId && excludeScheduleId !== "undefined") {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeScheduleId) };
    }

    const existingInterviews = await ScheduledInterview.find(query).populate({
      path: "applicationId",
      populate: { path: "candidateId", select: "name" },
    });

    let conflict = null;
    for (const existing of existingInterviews) {
      const [existingHours, existingMinutes] = existing.interviewTime.split(":").map(Number);
      const existingStartMinutes = existingHours * 60 + existingMinutes;
      const existingEndMinutes = existingStartMinutes + 60;

      if (
        (interviewStartMinutes >= existingStartMinutes && interviewStartMinutes < existingEndMinutes) ||
        (interviewEndMinutes > existingStartMinutes && interviewEndMinutes <= existingEndMinutes) ||
        (interviewStartMinutes <= existingStartMinutes && interviewEndMinutes >= existingEndMinutes)
      ) {
        conflict = {
          time: existing.interviewTime,
          candidateName: existing.applicationId?.candidateId?.name || "Unknown",
        };
        break;
      }
    }

    res.status(200).json({
      success: true,
      isAvailable: !conflict,
      conflict,
    });
  } catch (error) {
    console.error("❌ checkInterviewerAvailability error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// GET JOB SCHEDULES
// =========================
export const getJobSchedules = async (req, res) => {
  try {
    const { advertisementId } = req.params;
    const organizationId = req.organizationId;

    // Scope schedules through this organization's applications instead of
    // loading every schedule/interviewer in the database and filtering in JS.
    const applications = await Application.find({
      advertisementId,
      organizationId,
    })
      .select("_id")
      .lean();

    const applicationIds = applications.map((application) => application._id);

    const [pipeline, schedules] = await Promise.all([
      InterviewPipeline.findOne({ advertisementId, organizationId }).lean(),
      ScheduledInterview.find({ applicationId: { $in: applicationIds } })
        .populate({
          path: "applicationId",
          select: "_id candidateId advertisementId roundResults status currentRound",
          populate: { path: "candidateId", select: "name email phone" },
        })
        .populate({
          path: "interviewerId",
          select: "name email type organizationId",
        })
        .sort({ interviewDate: 1, interviewTime: 1 })
        .lean(),
    ]);

    const mappedSchedules = schedules.map((sch) => {
      const application = sch.applicationId;
      const interviewer = sch.interviewerId;
      const roundName = pipeline?.rounds?.[sch.roundIndex] || "Interview Round";

      let roundResult = application?.roundResults?.[sch.roundIndex] || null;
      if (!roundResult && roundName && Array.isArray(application?.roundResults)) {
        roundResult = application.roundResults.find((result) => result?.roundName === roundName) || null;
      }

      const feedback = roundResult
        ? {
            ratings: {
              technicalSkills: roundResult.evaluation?.technicalSkills || 0,
              problemSolving: roundResult.evaluation?.problemSolving || 0,
              communication: roundResult.evaluation?.communication || 0,
              behavioralSkills: roundResult.evaluation?.behavioralSkills || 0,
              culturalFit: roundResult.evaluation?.culturalFit || 0,
            },
            coreStrengths: roundResult.coreStrengths || "",
            areasForImprovement: roundResult.areasForImprovement || "",
            recommendation: roundResult.recommendation || "",
            finalComments: roundResult.finalComments || "",
            status: roundResult.status || "Pending",
          }
        : null;

      return {
        _id: sch._id,
        callId: sch.callId,
        applicationId: {
          _id: application?._id || null,
          candidateId: application?.candidateId || null,
        },
        interviewerId: interviewer?._id || null,
        interviewerDetails: {
          _id: interviewer?._id || null,
          name: interviewer?.name || "Unknown Interviewer",
          email: interviewer?.email || "",
          type: interviewer?.type || "",
        },
        interviewDate: toDateOnlyString(sch.interviewDate),
        interviewTime: sch.interviewTime || "",
        roundIndex: sch.roundIndex,
        roundName,
        status: sch.status,
        feedbackEvaluation: sch.feedbackEvaluation || "Pending",
        candidateName: application?.candidateId?.name || "Unknown Candidate",
        candidateEmail: application?.candidateId?.email || "",
        feedback,
      };
    });

    return res.status(200).json({
      success: true,
      schedules: mappedSchedules,
    });
  } catch (error) {
    console.error("Get Job Schedules Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load interview schedules",
    });
  }
};

// =========================
// RESEND INTERVIEW EMAIL
// =========================
export const resendInterviewEmail = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const organizationId = req.organizationId;

    console.log("📧 Resending email for schedule:", scheduleId);

    const interview = await ScheduledInterview.findById(scheduleId)
      .populate("interviewerId")
      .populate({
        path: "applicationId",
        populate: [{ path: "candidateId" }, { path: "advertisementId" }],
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview schedule not found",
      });
    }

    if (interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This interview has been cancelled and cannot be resent.",
      });
    }

    const application = interview.applicationId;
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    let actualOrgId = null;
    if (application.organizationId) {
      actualOrgId = application.organizationId.toString();
    }
    if (!actualOrgId && application.advertisementId?.organizationId) {
      actualOrgId = application.advertisementId.organizationId.toString();
    }
    if (!actualOrgId) {
      const ad = await Advertisement.findById(application.advertisementId?._id || application.advertisementId);
      if (ad) actualOrgId = ad.organizationId?.toString();
    }

    const reqOrgId = organizationId?.toString();
    if (actualOrgId && reqOrgId && actualOrgId !== reqOrgId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this interview",
      });
    }

    const candidate = application.candidateId;
    const advertisement = application.advertisementId;
    const interviewer = interview.interviewerId;

    if (!candidate || !advertisement || !interviewer) {
      return res.status(400).json({
        success: false,
        message: "Missing required information.",
      });
    }

    const organization = reqOrgId ? await Organization.findById(reqOrgId) : null;
    const orgName = organization?.name || "Company";
    const orgEmail = organization?.email || process.env.EMAIL_FROM;
    const orgLogo = organization?.logo || null;

    const pipeline = await InterviewPipeline.findOne({
      advertisementId: advertisement._id || advertisement,
      organizationId: actualOrgId || reqOrgId,
    });
    const roundName = pipeline?.rounds?.[interview.roundIndex] || "Interview Round";

    const dateStr = toDateOnlyString(interview.interviewDate);
    const scheduledAt = parseLocalScheduleDateTime(dateStr, interview.interviewTime);
    if (!scheduledAt) {
      return res.status(400).json({ success: false, message: "Interview has an invalid stored date/time." });
    }
    const callId = interview.callId;

    const meetingLinkCandidate = `${process.env.CLIENT_URL}/interview/${callId}?role=candidate`;
    const meetingLinkInterviewer = `${process.env.CLIENT_URL}/interview/${callId}?role=interviewer`;

    const emailResult = await sendInterviewEmails({
      candidateEmail: candidate.email,
      candidateName: candidate.name,
      interviewerEmail: interviewer.email,
      interviewerName: interviewer.name,
      jobTitle: advertisement.jobTitle,
      orgName: orgName,
      scheduledAt: scheduledAt,
      meetingLinkCandidate,
      meetingLinkInterviewer,
      supportEmail: orgEmail,
      organizationLogo: orgLogo,
      roundName,
      callId,
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error || "Failed to send emails");
    }

    interview.status = "Scheduled";
    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview invitations resent successfully",
    });
  } catch (error) {
    console.error("❌ Resend Email Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to resend interview emails",
    });
  }
};

// =========================
// UPDATE INTERVIEW
// =========================
export const updateInterview = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { interviewerId, interviewDate, interviewTime } = req.body;
    const organizationId = req.organizationId;


    const interview = await ScheduledInterview.findById(scheduleId);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const application = await Application.findOne({
      _id: interview.applicationId,
      organizationId,
    });
    if (!application) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this interview" });
    }

    if (!interviewerId || !interviewDate || !interviewTime) {
      return res.status(400).json({ 
        success: false, 
        message: "interviewerId, interviewDate, and interviewTime are required" 
      });
    }

    if (["Completed", "Cancelled"].includes(interview.status)) {
      return res.status(400).json({
        success: false,
        message: `A ${interview.status.toLowerCase()} interview cannot be rescheduled.`,
      });
    }

    const normalizedInterviewDate = parseDateOnlyToUtc(interviewDate);
    const scheduledDateTime = parseLocalScheduleDateTime(interviewDate, interviewTime);
    if (!normalizedInterviewDate || !scheduledDateTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview date or time. Use YYYY-MM-DD and HH:mm.",
      });
    }
    if (scheduledDateTime <= new Date()) {
      return res.status(400).json({ success: false, message: "Cannot schedule interview in the past" });
    }

    // Check interviewer availability
    const [hours, minutes] = interviewTime.split(":").map(Number);
    const interviewStartMinutes = hours * 60 + minutes;
    const interviewEndMinutes = interviewStartMinutes + 60;

    const existingInterviews = await ScheduledInterview.find({
      _id: { $ne: scheduleId },
      interviewerId: new mongoose.Types.ObjectId(interviewerId),
      interviewDate: normalizedInterviewDate,
      status: { $ne: "Cancelled" },
    });

    for (const existing of existingInterviews) {
      const [existingHours, existingMinutes] = existing.interviewTime.split(":").map(Number);
      const existingStartMinutes = existingHours * 60 + existingMinutes;
      const existingEndMinutes = existingStartMinutes + 60;
      if (
        (interviewStartMinutes >= existingStartMinutes && interviewStartMinutes < existingEndMinutes) ||
        (interviewEndMinutes > existingStartMinutes && interviewEndMinutes <= existingEndMinutes) ||
        (interviewStartMinutes <= existingStartMinutes && interviewEndMinutes >= existingEndMinutes)
      ) {
        return res.status(409).json({
          success: false,
          message: `Interviewer is already scheduled at ${existing.interviewTime} on ${interviewDate}`,
        });
      }
    }

    // Check candidate availability
    const candidateInterviews = await ScheduledInterview.find({
      _id: { $ne: scheduleId },
      applicationId: interview.applicationId,
      interviewDate: normalizedInterviewDate,
      status: { $ne: "Cancelled" },
    });

    for (const existing of candidateInterviews) {
      const [existingHours, existingMinutes] = existing.interviewTime.split(":").map(Number);
      const existingStartMinutes = existingHours * 60 + existingMinutes;
      const existingEndMinutes = existingStartMinutes + 60;
      if (
        (interviewStartMinutes >= existingStartMinutes && interviewStartMinutes < existingEndMinutes) ||
        (interviewEndMinutes > existingStartMinutes && interviewEndMinutes <= existingEndMinutes) ||
        (interviewStartMinutes <= existingStartMinutes && interviewEndMinutes >= existingEndMinutes)
      ) {
        return res.status(409).json({
          success: false,
          message: "Candidate already has another interview at this time",
        });
      }
    }

    const interviewer = await Interviewer.findOne({ _id: interviewerId, organizationId });
    if (!interviewer) {
      return res.status(404).json({ success: false, message: "Interviewer not found" });
    }

    // Check if interviewer changed - update Stream call if so
    const newStreamHostId = `interviewer_${interviewerId}`;
    const oldStreamHostId = interview.streamHostId;

    if (oldStreamHostId && oldStreamHostId !== newStreamHostId) {
      console.log("🔄 Interviewer changed, updating Stream call members...");
      try {

        await createStreamUser({
          id: newStreamHostId,
          name: interviewer.name,
          role: "user",
        });

        const call = streamClient.video.call("default", interview.callId);
        
        // Add new host
        await call.updateCallMembers({
          update_members: [
            {
              user_id: newStreamHostId,
              role: "host",
            },
          ],
        });
        
        const channel = chatClient.channel("messaging", interview.callId);
        await channel.addMembers([newStreamHostId]);

        // Removal of the previous host is cleanup; failure here should not stop
        // the newly assigned interviewer from using the repaired call.
        if (oldStreamHostId) {
          try {
            await call.updateCallMembers({
              remove_members: [oldStreamHostId],
            });
            await channel.removeMembers([oldStreamHostId]);
          } catch (removeErr) {
            console.warn("Could not remove old host:", removeErr.message);
          }
        }
        
        console.log("✅ Stream call/chat host updated");
      } catch (streamError) {
        console.error("❌ Failed to update Stream call members:", streamError);
        return res.status(502).json({
          success: false,
          message: "The interviewer was not changed because the live interview room could not be updated.",
        });
      }
    }

    // Update the interview
    interview.interviewerId = interviewerId;
    interview.interviewDate = normalizedInterviewDate;
    interview.interviewTime = interviewTime;
    interview.status = "Scheduled";
    interview.streamHostId = newStreamHostId; // STORE the new host ID
    interview.meetingLinkInterviewer = `${process.env.CLIENT_URL}/interview/${interview.callId}?role=interviewer`;
    await interview.save();

    // Update application round results
    if (application.roundResults[interview.roundIndex]) {
      application.roundResults[interview.roundIndex].interviewerId = interviewerId;
      await application.save();
    }

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview: { 
        ...interview.toObject(), 
        streamHostId: newStreamHostId,
        interviewer: { 
          id: interviewer._id, 
          name: interviewer.name, 
          email: interviewer.email 
        } 
      },
    });
  } catch (error) {
    console.error("❌ updateInterview error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to update interview" 
    });
  }
};

// =========================
// CANCEL INTERVIEW SCHEDULE
// =========================
export const cancelInterview = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const organizationId = req.organizationId;

    const interview = await ScheduledInterview.findById(scheduleId);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const application = await Application.findOne({
      _id: interview.applicationId,
      organizationId,
    });
    if (!application) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this interview",
      });
    }

    if (interview.status === "Cancelled") {
      return res.status(200).json({
        success: true,
        message: "Interview is already cancelled",
        interview,
      });
    }

    if (interview.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "A completed interview cannot be cancelled",
      });
    }

    // Best effort: invalidate the associated Stream room too. The database
    // cancellation still succeeds if Stream says the room is already ended.
    if (interview.callId) {
      try {
        await endCall(interview.callId);
      } catch (streamError) {
        console.warn("Could not end Stream call while cancelling:", streamError.message);
      }
    }

    interview.status = "Cancelled";
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully",
      interview,
    });
  } catch (error) {
    console.error("❌ cancelInterview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel interview",
    });
  }
};

// =========================
// ADMIT CANDIDATE
// =========================
export const admitCandidateToCall = async (req, res) => {
  try {
    const { callId, userId } = req.params;
    await admitParticipant(callId, userId);
    res.status(200).json({ success: true, message: "Candidate admitted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// REMOVE PARTICIPANT
// =========================
export const removeCandidateFromCall = async (req, res) => {
  try {
    const { callId, userId } = req.params;
    await removeParticipant(callId, userId);
    res.status(200).json({ success: true, message: "Participant removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GRANT PERMISSIONS (PUBLIC)
// =========================
export const grantPermissions = async (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, permissions } = req.body;
    
    const call = streamClient.video.call("default", callId);
    
    // Node.js Server SDK syntax for updating permissions
    await call.updateUserPermissions({
      user_id: userId,
      grant_permissions: permissions,
    });
    
    res.status(200).json({ success: true, message: "Permissions granted" });
  } catch (error) {
    console.error("❌ Grant permissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// REVOKE PERMISSIONS (PUBLIC)
// =========================
export const revokePermissions = async (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, permissions } = req.body;
    
    const call = streamClient.video.call("default", callId);
    
    // Node.js Server SDK syntax for updating permissions
    await call.updateUserPermissions({
      user_id: userId,
      revoke_permissions: permissions,
    });
    
    res.status(200).json({ success: true, message: "Permissions revoked" });
  } catch (error) {
    console.error("❌ Revoke permissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// =========================
// END CALL - ONLY UPDATES INTERVIEW STATUS
// =========================
export const endInterviewCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const interview = req.callInterview || await ScheduledInterview.findOne({ callId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    try {
      await endCall(callId);
    } catch (streamError) {
      // If Stream already considers the call ended we still complete the DB
      // record, so the interviewer can submit feedback consistently.
      console.warn("Stream call end warning:", streamError.message);
    }

    interview.status = "Completed";
    interview.feedbackEvaluation = "Pending";
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview session ended successfully",
      interviewId: String(interview._id),
      scheduleId: String(interview._id),
      status: interview.status,
      feedbackEvaluation: interview.feedbackEvaluation,
    });
  } catch (error) {
    console.error("End call error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to end interview",
    });
  }
}; 



