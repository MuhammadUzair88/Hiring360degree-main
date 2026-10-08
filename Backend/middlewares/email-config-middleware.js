import nodemailer from "nodemailer";
import net from "node:net";
import dotenv from "dotenv";

dotenv.config();

// Force the outbound SMTP socket to IPv4. The deployment's reported
// ENETUNREACH error showed that its IPv6 route to Gmail was unavailable.
function connectSmtpOverIpv4(options, callback) {
  let settled = false;
  let timeoutId;

  const finish = (error, result) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutId);
    callback(error, result);
  };

  const socket = net.connect({
    host: options.host,
    port: options.port,
    family: 4,
  });

  timeoutId = setTimeout(() => {
    const error = new Error("SMTP IPv4 connection timed out");
    error.code = "ETIMEDOUT";
    socket.destroy();
    finish(error);
  }, options.connectionTimeout || 10_000);

  const onError = (error) => finish(error);
  socket.once("error", onError);
  socket.once("connect", () => {
    socket.removeListener("error", onError);
    finish(null, { connection: socket });
  });
}

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  getSocket: connectSmtpOverIpv4,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Gmail SMTP connection unavailable:", error.message);
  } else {
    console.log("Gmail SMTP is ready to send emails");
  }
});