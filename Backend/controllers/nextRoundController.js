
import { Application } from "../models/applicationModel.js";
import { ScheduledInterview } from "../models/interviewModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
export const decideRoundOutcome = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { decision } = req.body; // "accept" | "reject"
    const organizationId = req.organizationId;

    if (!["accept", "reject"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "decision must be 'accept' or 'reject'",
      });
    }

    const interview = await ScheduledInterview.findById(scheduleId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview schedule not found",
      });
    }

    const application = await Application.findOne({
      _id: interview.applicationId,
      organizationId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or you're not authorized to update it",
      });
    }

    const roundIndex = interview.roundIndex;
    const roundResult = application.roundResults[roundIndex];

    if (!roundResult) {
      return res.status(400).json({
        success: false,
        message: "No round result found for this round — has feedback been submitted?",
      });
    }

    // ─────────────────────────
    // REJECT
    // ─────────────────────────
    if (decision === "reject") {
      roundResult.status = "Failed";
      application.status = "Rejected";
      application.currentRound = roundIndex;

      interview.status = "Completed";

      await application.save();
      await interview.save();

      return res.status(200).json({
        success: true,
        message: "Candidate rejected",
        application,
        isOffered: false,
        nextRoundIndex: null,
        nextRoundName: null,
      });
    }

    // ─────────────────────────
    // ACCEPT
    // ─────────────────────────
    roundResult.status = "Passed";

    const pipeline = await InterviewPipeline.findOne({
      advertisementId: application.advertisementId,
      organizationId,
    });

    const totalRounds = pipeline?.rounds?.length || 0;
    const nextRoundIndex = roundIndex + 1;
    const hasNextRound = nextRoundIndex < totalRounds;

    if (hasNextRound) {
      application.currentRound = nextRoundIndex;
      application.status = "Interview"; // still in pipeline, awaiting next round scheduling
    } else {
      application.currentRound = totalRounds;
      application.status = "Offered";
    }

    interview.status = "Completed";

    await application.save();
    await interview.save();

    return res.status(200).json({
      success: true,
      message: hasNextRound
        ? `Candidate accepted and moved to next round: ${pipeline.rounds[nextRoundIndex]}`
        : "Candidate has completed all interview rounds and marked as Offered",
      application,
      isOffered: !hasNextRound,
      nextRoundIndex: hasNextRound ? nextRoundIndex : null,
      nextRoundName: hasNextRound ? pipeline.rounds[nextRoundIndex] : null,
    });
  } catch (error) {
    console.error("❌ decideRoundOutcome error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// =========================
// GET CANDIDATES FOR A SPECIFIC ROUND
// =========================
export const getRoundCandidates = async (req, res) => {
  try {
    const { advertisementId, roundIndex } = req.params;
    const organizationId = req.organizationId;
    const roundIdx = Number(roundIndex);

    if (Number.isNaN(roundIdx) || roundIdx < 0) {
      return res.status(400).json({ success: false, message: "Invalid round index" });
    }

    const pipeline = await InterviewPipeline.findOne({ advertisementId, organizationId });
    if (!pipeline) {
      return res.status(404).json({ success: false, message: "Interview pipeline not found for this job" });
    }
    if (roundIdx >= pipeline.rounds.length) {
      return res.status(400).json({ success: false, message: "Round index out of range for this pipeline" });
    }

    // Round 0: candidates who are Shortlisted (not yet scheduled) OR Interview (scheduled but not decided)
    // Round N>0: candidates who passed the previous round and are waiting to be scheduled here
    const statusFilter = roundIdx === 0
      ? { $in: ["Shortlisted", "Interview"] }
      : "Interview";

    const applications = await Application.find({
      advertisementId,
      organizationId,
      currentRound: roundIdx,
      status: statusFilter,
    })
      .populate({ path: "candidateId", select: "name email phone" })
      .sort({ createdAt: -1 });

    const candidates = applications
      .filter(app => app.candidateId)
      .map(app => ({
        id: app.candidateId._id,
        applicationId: app._id,
        name: app.candidateId.name,
        email: app.candidateId.email,
        phone: app.candidateId.phone,
        currentRound: app.currentRound,
        status: app.status,
      }));

    return res.status(200).json({
      success: true,
      roundIndex: roundIdx,
      roundName: pipeline.rounds[roundIdx],
      candidates,
    });
  } catch (error) {
    console.error("❌ getRoundCandidates error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};