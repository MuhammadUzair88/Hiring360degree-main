import { Advertisement } from "../models/advertisementModel.js";
import { Application } from "../models/applicationModel.js";
import { AIPamphlet } from "../models/aiPumphletModel.js";
import { savePamphlet } from "../services/pamphletService.js";

const ADVERTISEMENT_FIELDS = [
  "jobTitle",
  "department",
  "employmentType",
  "workMode",
  "location",
  "salary",
  "internshipPaid",
  "internshipDuration",
  "deadline",
  "skills",
  "description",
  "status",
  "experience",
];

function buildAdvertisementUpdate(body = {}) {
  return ADVERTISEMENT_FIELDS.reduce((update, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      update[field] = body[field];
    }
    return update;
  }, {});
}

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
    console.error("Add advertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const editAdvertisement = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    // Only update fields the client actually sent. This makes small actions
    // such as Close/Reopen safe and prevents undefined values from touching
    // the rest of the advertisement.
    const $set = buildAdvertisementUpdate(req.body);

    const advertisement = await Advertisement.findOneAndUpdate(
      { _id: advertisementId, organizationId },
      { $set },
      { new: true, runValidators: true }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    let pamphlet = null;

    if (req.body.generatedImageUrl) {
      pamphlet = await savePamphlet({
        advertisementId: advertisement._id,
        organizationId,
        generatedImageUrl: req.body.generatedImageUrl,
        template: req.body.template,
        colors: req.body.colors,
        brandingPreference: req.body.brandingPreference,
        logoSize: req.body.logoSize,
        headingSize: req.body.headingSize,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      advertisement,
      pamphlet,
    });
  } catch (error) {
    console.error("Edit advertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
      AIPamphlet.findOne({ advertisementId, organizationId }).lean(),
      Application.countDocuments({ organizationId, advertisementId }),
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
    console.error("Get advertisement by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrganizationAdvertisements = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const advertisements = await Advertisement.find({ organizationId })
      .sort({ createdAt: -1 })
      .lean();

    const advertisementIds = advertisements.map((advertisement) => advertisement._id);

    let countMap = new Map();

    if (advertisementIds.length > 0) {
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

      countMap = new Map(
        applicationCounts.map((item) => [String(item._id), Number(item.count || 0)])
      );
    }

    const advertisementsWithCounts = advertisements.map((advertisement) => ({
      ...advertisement,
      applicantsCount: countMap.get(String(advertisement._id)) || 0,
    }));

    return res.status(200).json({
      success: true,
      count: advertisementsWithCounts.length,
      advertisements: advertisementsWithCounts,
    });
  } catch (error) {
    console.error("Get advertisements error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdvertisement = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOne({
      _id: advertisementId,
      organizationId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Do not create broken candidate/interview/offer history by hard-deleting
    // a posting that already has applications. Closing it is the safe action.
    const applicantsCount = await Application.countDocuments({
      organizationId,
      advertisementId,
    });

    if (applicantsCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This advertisement has candidate history and cannot be permanently deleted. Close the advertisement instead.",
        applicantsCount,
      });
    }

    await Promise.all([
      Advertisement.deleteOne({ _id: advertisementId, organizationId }),
      AIPamphlet.deleteMany({ advertisementId, organizationId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Delete advertisement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
