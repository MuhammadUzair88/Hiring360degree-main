// controllers/interviewController.js

import { ScheduledInterview } from "../models/interviewModel.js";
import { Application } from "../models/applicationModel.js";
import { Candidate } from "../models/candidateModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
import { Advertisement } from "../models/advertisementModel.js";
import { Organization } from "../models/organizationModel.js";
import { chatClient, streamClient, createStreamUser, createVideoCall, admitParticipant, removeParticipant, endCall,muteParticipant } from "../utils/stream.js";
import { sendInterviewEmails } from "../middlewares/email-middleware.js";
import mongoose from "mongoose";

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
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview call not found",
      });
    }

    const application = interview.applicationId;

    // Get round name
    let roundName = "Interview Round";
    try {
      const pipeline = await InterviewPipeline.findOne({
        advertisementId: application?.advertisementId,
      });
      if (pipeline?.rounds?.[interview.roundIndex]) {
        roundName = pipeline.rounds[interview.roundIndex];
      }
    } catch (err) {
      console.warn("Could not fetch pipeline:", err.message);
    }

    // Use stored IDs, with fallback for legacy records
    const streamHostId = interview.streamHostId || `interviewer_${interview.interviewerId}`;
    const streamCandidateId = interview.streamCandidateId || `candidate_${application?.candidateId}`;


    res.status(200).json({
      success: true,
      streamHostId,
      streamCandidateId,
      roundName,
      callId: interview.callId,
      meetingLinkCandidate: interview.meetingLinkCandidate,
      meetingLinkInterviewer: interview.meetingLinkInterviewer,

    });
  } catch (error) {
    console.error("❌ getCallDetails error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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

    // Validate Future Date/Time
    const scheduledDateTime = new Date(`${interviewDate}T${interviewTime}:00`);
    const currentDateTime = new Date();

    if (scheduledDateTime <= currentDateTime) {
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
      interviewDate: interviewDate,
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
      interviewDate: interviewDate,
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

    // Create Stream Users and Video Call
    try {
      // Upsert users
      await createStreamUser({
        id: interviewerStreamId,
        name: interviewer.name,
        email: interviewer.email,
        role: "admin",
      });

      await createStreamUser({
        id: candidateStreamId,
        name: candidate.name,
        email: candidate.email,
        role: "user",
      });

      // Create video call with waiting room
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

      // Create chat channel
      const channel = chatClient.channel("messaging", callId, {
        name: `${roundName} Chat`,
        created_by_id: interviewerStreamId,
        members: [interviewerStreamId, candidateStreamId],
      });
      await channel.create();

      console.log("✅ Stream setup complete");
    } catch (streamError) {
      console.error("❌ Stream API Error:", streamError);
      // Continue even if Stream fails
    }

    // Create Join Links
    const meetingLinkCandidate = `${process.env.CLIENT_URL}/interview/${callId}?role=candidate&name=${encodeURIComponent(candidate.name)}`;
    const meetingLinkInterviewer = `${process.env.CLIENT_URL}/interview/${callId}?role=interviewer&name=${encodeURIComponent(interviewer.name)}`;
    const meetingLink = `${process.env.CLIENT_URL}/interview/${callId}`;

    // Save Interview with Stream IDs
    const interview = await ScheduledInterview.create({
      applicationId,
      interviewerId,
      roundIndex,
      interviewDate,
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
      const scheduledAt = new Date(`${interviewDate}T${interviewTime}:00`);
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

    const [hours, minutes] = time.split(":").map(Number);
    const interviewStartMinutes = hours * 60 + minutes;
    const interviewEndMinutes = interviewStartMinutes + 60;

    const query = {
      interviewerId: new mongoose.Types.ObjectId(interviewerId),
      interviewDate: date,
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

    // ✅ Fetch ALL interviewers once and create a lookup map for names
    const allInterviewers = await Interviewer.find({}).select("name email type");
    const interviewerMap = {};
    allInterviewers.forEach(int => {
      interviewerMap[int._id.toString()] = int;
    });

    const schedules = await ScheduledInterview.find({})
      .populate({
        path: "applicationId",
        populate: [
          { path: "candidateId", select: "name email" },
          { path: "advertisementId", select: "jobTitle" },
        ],
      })
      .populate({
        path: "interviewerId",
        select: "name email type",
      })
      .sort({ interviewDate: -1 });

    // Filter by advertisementId
    const filteredSchedules = schedules.filter(
      s => s.applicationId?.advertisementId?._id?.toString() === advertisementId
    );

    // Get pipeline for round names
    const pipeline = await InterviewPipeline.findOne({
      advertisementId,
      organizationId,
    });

    const mappedSchedules = [];

    for (const sch of filteredSchedules) {
      const application = sch.applicationId;
      
      // ✅ Get interviewer name - try populated first, then lookup map, then fallback
      let interviewerName = "Unknown Interviewer";
      let interviewerEmail = "";
      let interviewerType = "";
      
      if (sch.interviewerId) {
        // If populated object with name
        if (typeof sch.interviewerId === 'object' && sch.interviewerId !== null && sch.interviewerId.name) {
          interviewerName = sch.interviewerId.name;
          interviewerEmail = sch.interviewerId.email || "";
          interviewerType = sch.interviewerId.type || "";
        } 
        // If it has _id (populated but maybe missing name)
        else if (sch.interviewerId._id) {
          const idStr = sch.interviewerId._id.toString();
          const found = interviewerMap[idStr];
          if (found) {
            interviewerName = found.name;
            interviewerEmail = found.email || "";
            interviewerType = found.type || "";
          }
        }
        // If it's just a string/ObjectId
        else {
          const idStr = sch.interviewerId.toString();
          const found = interviewerMap[idStr];
          if (found) {
            interviewerName = found.name;
            interviewerEmail = found.email || "";
            interviewerType = found.type || "";
          }
        }
      }

      // ✅ Get round name
      let roundName = "Interview Round";
      if (pipeline?.rounds?.[sch.roundIndex]) {
        roundName = pipeline.rounds[sch.roundIndex];
      }

      // ✅ Extract round result and feedback
      let roundResult = null;
      let feedback = null;

      if (application?.roundResults && application.roundResults.length > 0) {
        // Try to get by index first
        if (application.roundResults[sch.roundIndex]) {
          roundResult = application.roundResults[sch.roundIndex];
        } 
        // If not found by index, try to find by roundName
        else {
          const targetRoundName = pipeline?.rounds?.[sch.roundIndex];
          if (targetRoundName) {
            roundResult = application.roundResults.find(r => r?.roundName === targetRoundName);
          }
        }

        // Build feedback object if evaluation exists
        if (roundResult) {
        feedback = {
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
        };
      }
      }

      // Format date
      const dateObj = new Date(sch.interviewDate);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      // Format time
      let timeStr = sch.interviewTime;
      if (timeStr && timeStr.includes('T')) {
        const timeDate = new Date(timeStr);
        timeStr = `${String(timeDate.getHours()).padStart(2, '0')}:${String(timeDate.getMinutes()).padStart(2, '0')}`;
      }

      mappedSchedules.push({
        _id: sch._id,
        callId: sch.callId,
        applicationId: {
          candidateId: application?.candidateId || null,
        },
        interviewerId: sch.interviewerId?._id || sch.interviewerId,
        interviewerDetails: {
          _id: sch.interviewerId?._id || sch.interviewerId,
          name: interviewerName,
          email: interviewerEmail,
          type: interviewerType,
        },
        interviewDate: dateStr,
        interviewTime: timeStr,
        roundIndex: sch.roundIndex,
        roundName: roundName,
        status: sch.status,
        feedbackEvaluation: sch.feedbackEvaluation || "Pending",
        candidateName: application?.candidateId?.name || "Unknown Candidate",
        candidateEmail: application?.candidateId?.email || "",
        feedback: feedback,
      });
    }


    return res.status(200).json({
      success: true,
      schedules: mappedSchedules,
    });
  } catch (error) {
    console.error("Get Job Schedules Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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

    const dateStr = new Date(interview.interviewDate).toISOString().split("T")[0];
    const scheduledAt = new Date(`${dateStr}T${interview.interviewTime}:00`);
    const callId = interview.callId;

    const meetingLinkCandidate = `${process.env.CLIENT_URL}/interview/${callId}?role=candidate&name=${encodeURIComponent(candidate.name)}`;
    const meetingLinkInterviewer = `${process.env.CLIENT_URL}/interview/${callId}?role=interviewer&name=${encodeURIComponent(interviewer.name)}`;

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

    const scheduledDateTime = new Date(`${interviewDate}T${interviewTime}:00`);
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
      interviewDate: interviewDate,
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
      interviewDate: interviewDate,
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
          email: interviewer.email,
          role: "admin", 
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
        
        // Remove old host
        if (oldStreamHostId) {
          try {
            await call.updateCallMembers({
              remove_members: [oldStreamHostId],
            });
          } catch (removeErr) {
            console.warn("Could not remove old host:", removeErr.message);
          }
        }
        
        console.log("✅ Stream call members updated");
      } catch (streamError) {
        console.error("❌ Failed to update Stream call members:", streamError);
      }
    }

    // Update the interview
    interview.interviewerId = interviewerId;
    interview.interviewDate = interviewDate;
    interview.interviewTime = interviewTime;
    interview.status = "Scheduled";
    interview.streamHostId = newStreamHostId; // STORE the new host ID
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


// Add this to the BOTTOM of controllers/interviewController.js

// =========================
// ADMIN CALL ACTION (MUTE/REMOVE)
// =========================

export const performAdminCallAction = async (req, res) => {
  try {
    const { callId, userId, action } = req.params;
    
    // Get the call instance from the Server SDK
    const call = streamClient.video.call("default", callId);

    if (action === 'mute') {
      // SERVER SDK MUTE SYNTAX: 
      // We revoke the 'send-audio' permission to effectively mute them
      await call.updateUserPermissions({
        user_id: userId,
        revoke_permissions: ['send-audio'],
      });
      return res.status(200).json({ success: true, message: "Participant muted" });
    } 
    
    else if (action === 'remove') {
      // SERVER SDK REMOVE SYNTAX:
      await call.updateCallMembers({
        remove_members: [userId],
      });
      return res.status(200).json({ success: true, message: "Participant removed" });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error) {
    console.error(`❌ Admin action '${req.params.action}' failed:`, error);
    res.status(500).json({ success: false, message: error.message });

  }}
// =========================
// END CALL - ONLY UPDATES INTERVIEW STATUS
// =========================
export const endInterviewCall = async (req, res) => {
  try {
    const { callId } = req.params;
    
    console.log("🔚 Ending interview call:", callId);
    
    // Find the interview
    const interview = await ScheduledInterview.findOne({ callId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // End the Stream call
    try {
      await endCall(callId);
      console.log("✅ Stream call ended");
    } catch (streamError) {
      console.warn("⚠️ Stream call end error (may already be ended):", streamError.message);
    }
    
    // ONLY UPDATE INTERVIEW STATUS TO COMPLETED
    interview.status = "Completed";
    await interview.save();
    
    console.log("✅ Interview status updated to Completed:", callId);
    
    res.status(200).json({
      success: true,
      message: "Interview session ended successfully",
      interviewId: interview._id,
      status: "Completed",
    });
    
  } catch (error) {
    console.error("❌ End call error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to end interview",
    });

  }
}; 



