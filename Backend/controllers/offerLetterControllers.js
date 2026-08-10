
import mongoose from "mongoose";
import { OfferLetterSettings } from "../models/offerTemplateSettingModal.js";
import { OfferLetter } from "../models/candidateOfferLetterModal.js";
import { Application } from "../models/applicationModel.js";
import { Advertisement } from "../models/advertisementModel.js";
import { sendOfferLetterEmail } from "../middlewares/email-middleware.js";

function isValidId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

async function getOwnedAdvertisement(advertisementId, organizationId) {
  if (!isValidId(advertisementId)) return null;
  return Advertisement.findOne({ _id: advertisementId, organizationId })
    .select("_id jobTitle")
    .lean();
}

function toStoredDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const raw = String(value).trim();
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateOnly(value) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : "";
  }

  return date.toISOString().slice(0, 10);
}

function normalizeAdditionalFields(fields) {
  if (!Array.isArray(fields)) return [];

  const usedIds = new Set();

  return fields
    .map((field) => {
      const label = String(field?.label || "").trim();
      const value = String(field?.value || "");

      let id = String(field?.id || "").trim();
      if (!id || usedIds.has(id)) {
        id = new mongoose.Types.ObjectId().toString();
      }
      usedIds.add(id);

      return { id, label, value };
    })
    .filter((field) => field.label || field.value);
}

