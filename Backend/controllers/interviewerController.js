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

    res.status(201).json({
      success: true,
      message: "Interviewer added successfully. Credential email is being sent.",
      emailStatus: "sending",
      interviewer: interviewerSafe,
    });

    // Sending email can take a long time or time out when the SMTP provider is
    // unreachable. Do it after responding so the create request is not held
    // open while the database record has already been saved.
    setImmediate(() => {
      void (async () => {
        try {
          const organization = await Organization.findById(organizationId);
          const emailStatus = await sendInterviewerCredentialsEmail({
            interviewerEmail: interviewer.email,
            interviewerName: interviewer.name,
            plainPassword,
            orgName: organization?.name || "Our Company",
            organizationLogo: organization?.logo || null,
            dashboardLink: INTERVIEWER_DASHBOARD_LINK,
            supportEmail: organization?.email || process.env.EMAIL_FROM,
          });

          if (!emailStatus.success) {
            console.error(
              "❌ Interviewer was created, but credential email failed:",
              emailStatus.error
            );
          }
        } catch (emailError) {
          console.error(
            "❌ Interviewer was created, but credential email failed:",
            emailError
          );
        }
      })();
    });

    return;
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const interviewer = await Interviewer.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!interviewer || !interviewer.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, interviewer.password);
    if (!isMatch) {
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
