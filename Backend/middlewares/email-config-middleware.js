// middlewares/email-config-middleware.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // This should be an App Password, not your regular password
  },
});

// Render's free web services block outbound SMTP ports. When an HTTPS email
// API is configured, skip this SMTP connectivity check entirely.
if (!process.env.RESEND_API_KEY) {
  transporter.verify((error) => {
    if (error) {
      console.error("SMTP connection unavailable:", error.message);
    } else {
      console.log("SMTP email service is ready");
    }
  });
} else {
  console.log("Resend email API is configured");
}
