import { Advertisement } from "../models/advertisementModel.js";
import { Application } from "../models/applicationModel.js";
import { AIPamphlet } from "../models/aiPumphletModel.js";
import { savePamphlet } from "../services/pamphletService.js";


export const addAdvertisement = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const {
      jobTitle,
      department,
      employmentType,
      workMode,
      location,
      salary,
      internshipPaid,
      internshipDuration,
      deadline,
      skills,
      description,
      status,
      experience,

      // Pamphlet Data
      generatedImageUrl,
      template,
      colors,
      brandingPreference,
      logoSize,
      headingSize,
    } = req.body;

    const advertisement = await Advertisement.create({
      organizationId,
      jobTitle,
      department,
      employmentType,
      workMode,
      location,
      salary,
      internshipPaid,
      internshipDuration,
      deadline,
      skills,
      description,
      status,
      experience,
    });

    let pamphlet = null;

    if (generatedImageUrl) {
      pamphlet = await savePamphlet({
        advertisementId: advertisement._id,
        organizationId,
        generatedImageUrl,
        template,
        colors,
        brandingPreference,
        logoSize,
        headingSize,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      advertisement,
      pamphlet,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const editAdvertisement = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const {
      
      jobTitle,
      department,
      employmentType,
      workMode,
      location,
      salary,
      internshipPaid,
      internshipDuration,
      deadline,
      skills,
      description,
      status,
      experience,

      // Pamphlet Data
      generatedImageUrl,
      template,
      colors,
      brandingPreference,
      logoSize,
      headingSize,
    } = req.body;

    // Update Advertisement
    const advertisement = await Advertisement.findOneAndUpdate(
      {
        _id: advertisementId,
        organizationId,
      },
      {
        jobTitle,
        department,
        employmentType,
        workMode,
        location,
        salary,
        internshipPaid,
        internshipDuration,
        deadline,
        skills,
        description,
        status,
        experience,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    let pamphlet = null;

    // Create or Update Pamphlet
    if (generatedImageUrl) {
      pamphlet = await savePamphlet({
        advertisementId: advertisement._id,
        organizationId,
        generatedImageUrl,
        template,
        colors,
        brandingPreference,
        logoSize,
        headingSize,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      advertisement,
      pamphlet,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAdvertisementbyId

export const getAdvertisementById = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOne({
      _id: advertisementId,
      organizationId,
    }).lean();

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    const [pamphlet, applicantsCount] = await Promise.all([
      AIPamphlet.findOne({
        advertisementId,
      }).lean(),

      Application.countDocuments({
        organizationId,
        advertisementId,
      }),
    ]);

    return res.status(200).json({
      success: true,

      advertisement: {
        ...advertisement,
        applicantsCount,
      },

      pamphlet,

      applicantsCount,
    });
  } catch (error) {
    console.error(
      "Get Advertisement By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Organization Advertisements

export const getOrganizationAdvertisements = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const advertisements = await Advertisement.find({
      organizationId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const advertisementIds = advertisements.map((ad) => ad._id);

    const applicationCounts = await Application.aggregate([
      {
        $match: {
          organizationId,
          advertisementId: { $in: advertisementIds },
        },
      },
      {
        $group: {
          _id: "$advertisementId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      applicationCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    const advertisementsWithCounts = advertisements.map((ad) => ({
      ...ad,
      applicantsCount: countMap.get(ad._id.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      count: advertisementsWithCounts.length,
      advertisements: advertisementsWithCounts,
    });
  } catch (error) {
    console.error("Get advertisements error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Advertisements

export const deleteAdvertisement = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOneAndDelete({
      _id: advertisementId,
      organizationId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    await AIPamphlet.findOneAndDelete({
      advertisementId,
    });

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};