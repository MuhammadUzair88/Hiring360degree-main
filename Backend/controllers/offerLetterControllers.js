// controllers/offerLetterController.js

import { OfferLetterSettings } from "../models/offerTemplateSettingModal.js";
import { OfferLetter } from "../models/candidateOfferLetterModal.js";
import { Application } from "../models/applicationModel.js";
import { sendOfferLetterEmail } from "../middlewares/email-middleware.js";

// =========================
// GET OFFERED CANDIDATES (the "Offered" stage list for an advertisement)
// =========================
export const getOfferedCandidates = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const applications = await Application.find({
      advertisementId,
      organizationId,
      status: "Offered",
    })
      .populate("candidateId", "name email")
      .populate("advertisementId", "jobTitle")
      .sort({ createdAt: -1 });

    const applicationIds = applications.map((a) => a._id);
    
    // ✅ Get offer letters with status
    const offerLetters = await OfferLetter.find({ 
      applicationId: { $in: applicationIds } 
    });

    // Create a map for quick lookup
    const offerLetterMap = {};
    offerLetters.forEach(ol => {
      offerLetterMap[ol.applicationId.toString()] = ol;
    });

    const candidates = applications
      .filter((app) => app.candidateId)
      .map((app) => {
        const ol = offerLetterMap[app._id.toString()];
        return {
          applicationId: app._id,
          name: app.candidateId.name,
          email: app.candidateId.email,
          position: app.advertisementId?.jobTitle || "N/A",
          hasOffer: !!ol,
          status: ol?.status || "Pending", // ✅ "Notified" or "Pending"
          notified: ol?.status === "Notified",
          joiningDate: ol?.content?.joiningDate || null,
          endingDate: ol?.content?.endingDate || null,
        };
      });

    return res.status(200).json({ success: true, candidates });
  } catch (error) {
    console.error("getOfferedCandidates error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// CUSTOMIZE OFFER LETTER SETTINGS (HR — theme/sizes/signature per advertisement)
// =========================
export const customizeOfferLetterSettings = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const {
      template,
      colors,
      brandingPreference,
      logoSize,
      headingSize,
      bodyFontSize,
      signatureSize,
      spacing,
      signatureUrl,
    } = req.body;

    const update = {
      organizationId,
      template,
      colors,
      brandingPreference,
      logoSize,
      headingSize,
      bodyFontSize,
      signatureSize,
      spacing,
    };

    if (signatureUrl) {
      update.signature = { url: signatureUrl, uploadedAt: new Date() };
    }

    const settings = await OfferLetterSettings.findOneAndUpdate(
      { advertisementId, organizationId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Offer letter settings saved",
      settings,
    });
  } catch (error) {
    console.error("customizeOfferLetterSettings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// CUSTOMIZE A CANDIDATE'S OFFER LETTER (per-application content)
// Requires OfferLetterSettings to already exist for this advertisement —
// that's where templateSettingId comes from.
// =========================
export const customizeCandidateOfferLetter = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;
    const { paragraph1, paragraph2, paragraph3, joiningDate, endingDate, additionalFields } = req.body;

    const application = await Application.findOne({ _id: applicationId, organizationId });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.status !== "Offered") {
      return res.status(400).json({
        success: false,
        message: "Offer letter can only be customized once the candidate is in Offered status",
      });
    }

    const settings = await OfferLetterSettings.findOne({
      advertisementId: application.advertisementId,
      organizationId,
    });

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: "Configure the offer letter settings for this advertisement first",
      });
    }

    const offerLetter = await OfferLetter.findOneAndUpdate(
      { applicationId },
      {
        $set: {
          candidateId: application.candidateId,
          advertisementId: application.advertisementId,
          organizationId,
          templateSettingId: settings._id,
          content: {
            paragraph1,
            paragraph2,
            paragraph3,
            joiningDate,
            endingDate,
            additionalFields,
          },
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Candidate offer letter saved",
      offerLetter,
    });
  } catch (error) {
    console.error("customizeCandidateOfferLetter error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// NOTIFY CANDIDATE — send the offer letter by email
// =========================
export const notifyCandidate = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;
    const { offerLetterImageUrl } = req.body; // ✅ GET THE IMAGE URL


    const application = await Application.findOne({ _id: applicationId, organizationId })
      .populate("candidateId", "name email phone")
      .populate("advertisementId", "jobTitle department employmentType workMode experience salary")
      .populate("organizationId", "name logo email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const offerLetter = await OfferLetter.findOne({ applicationId }).populate("templateSettingId");
    if (!offerLetter) {
      return res.status(400).json({
        success: false,
        message: "Customize the candidate's offer letter before notifying them",
      });
    }

    // ✅ SAVE THE CLOUDINARY URL
    if (offerLetterImageUrl) {
      offerLetter.offerLetterUrl = offerLetterImageUrl;
    }

    // ✅ UPDATE STATUS
    offerLetter.status = "Notified";
    await offerLetter.save();
    const org = application.organizationId || {};

    // ✅ SEND EMAIL WITH CORRECT PARAMS
    const emailResult = await sendOfferLetterEmail({
      candidateEmail: application.candidateId.email,
      candidateName: application.candidateId.name,
      jobTitle: application.advertisementId.jobTitle,
      orgName: org.name || "Our Company",
      organizationLogo: org.logo || null,
      joiningDate: offerLetter.content?.joiningDate,
      salary: application.advertisementId.salary,
      department: application.advertisementId.department,
      offerLetterId: offerLetter._id.toString(),
      supportEmail: org.email || process.env.SUPPORT_EMAIL || "support@company.com",
      offerLetterImageUrl: offerLetter.offerLetterUrl,
    });
    if (!emailResult?.success) {
      console.error("Email failed:", emailResult?.error);
      // Still return success since offer letter is saved
    }

    return res.status(200).json({
      success: true,
      message: "Candidate notified successfully",
      offerLetter,
    });
  } catch (error) {
    console.error("notifyCandidate error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// =========================
// GET OFFER LETTER SETTINGS
// =========================
export const getOfferLetterSettings = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const settings = await OfferLetterSettings.findOne({
      advertisementId,
      organizationId,
    });

    return res.status(200).json({
      success: true,
      settings: settings || null,
    });
  } catch (error) {
    console.error("getOfferLetterSettings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET CANDIDATE OFFER LETTER
// =========================
export const getCandidateOfferLetter = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;

    const offerLetter = await OfferLetter.findOne({
      applicationId,
      organizationId,
    });
    
    return res.status(200).json({
      success: true,
      offerLetter: offerLetter || null,
    });
  } catch (error) {
    console.error("getCandidateOfferLetter error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};