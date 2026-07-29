import { Advertisement } from "../models/advertisementModel.js";

// ***************************************** 
//    Get Advertisement for Candidate           
// ***************************************** 
export const getCandidateFormAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Advertisement.findById(id)
      .populate("organizationId", "name logo");

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }
    return res.status(200).json({
      success: true,
      job: {
        _id: ad._id,
        jobTitle: ad.jobTitle,
        description: ad.description,
        deadline: ad.deadline,
        organization: {
          name: ad.organizationId.name,
          logo: ad.organizationId.logo,
          organizationId:ad.organizationId._id.toString()
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};