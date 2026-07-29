// middlewares/email-config-middleware.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // This should be an App Password, not your regular password
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email server connection error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});