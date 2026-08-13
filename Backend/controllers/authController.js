import { Organization } from "../models/organizationModel.js";

const PROFILE_FIELDS = ["name", "phone", "website", "location", "industry", "logo"];

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value;
}

// ****************** Home Logic ************************ //
const home = async (_req, res) => {
  return res.status(200).send("Welcome to home route of Hiring360");
};

// ****************** Login Logic ************************ //
const login = async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const orgExist = await Organization.findOne({ email });

    if (!orgExist) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await orgExist.comparePassword(password);

    if (!passwordMatches) {
      const error = {
        status: 401,
        message: "Invalid email or password.",
        extraDetails: "Invalid email or password.",
      };
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: await orgExist.generateToken(),
      organizationId: orgExist._id.toString(),
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ****************** Register Logic ************************ //
const register = async (req, res) => {
  try {
    const {
      name,
      phone = "",
      website = "",
      location = "",
      logo = "",
      industry = "",
      password,
    } = req.body || {};

    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!String(name || "").trim() || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Organization name, email and password are required.",
      });
    }

    const emailExists = await Organization.findOne({ email }).select("_id").lean();

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const orgCreated = await Organization.create({
      name: String(name).trim(),
      email,
      phone: cleanString(phone),
      website: cleanString(website),
      location: cleanString(location),
      logo: logo || "",
      industry: cleanString(industry),
      password,
      passwordChangedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token: await orgCreated.generateToken(),
      organizationId: orgCreated._id.toString(),
    });
  } catch (error) {
    console.error("Register controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ****************** Current organization ************************ //
const organization = async (req, res) => {
  try {
    return res.status(200).json(req.organization);
  } catch (error) {
    console.error("Organization profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load organization profile",
    });
  }
};

// ****************** Organization profile update ************************ //
const updateOrganization = async (req, res) => {
  try {
    const $set = {};

    for (const field of PROFILE_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(req.body || {}, field)) continue;
      const value = req.body[field];
      $set[field] = field === "logo" ? value || "" : cleanString(value);
    }

    if (Object.prototype.hasOwnProperty.call($set, "name") && !$set.name) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty.",
      });
    }

    if (Object.prototype.hasOwnProperty.call($set, "website") && $set.website) {
      try {
        new URL($set.website);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid website URL.",
        });
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No profile changes were provided.",
      });
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      req.organizationId,
      { $set },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedOrg) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      organization: updatedOrg,
    });
  } catch (error) {
    console.error("Organization update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ****************** Password update ************************ //
const updatePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters.",
      });
    }

    const org = await Organization.findById(req.organizationId);

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
    }

    const currentMatches = await org.comparePassword(currentPassword);

    if (!currentMatches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const samePassword = await org.comparePassword(newPassword);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password.",
      });
    }

    // Assigning the plain password and using save() intentionally triggers the
    // schema's pre-save hashing middleware. Do not use findByIdAndUpdate here.
    org.password = newPassword;
    org.passwordChangedAt = new Date();
    await org.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      passwordChangedAt: org.passwordChangedAt,
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
    });
  }
};

export {
  home,
  login,
  register,
  organization,
  updateOrganization,
  updatePassword,
};