// =========================
// GET OFFERED CANDIDATES
// =========================
export const getOfferedCandidates = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    if (!isValidId(advertisementId)) {
      return res.status(400).json({ success: false, message: "Invalid advertisement ID" });
    }

    const advertisement = await getOwnedAdvertisement(advertisementId, organizationId);
    if (!advertisement) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

    const applications = await Application.find({
      advertisementId,
      organizationId,
      status: "Offered",
    })
      .populate("candidateId", "name email phone")
      .populate("advertisementId", "jobTitle")
      .sort({ createdAt: -1 });

    const applicationIds = applications.map((app) => app._id);

    const offerLetters = applicationIds.length
      ? await OfferLetter.find({
          applicationId: { $in: applicationIds },
          organizationId,
        }).lean()
      : [];

    const offerLetterMap = new Map(
      offerLetters.map((offer) => [String(offer.applicationId), offer])
    );

    const candidates = applications
      .filter((app) => app.candidateId)
      .map((app) => {
        const offer = offerLetterMap.get(String(app._id));
        const documentUrl = offer?.offerLetterUrl || app.offerLetterUrl || null;

        return {
          applicationId: app._id,
          name: app.candidateId.name,
          email: app.candidateId.email,
          phone: app.candidateId.phone || "",
          position: app.advertisementId?.jobTitle || "N/A",
          hasOffer: Boolean(offer),
          status: offer?.status || "Pending",
          notified: offer?.status === "Notified",
          offerLetterUrl: documentUrl,
          joiningDate: toDateOnly(offer?.content?.joiningDate),
          endingDate: toDateOnly(offer?.content?.endingDate),
          offerContent: offer?.content
            ? {
                ...offer.content,
                joiningDate: toDateOnly(offer.content.joiningDate),
                endingDate: toDateOnly(offer.content.endingDate),
              }
            : null,
          notifiedAt: offer?.notifiedAt || null,
        };
      });

    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("getOfferedCandidates error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// SAVE OFFER LETTER SETTINGS
// =========================
export const customizeOfferLetterSettings = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { advertisementId } = req.params;

    const advertisement = await getOwnedAdvertisement(advertisementId, organizationId);
    if (!advertisement) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

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
    } = req.body || {};

    const $set = { organizationId, advertisementId };

    if (template !== undefined) $set.template = template;
    if (colors !== undefined) $set.colors = colors;
    if (brandingPreference !== undefined) $set.brandingPreference = brandingPreference;
    if (logoSize !== undefined) $set.logoSize = logoSize;
    if (headingSize !== undefined) $set.headingSize = headingSize;
    if (bodyFontSize !== undefined) $set.bodyFontSize = bodyFontSize;
    if (signatureSize !== undefined) $set.signatureSize = signatureSize;
    if (spacing !== undefined) $set.spacing = spacing;

    const update = { $set };

    if (Object.prototype.hasOwnProperty.call(req.body || {}, "signatureUrl")) {
      if (signatureUrl) {
        $set.signature = { url: signatureUrl, uploadedAt: new Date() };
      } else {
        update.$unset = { signature: 1 };
      }
    }

    const settings = await OfferLetterSettings.findOneAndUpdate(
      { advertisementId, organizationId },
      update,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
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
// SAVE / UPDATE CANDIDATE OFFER LETTER
// =========================
export const customizeCandidateOfferLetter = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;

    if (!isValidId(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const {
      paragraph1,
      paragraph2,
      paragraph3,
      fieldsSectionLabel,
      joiningDate,
      endingDate,
      additionalFields,
      offerLetterImageUrl,
    } = req.body || {};

    const application = await Application.findOne({ _id: applicationId, organizationId });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.status !== "Offered") {
      return res.status(400).json({
        success: false,
        message: "Offer letter can only be created for candidates in Offered status",
      });
    }

    const settings = await OfferLetterSettings.findOne({
      advertisementId: application.advertisementId,
      organizationId,
    });

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: "Configure offer letter settings first",
      });
    }

    const existing = await OfferLetter.findOne({ applicationId, organizationId })
      .select("offerLetterUrl")
      .lean();

    const documentUrl =
      typeof offerLetterImageUrl === "string" && offerLetterImageUrl.trim()
        ? offerLetterImageUrl.trim()
        : existing?.offerLetterUrl || application.offerLetterUrl || "";

    const offerLetter = await OfferLetter.findOneAndUpdate(
      { applicationId, organizationId },
      {
        $set: {
          candidateId: application.candidateId,
          advertisementId: application.advertisementId,
          organizationId,
          templateSettingId: settings._id,
          content: {
            paragraph1: String(paragraph1 || ""),
            paragraph2: String(paragraph2 || ""),
            paragraph3: String(paragraph3 || ""),
            fieldsSectionLabel: String(fieldsSectionLabel || ""),
            joiningDate: toStoredDate(joiningDate),
            endingDate: toStoredDate(endingDate),
            additionalFields: normalizeAdditionalFields(additionalFields),
          },
          offerLetterUrl: documentUrl,
          // Editing a letter means the latest version has not been re-sent yet.
          status: "Pending",
          notifiedAt: null,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    // Keep the legacy Application field in sync for older parts of the project.
    if (documentUrl) {
      await Application.updateOne(
        { _id: applicationId, organizationId },
        { $set: { offerLetterUrl: documentUrl } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Offer letter saved successfully",
      offerLetter: {
        ...offerLetter.toObject(),
        content: {
          ...offerLetter.content.toObject?.(),
          paragraph1: offerLetter.content?.paragraph1 || "",
          paragraph2: offerLetter.content?.paragraph2 || "",
          paragraph3: offerLetter.content?.paragraph3 || "",
          fieldsSectionLabel: offerLetter.content?.fieldsSectionLabel || "",
          additionalFields: offerLetter.content?.additionalFields || [],
          joiningDate: toDateOnly(offerLetter.content?.joiningDate),
          endingDate: toDateOnly(offerLetter.content?.endingDate),
        },
      },
    });
  } catch (error) {
    console.error("customizeCandidateOfferLetter error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// NOTIFY / RESEND OFFER LETTER
// =========================
export const notifyCandidate = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;
    const { offerLetterImageUrl } = req.body || {};

    if (!isValidId(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const application = await Application.findOne({ _id: applicationId, organizationId })
      .populate("candidateId", "name email phone")
      .populate(
        "advertisementId",
        "jobTitle department employmentType workMode experience salary"
      )
      .populate("organizationId", "name logo email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.status !== "Offered") {
      return res.status(400).json({
        success: false,
        message: "Candidate is no longer in the Offered stage",
      });
    }

    if (!application.candidateId?.email) {
      return res.status(400).json({ success: false, message: "Candidate email is missing" });
    }

    const offerLetter = await OfferLetter.findOne({ applicationId, organizationId }).populate(
      "templateSettingId"
    );

    if (!offerLetter) {
      return res.status(400).json({
        success: false,
        message: "Create and save the candidate's offer letter before notifying them",
      });
    }

    const incomingUrl =
      typeof offerLetterImageUrl === "string" ? offerLetterImageUrl.trim() : "";

    if (incomingUrl) {
      offerLetter.offerLetterUrl = incomingUrl;
    } else if (!offerLetter.offerLetterUrl && application.offerLetterUrl) {
      // Recover URLs created by older builds that only used Application.offerLetterUrl.
      offerLetter.offerLetterUrl = application.offerLetterUrl;
    }

    if (!offerLetter.offerLetterUrl) {
      return res.status(400).json({
        success: false,
        message:
          "The saved offer does not have an email attachment yet. Open Edit Offer and save the current letter once.",
      });
    }

    await offerLetter.save();

    const org = application.organizationId || {};

    const emailResult = await sendOfferLetterEmail({
      candidateEmail: application.candidateId.email,
      candidateName: application.candidateId.name,
      jobTitle: application.advertisementId?.jobTitle,
      orgName: org.name || "Our Company",
      organizationLogo: org.logo || null,
      joiningDate: toDateOnly(offerLetter.content?.joiningDate),
      salary: application.advertisementId?.salary,
      department: application.advertisementId?.department,
      offerLetterId: String(offerLetter._id),
      supportEmail:
        org.email || process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || "support@company.com",
      offerLetterImageUrl: offerLetter.offerLetterUrl,
    });

    if (!emailResult?.success) {
      console.error("Offer letter email failed:", emailResult?.error);
      return res.status(502).json({
        success: false,
        message: emailResult?.error || "Offer letter was saved, but the email could not be sent",
      });
    }

    offerLetter.status = "Notified";
    offerLetter.notifiedAt = new Date();
    await offerLetter.save();

    await Application.updateOne(
      { _id: applicationId, organizationId },
      { $set: { offerLetterUrl: offerLetter.offerLetterUrl } }
    );

    return res.status(200).json({
      success: true,
      message: "Candidate notified successfully",
      offerLetter: {
        ...offerLetter.toObject(),
        content: {
          ...offerLetter.content.toObject?.(),
          paragraph1: offerLetter.content?.paragraph1 || "",
          paragraph2: offerLetter.content?.paragraph2 || "",
          paragraph3: offerLetter.content?.paragraph3 || "",
          fieldsSectionLabel: offerLetter.content?.fieldsSectionLabel || "",
          additionalFields: offerLetter.content?.additionalFields || [],
          joiningDate: toDateOnly(offerLetter.content?.joiningDate),
          endingDate: toDateOnly(offerLetter.content?.endingDate),
        },
      },
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

    const advertisement = await getOwnedAdvertisement(advertisementId, organizationId);
    if (!advertisement) {
      return res.status(404).json({ success: false, message: "Advertisement not found" });
    }

    const settings = await OfferLetterSettings.findOne({ advertisementId, organizationId });

    return res.status(200).json({ success: true, settings: settings || null });
  } catch (error) {
    console.error("getOfferLetterSettings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET ONE CANDIDATE OFFER LETTER
// =========================
export const getCandidateOfferLetter = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { applicationId } = req.params;

    if (!isValidId(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const application = await Application.findOne({ _id: applicationId, organizationId })
      .select("_id offerLetterUrl")
      .lean();

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const offerLetter = await OfferLetter.findOne({ applicationId, organizationId }).lean();

    if (!offerLetter) {
      return res.status(200).json({ success: true, offerLetter: null });
    }

    const documentUrl = offerLetter.offerLetterUrl || application.offerLetterUrl || "";

    return res.status(200).json({
      success: true,
      offerLetter: {
        ...offerLetter,
        offerLetterUrl: documentUrl,
        content: {
          ...offerLetter.content,
          paragraph1: offerLetter.content?.paragraph1 || "",
          paragraph2: offerLetter.content?.paragraph2 || "",
          paragraph3: offerLetter.content?.paragraph3 || "",
          fieldsSectionLabel: offerLetter.content?.fieldsSectionLabel || "",
          additionalFields: offerLetter.content?.additionalFields || [],
          joiningDate: toDateOnly(offerLetter.content?.joiningDate),
          endingDate: toDateOnly(offerLetter.content?.endingDate),
        },
      },
    });
  } catch (error) {
    console.error("getCandidateOfferLetter error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
