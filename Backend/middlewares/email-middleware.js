
import { candidateInterviewTemplate, interviewerInterviewTemplate, offerLetterTemplate } from "../utils/templates/emailTemplate.js";
import { transporter } from "./email-config-middleware.js";

async function sendEmailMessage({ from, to, subject, html, replyTo }) {
  if (process.env.RESEND_API_KEY) {
    console.info("Email delivery provider: Resend HTTPS API");
    if (!from || from.includes("undefined")) {
      throw new Error("EMAIL_FROM must be set to a verified sender address");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const reason = result.message || result.name || `HTTP ${response.status}`;
      throw new Error(`Resend rejected the email: ${reason}`);
    }

    return { messageId: result.id };
  }

  const missingSmtpSettings = ["EMAIL", "EMAIL_PASSWORD", "EMAIL_FROM"].filter(
    (key) => !process.env[key]
  );
  if (missingSmtpSettings.length) {
    throw new Error(
      `SMTP configuration is missing: ${missingSmtpSettings.join(", ")}`
    );
  }

  console.info("Email delivery provider: Gmail SMTP");
  return transporter.sendMail({ from, to, subject, html, replyTo });
}

export const sendInterviewEmails = async ({
  candidateEmail,
  candidateName,
  interviewerEmail,
  interviewerName,
  jobTitle,
  orgName = "Our Company",
  scheduledAt,
  meetingLinkCandidate, // New parameter for candidate
  meetingLinkInterviewer, // New parameter for interviewer
  organizationLogo = null,
  roundName,
  supportEmail,
  callId, // Pass callId for fallback
}) => {
  try {
    console.log("📧 Sending interview emails...");
    console.log("Candidate link:", meetingLinkCandidate);
    console.log("Interviewer link:", meetingLinkInterviewer);

    const formattedDate = new Date(scheduledAt).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });

    const logoHtml = organizationLogo
      ? `<div class="company-logo"><img src="${organizationLogo}" alt="${orgName}" style="max-height: 50px; width: auto;"></div>`
      : `<div style="font-size: 24px; font-weight: 700; color: inherit;">${orgName}</div>`;

    // Use role-specific links or fallback to base link
    const candidateLink = meetingLinkCandidate || `${process.env.CLIENT_URL}/interview/${callId}?role=candidate&name=${encodeURIComponent(candidateName)}`;
    const interviewerLink = meetingLinkInterviewer || `${process.env.CLIENT_URL}/interview/${callId}?role=interviewer&name=${encodeURIComponent(interviewerName)}`;

    // Candidate Email - uses candidate link
    const candidateHtml = candidateInterviewTemplate
      .replaceAll("{logoHtml}", logoHtml)
      .replaceAll("{candidateName}", candidateName)
      .replaceAll("{interviewerName}", interviewerName)
      .replaceAll("{jobTitle}", jobTitle)
      .replaceAll("{orgName}", orgName)
      .replaceAll("{interviewDate}", formattedDate)
      .replaceAll("{roundName}", roundName || "Interview Round")
      .replaceAll("{joinLink}", candidateLink) // Candidate gets candidate link
      .replaceAll("{supportEmail}", supportEmail || "support@company.com");

    // Interviewer Email - uses interviewer link
    const interviewerHtml = interviewerInterviewTemplate
      .replaceAll("{logoHtml}", logoHtml)
      .replaceAll("{interviewerName}", interviewerName)
      .replaceAll("{candidateName}", candidateName)
      .replaceAll("{candidateEmail}", candidateEmail)
      .replaceAll("{jobTitle}", jobTitle)
      .replaceAll("{orgName}", orgName)
      .replaceAll("{interviewDate}", formattedDate)
      .replaceAll("{roundName}", roundName || "Interview Round")
      .replaceAll("{joinLink}", interviewerLink) // Interviewer gets host link
      .replaceAll("{supportEmail}", supportEmail || "support@company.com");

    const [candidateResult, interviewerResult] = await Promise.all([
      sendEmailMessage({
        from: `"${orgName} Hiring Team" <${process.env.EMAIL_FROM}>`,
        to: candidateEmail,
        subject: `Interview Invitation: ${jobTitle} - ${roundName}`,
        html: candidateHtml,
        replyTo: supportEmail,
      }),
      sendEmailMessage({
        from: `"${orgName} Recruitment System" <${process.env.EMAIL_FROM}>`,
        to: interviewerEmail,
        subject: `Interview Scheduled: ${candidateName} - ${jobTitle} (${roundName})`,
        html: interviewerHtml,
        replyTo: supportEmail,
      }),
    ]);

    console.log("✅ Emails sent successfully");
    console.log("Candidate email ID:", candidateResult.messageId);
    console.log("Interviewer email ID:", interviewerResult.messageId);

    return {
      success: true,
      candidateMessageId: candidateResult.messageId,
      interviewerMessageId: interviewerResult.messageId,
    };
  } catch (error) {
    console.error("❌ Email Sending Failed:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

// =========================
// SEND INTERVIEWER LOGIN CREDENTIALS
// (Fired once, right after an interviewer account is created)
// =========================
export const sendInterviewerCredentialsEmail = async ({
  interviewerEmail,
  interviewerName,
  plainPassword,
  orgName = "Our Company",
  organizationLogo = null,
  dashboardLink,
  supportEmail,
}) => {
  try {
    console.log("📧 Sending interviewer credentials email to:", interviewerEmail);

    const logoHtml = organizationLogo
      ? `<div style="margin-bottom:16px;"><img src="${organizationLogo}" alt="${orgName}" style="max-height:50px;width:auto;"></div>`
      : `<div style="font-size:22px;font-weight:700;margin-bottom:16px;">${orgName}</div>`;

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width:560px; margin:0 auto; padding:24px; border:1px solid #e5e7eb; border-radius:8px;">
        ${logoHtml}
        <h2 style="color:#111827; margin-bottom:8px;">Welcome, ${interviewerName} 👋</h2>
        <p style="color:#374151; line-height:1.6;">
          An interviewer account has been created for you at <strong>${orgName}</strong>.
          Use the credentials below to log in to your dashboard.
        </p>

        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:16px; margin:20px 0;">
          <p style="margin:4px 0; color:#111827;"><strong>Email:</strong> ${interviewerEmail}</p>
          <p style="margin:4px 0; color:#111827;"><strong>Temporary Password:</strong> ${plainPassword}</p>
        </div>

        <p style="color:#374151; line-height:1.6;">
          For your security, we recommend changing this password after your first login.
        </p>

        <div style="text-align:center; margin:28px 0;">
          <a href="${dashboardLink}"
             style="background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:6px; font-weight:600; display:inline-block;">
            Go to Dashboard
          </a>
        </div>

        <p style="color:#6b7280; font-size:13px; line-height:1.5;">
          If the button above doesn't work, copy and paste this link into your browser:<br/>
          <a href="${dashboardLink}" style="color:#2563eb;">${dashboardLink}</a>
        </p>

        <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
        <p style="color:#9ca3af; font-size:12px;">
          Need help? Contact us at <a href="mailto:${supportEmail}" style="color:#2563eb;">${supportEmail}</a>
        </p>
      </div>
    `;

    const result = await sendEmailMessage({
      from: `"${orgName} Recruitment System" <${process.env.EMAIL_FROM}>`,
      to: interviewerEmail,
      subject: `Your Interviewer Account for ${orgName}`,
      html,
      replyTo: supportEmail,
    });

    console.log("✅ Interviewer credentials email sent:", result.messageId);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Interviewer credentials email failed:", error);
    return {
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
    };
  }
};

// middlewares/email-middleware.js

export const sendOfferLetterEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  orgName = "Our Company",
  organizationLogo = null,
  joiningDate,
  salary,
  department,
  offerLetterId,
  supportEmail,
  offerLetterImageUrl,
}) => {
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatCalendarDate = (value) => {
    if (!value) return "To be confirmed";

    const raw = String(value);
    const direct = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (direct) {
      const [, year, month, day] = direct;
      const localDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        12,
        0,
        0
      );
      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return raw;

    const localDate = new Date(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
      12,
      0,
      0
    );

    return localDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const safeCandidateName = escapeHtml(candidateName || "Candidate");
  const safeJobTitle = escapeHtml(jobTitle || "Position");
  const safeOrgName = escapeHtml(orgName || "Our Company");
  const safeDepartment = escapeHtml(department || "—");
  const safeSalary = salary ? escapeHtml(salary) : "";
  const safeSupportEmail = escapeHtml(
    supportEmail || process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || "support@company.com"
  );
  const safeOfferUrl = offerLetterImageUrl ? String(offerLetterImageUrl) : "";
  const formattedJoiningDate = escapeHtml(formatCalendarDate(joiningDate));

  try {
    if (!candidateEmail) {
      return { success: false, error: "Candidate email is missing" };
    }

    if (!safeOfferUrl) {
      return { success: false, error: "Offer letter attachment URL is missing" };
    }

    console.log("📧 Sending offer letter email to:", candidateEmail);
    console.log("📧 Offer document:", safeOfferUrl);

    let attachmentBuffer = null;
    let attachmentContentType = "image/png";

    try {
      const response = await fetch(safeOfferUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      attachmentBuffer = Buffer.from(await response.arrayBuffer());
      attachmentContentType =
        response.headers.get("content-type") || attachmentContentType;
    } catch (downloadError) {
      console.warn(
        "Could not pre-download offer letter for attachment; Nodemailer will use the hosted URL:",
        downloadError?.message || downloadError
      );
    }

    const slug =
      String(jobTitle || "offer-letter")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "offer-letter";

    const attachmentFilename = `${slug}-offer-letter.png`;
    const inlineCid = `offer-letter-${String(
      offerLetterId || Date.now()
    )}@hiring360`;

    const attachments = [];

    if (attachmentBuffer) {
      attachments.push({
        filename: attachmentFilename,
        content: attachmentBuffer,
        contentType: attachmentContentType,
        cid: inlineCid,
        contentDisposition: "inline",
      });

      attachments.push({
        filename: attachmentFilename,
        content: attachmentBuffer,
        contentType: attachmentContentType,
        contentDisposition: "attachment",
      });
    } else {
      attachments.push({
        filename: attachmentFilename,
        href: safeOfferUrl,
        contentType: attachmentContentType,
      });
    }

    const imageSource = attachmentBuffer ? `cid:${inlineCid}` : safeOfferUrl;
    const logoHtml = organizationLogo
      ? `<img src="${escapeHtml(
          organizationLogo
        )}" alt="${safeOrgName}" style="max-height:42px;max-width:180px;object-fit:contain;margin-bottom:14px;" />`
      : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer Letter</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:620px;margin:0 auto;padding:24px 14px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);">
      <div style="padding:28px 28px 22px;text-align:center;border-bottom:1px solid #eef0f3;">
        ${logoHtml}
        <div style="display:inline-block;padding:5px 12px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Offer Letter</div>
        <h1 style="margin:12px 0 4px;font-size:22px;line-height:1.25;color:#111827;">${safeJobTitle}</h1>
        <p style="margin:0;color:#6b7280;font-size:13px;">${safeOrgName}${
      safeDepartment !== "—" ? ` · ${safeDepartment}` : ""
    }</p>
      </div>

      <div style="padding:28px;">
        <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${safeCandidateName}</strong>,</p>
        <p style="margin:0 0 22px;color:#4b5563;font-size:14px;line-height:1.7;">
          We are pleased to share your formal offer for the <strong>${safeJobTitle}</strong> position at ${safeOrgName}.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:9px;padding:16px 18px;margin-bottom:24px;">
          <p style="margin:0 0 10px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Offer Summary</p>
          <p style="margin:5px 0;font-size:13px;"><span style="display:inline-block;width:110px;color:#6b7280;">Position</span><strong>${safeJobTitle}</strong></p>
          <p style="margin:5px 0;font-size:13px;"><span style="display:inline-block;width:110px;color:#6b7280;">Department</span><strong>${safeDepartment}</strong></p>
          <p style="margin:5px 0;font-size:13px;"><span style="display:inline-block;width:110px;color:#6b7280;">Start Date</span><strong>${formattedJoiningDate}</strong></p>
          ${
            safeSalary
              ? `<p style="margin:5px 0;font-size:13px;"><span style="display:inline-block;width:110px;color:#6b7280;">Salary</span><strong>${safeSalary}</strong></p>`
              : ""
          }
        </div>

        <p style="margin:0 0 10px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-align:center;">Your Offer Letter</p>
        <a href="${safeOfferUrl}" target="_blank" style="display:block;border:1px solid #e5e7eb;border-radius:9px;overflow:hidden;text-decoration:none;background:#fff;">
          <img src="${imageSource}" alt="Offer Letter" style="display:block;width:100%;height:auto;border:0;" />
        </a>

        <div style="text-align:center;margin:16px 0 0;">
          <a href="${safeOfferUrl}" target="_blank" style="display:inline-block;padding:11px 20px;border-radius:7px;background:#4338ca;color:#fff;text-decoration:none;font-size:13px;font-weight:700;">View Full Offer Letter</a>
        </div>

        <p style="margin:24px 0 0;color:#4b5563;font-size:14px;line-height:1.7;">
          The full letter is also attached to this email. Please review it carefully and contact us if you have any questions.
        </p>

        <p style="margin:20px 0 0;font-size:14px;line-height:1.6;">Warm regards,<br /><strong>${safeOrgName} Team</strong></p>
      </div>

      <div style="padding:16px 24px;background:#fafbfc;border-top:1px solid #eef0f3;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:11px;">Need help? <a href="mailto:${safeSupportEmail}" style="color:#4338ca;text-decoration:none;">${safeSupportEmail}</a></p>
        <p style="margin:4px 0 0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} ${safeOrgName}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const result = await sendEmailMessage({
      from: `"${orgName}" <${process.env.EMAIL_FROM}>`,
      to: candidateEmail,
      subject: `Offer Letter: ${jobTitle || "Position"} — ${orgName}`,
      html,
      attachments,
      replyTo: supportEmail || process.env.EMAIL_FROM,
    });

    console.log("✅ Offer letter email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Offer letter email failed:", error);
    return { success: false, error: error.message };
  }
};
