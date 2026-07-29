import { InterviewPipeline } from "../models/interviewPipelineModel.js";

// ==========================================
// 1. PIPELINE CONFIGURATION METHODS
// ==========================================


export const roundCreation = async (req, res) => {
  try {
    const organizationId = req.organizationId; 
    const { advertisementId } = req.params;
    const { rounds } = req.body;

    if (!rounds || !Array.isArray(rounds) || rounds.length < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "A valid array of interview rounds is required." 
      });
    }

    const pipeline = await InterviewPipeline.create({organizationId,advertisementId,rounds});

    res.status(200).json({
      success: true,
      message: "Interview pipeline configured successfully.",
      pipeline,
    });
  } catch (error) {
    console.error("Configure Pipeline Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPipeline = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const pipeline = await InterviewPipeline.findOne({
      advertisementId,
      organizationId,
    });

    res.status(200).json({
      success: true,
      rounds: pipeline ? pipeline.rounds : [],
    });
  } catch (error) {
    console.error("Get Pipeline Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};