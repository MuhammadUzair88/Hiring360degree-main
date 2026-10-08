// // middlewares/email-config-middleware.js
// import nodemailer from "nodemailer";
// import net from "node:net";
// import dotenv from "dotenv";
// dotenv.config();

// function connectSmtpOverIpv4(options, callback) {
//   let settled = false;
//   let timeoutId;
//   const finish = (error, result) => {
//     if (settled) return;
//     settled = true;
//     clearTimeout(timeoutId);
//     callback(error, result);
//   };

//   const socket = net.connect({
//     host: options.host,
//     port: options.port,
//     family: 4,
//   });

//   timeoutId = setTimeout(() => {
//     const error = new Error("SMTP IPv4 connection timed out");
//     error.code = "ETIMEDOUT";
//     socket.destroy();
//     finish(error);
//   }, options.connectionTimeout || 10_000);

//   socket.once("connect", () => {
//     socket.removeListener("error", onError);
//     finish(null, { connection: socket });
//   });

//   const onError = (error) => finish(error);
//   socket.once("error", onError);
// }

// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 20000,
//   // Render may resolve smtp.gmail.com to IPv6 even when the service has no
//   // usable IPv6 route. Connect via IPv4 while retaining Gmail's hostname for TLS.
//   getSocket: connectSmtpOverIpv4,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD, // This should be an App Password, not your regular password
//   },
// });

// // Render's free web services block outbound SMTP ports. When an HTTPS email
// // API is configured, skip this SMTP connectivity check entirely.
// if (!process.env.RESEND_API_KEY) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error("SMTP connection unavailable:", error.message);
//     } else {
//       console.log("SMTP email service is ready");
//     }
//   });
// } else {
//   console.log("Resend email API is configured");
// }



import nodemailer from "nodemailer";
import net from "node:net";
import dotenv from "dotenv";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Gmail SMTP - Local Development Fallback
|--------------------------------------------------------------------------
|
| Render Free Web Services cannot use Gmail SMTP ports.
| Therefore:
|
| LOCAL:
|   Gmail SMTP can be used.
|
| RENDER:
|   If RESEND_API_KEY exists, Resend HTTPS API is used instead.
|
*/

function connectSmtpOverIpv4(options, callback) {
  let settled = false;
  let timeoutId;

  const finish = (error, result) => {
    if (settled) return;

    settled = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

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

  const onError = (error) => {
    finish(error);
  };

  socket.once("connect", () => {
    socket.removeListener("error", onError);

    finish(null, {
      connection: socket,
    });
  });

  socket.once("error", onError);
}


/*
|--------------------------------------------------------------------------
| Nodemailer Transporter
|--------------------------------------------------------------------------
|
| This is only used when RESEND_API_KEY is NOT configured.
|
*/

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


/*
|--------------------------------------------------------------------------
| Email Provider Check
|--------------------------------------------------------------------------
*/

if (process.env.RESEND_API_KEY) {
  console.log("==========================================");
  console.log("Email provider: Resend HTTPS API");
  console.log("Resend API key detected");
  console.log("==========================================");
} else {
  console.log("==========================================");
  console.log("Email provider: Gmail SMTP");
  console.log("No RESEND_API_KEY detected");
  console.log("==========================================");

  transporter.verify((error) => {
    if (error) {
      console.error(
        "SMTP connection unavailable:",
        error.message
      );
    } else {
      console.log("SMTP email service is ready");
    }
  });
}