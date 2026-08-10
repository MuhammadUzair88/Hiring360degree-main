// import mongoose from 'mongoose';
// import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs"

// const organizationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true,unique:true },
//   phone: { type: String },
//   website: { type: String },
//   location: { type: String },
//   logo: { type: String,required:true },
//   industry: { type: String },
//   password:{type:String,required:true}
// },{timestamps:true});

// organizationSchema.methods.generateToken = async function (next) {
//   try {
//     const token = jwt.sign(
//       {
//         organizationId: this._id.toString(),
//         email: this.email
//       },
//       process.env.JWT_TOKEN_SECRET,
//       { expiresIn: "1d"}
//     );
//     return token;
//   } catch (error) {
//     console.log("error in organization model: ", error);

//     next(error);
//   }
// };

// organizationSchema.pre("save", async function (next) {
//   const org = this;

//   if (!org.isModified("password")) {
//     next();
//   }
//   try {
//     const saltRound = await bcrypt.genSalt(10);
//     const hashed_password = await bcrypt.hash(org.password, saltRound);

//     org.password = hashed_password;
//   } catch (error) {
//     console.log("error failed to hash the password");
//   }
// });

// organizationSchema.methods.comparePassword = async function (passwod) {
//   try {
//     return await bcrypt.compare(passwod, this.password);
//   } catch (error) {
//     console.log("error from me", error);
//   }
// };
// export const Organization =  mongoose.model('Organization', organizationSchema);

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    website: {
      type: String,
    },

    location: {
      type: String,
    },

    logo: {
      type: String,
      required: true,
    },

    industry: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    // ============================
    // ZERNIO
    // ============================

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

organizationSchema.methods.generateToken = async function (next) {
  try {
    const token = jwt.sign(
      {
        organizationId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return token;
  } catch (error) {
    console.log("error in organization model: ", error);
    next(error);
  }
};

organizationSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  } catch (error) {
    console.error(
      "Error failed to hash password:",
      error
    );

    throw error;
  }
});

organizationSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("compare password error", error);
    return false;
  }
};

export const Organization =
  mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);