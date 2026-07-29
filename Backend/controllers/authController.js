import { Organization } from "../models/organizationModel.js";

// ****************** Home Logic ************************ //
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to home route of Hiring360");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// ****************** Login Logic ************************ //

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const orgExist = await Organization.findOne({ email: email });

    if (!orgExist) {
      res.status(400).json("Invalid Credentials");
    }

    const org = await orgExist.comparePassword(password);

    if (org) {
      res.status(200).json({
        message: "LoggedIn Successfully",
        token: await orgExist.generateToken(),
        organizationId: orgExist._id.toString(),
      });
    } else {
      const status = 401;
      const message = "Fill the input properly";
      const extraDetails = "Invalid username or password";

      const error = {
        status,
        message,
        extraDetails,
      };
      //   res.status(401).json({ message: "Invalid username or password" });
      next(error);
    }
  } catch (error) {
    console.error("🔥 Error in login controller:", error);
    res.status(500).json("Internal Server Error");
  }
};

// ****************** Register Logic ************************ //

const register = async (req, res) => {
  try {
    const { name, email, phone,website,location,logo,industry, password } = req.body;

    const emailExists = await Organization.findOne({ email: email });

    if (!emailExists) {
      const orgCreated = await Organization.create({
        name,
        email,
        phone,
        website,
        location,
        logo,
        industry,
        password
      });
      res
        .status(201)
        .json({
          message: "Registeration Successful",
          token: await orgCreated.generateToken(),
          organizationId: orgCreated._id.toString(),
        });
    } else {
      res.status(400).json({ message: "Email Already Exists" });
    }
  } catch (error) {
    console.error("🔥 Error in register controller:", error);
    res.status(500).json("Internal Server Error");
  }
};

// ****************** User Logic ************************ //

const organization = async (req,res)=> {
  try {

    const orgData = req.organization
    return res.status(200).json(orgData)
    
  } catch (error) {
    console.log("error from the organization route : ",error)
  }
}

// ****************** Organization update Logic ************************ //

const updateOrganization = async (req, res) => {
  try {
    // req.organizationId should come from your JWT authMiddleware
    const { name, phone, website, location, industry, logo } = req.body;

    const updatedOrg = await Organization.findByIdAndUpdate(
      req.organizationId,
      {
        $set: { name, phone, website, location, industry, logo }
      },
      { new: true, runValidators: true }
    ).select('-password'); // Don't send password back

    if (!updatedOrg) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      organization: updatedOrg
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};


export 
{ 
  home,
  login,
  register,
  organization,
  updateOrganization
};