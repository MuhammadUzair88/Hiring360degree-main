import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Interviewer } from "../models/interviewerModel.js";
import { Organization } from "../models/organizationModel.js";
import { generatePassword } from "../utils/generatePassword.js";
import { sendInterviewerCredentialsEmail } from "../middlewares/email-middleware.js";

const INTERVIEWER_DASHBOARD_LINK = `${process.env.CLIENT_URL || "http://localhost:5173"}/interviewers/dashboard`;

export const addInterviewer = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { name, email, type } = req.body;

    if (!name || !email || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if interviewer already exists
    const existingInterviewer = await Interviewer.findOne({
      organizationId,
      email: email.toLowerCase(),
    });

    if (existingInterviewer) {
      return res.status(400).json({
        success: false,
        message:
          "An interviewer with this email already exists in this organization",
      });
    }

    // 🔐 Auto-generate a login password for the interviewer
    const plainPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const interviewer = await Interviewer.create({
      organizationId,
      name,
      email,
      type,
      password: hashedPassword,
    });

    // Never send the password (plain or hashed) back in the API response
    const { password, ...interviewerSafe } = interviewer.toObject();

    try {
      const organization = await Organization.findById(organizationId);
      const emailStatus = await sendInterviewerCredentialsEmail({
        interviewerEmail: interviewer.email,
        interviewerName: interviewer.name,
        plainPassword,
        orgName: organization?.name || "Our Company",
        organizationLogo: organization?.logo || null,
        dashboardLink: INTERVIEWER_DASHBOARD_LINK,
        supportEmail: organization?.email || process.env.EMAIL_FROM || process.env.EMAIL,
      });

      if (!emailStatus.success) {
        // Avoid leaving an account with a password that was never delivered.
        await Interviewer.deleteOne({ _id: interviewer._id, organizationId });
        return res.status(502).json({
          success: false,
          message:
            "The interviewer account was not kept because the credential email could not be sent. Check the backend email configuration and try again.",
          emailStatus: "failed",
          emailError: emailStatus.error || "The email provider did not accept the message",
          emailCode: emailStatus.code || null,
          emailCommand: emailStatus.command || null,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Interviewer added successfully. Credential email was accepted for delivery.",
        emailStatus: "sent",
        interviewer: interviewerSafe,
      });
    } catch (emailError) {
      console.error("Interviewer credential email failed:", emailError);
      await Interviewer.deleteOne({ _id: interviewer._id, organizationId });
      return res.status(502).json({
        success: false,
        message:
          "The interviewer account was not kept because the credential email could not be sent. Check the backend email configuration and try again.",
        emailStatus: "failed",
        emailError: emailError.message || "The email provider did not accept the message",
        emailCode: emailError.code || null,
        emailCommand: emailError.command || null,
      });
    }
  } catch (error) {
    console.error("Add Interviewer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// INTERVIEWER LOGIN
// =========================
export const loginInterviewer = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    // Generated interviewer passwords contain no spaces. Trimming handles
    // accidental leading/trailing whitespace when credentials are pasted.
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    // Email is unique per organization, not globally. Check every matching
    // account so an older account in another organization cannot shadow the
    // account whose password the interviewer received.
    const matchingEmailAccounts = await Interviewer.find({ email }).select(
      "+password"
    );

    let interviewer = null;
    for (const candidate of matchingEmailAccounts) {
      if (
        candidate.password &&
        (await bcrypt.compare(password, candidate.password))
      ) {
        interviewer = candidate;
        break;
      }
    }

    if (!interviewer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        interviewerId: interviewer._id,
        organizationId: interviewer.organizationId,
        role: "interviewer",
      },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // client stores this (e.g. localStorage) and sends it back as
             // Authorization: Bearer <token> on subsequent requests
      interviewer: {
        id: interviewer._id,
        name: interviewer.name,
        email: interviewer.email,
        type: interviewer.type,
        organizationId: interviewer.organizationId,
      },
    });
  } catch (error) {
    console.error("Interviewer Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const logoutInterviewer = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully. Please discard the token on the client.",
  });
};

export const getInterviewers = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const interviewers = await Interviewer.find({
      organizationId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interviewers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getInterviewerById = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;

    const interviewer = await Interviewer.findOne({
      _id: id,
      organizationId,
    });

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    return res.status(200).json({
      success: true,
      interviewer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateInterviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;
    const { name, email, type } = req.body;

    const interviewer = await Interviewer.findOne({
      _id: id,
      organizationId,
    });

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    interviewer.name = name || interviewer.name;
    interviewer.email = email || interviewer.email;
    interviewer.type = type || interviewer.type;

    await interviewer.save();

    return res.status(200).json({
      success: true,
      message: "Interviewer updated successfully",
      interviewer,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "An interviewer with this email already exists in this organization",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const deleteInterviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;

    const interviewer = await Interviewer.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interviewer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Interviewer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
