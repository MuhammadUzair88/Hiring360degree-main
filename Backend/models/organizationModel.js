import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // Logo is optional so the Settings -> Remove Logo action can persist.
    logo: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Tracks password changes separately from normal profile edits so the
    // Security card does not incorrectly say the password changed when HR
    // merely updates the company name/logo/phone.
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },

    // Zernio integration identifier used elsewhere in the existing project.
    zernioProfileId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      organizationId: this._id.toString(),
      email: this.email,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

organizationSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

organizationSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const Organization =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
