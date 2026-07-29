// middlewares/email-middleware.js

import { candidateInterviewTemplate, interviewerInterviewTemplate, offerLetterTemplate } from "../utils/templates/emailTemplate.js";
import { transporter } from "./email-config-middleware.js";

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
      transporter.sendMail({
        from: `"${orgName} Hiring Team" <${process.env.EMAIL_FROM}>`,
        to: candidateEmail,
        subject: `Interview Invitation: ${jobTitle} - ${roundName}`,
        html: candidateHtml,
        replyTo: supportEmail,
      }),
      transporter.sendMail({
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

    const result = await transporter.sendMail({
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
    return { success: false, error: error.message };
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
  try {
    console.log("📧 Sending offer letter email to:", candidateEmail);
    console.log("📧 Image URL:", offerLetterImageUrl);

    const formattedJoiningDate = joiningDate
      ? new Date(joiningDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be confirmed";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offer Letter</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8f9fb;
      color: #1a1a2e;
      line-height: 1.6;
    }
    .container { max-width: 560px; margin: 0 auto; padding: 24px 16px; }
    .card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      border: 1px solid #e8ecf1;
    }
    .header {
      padding: 32px 28px 24px;
      text-align: center;
      border-bottom: 1px solid #f0f2f5;
    }
    .logo { max-height: 40px; width: auto; margin-bottom: 16px; }
    .badge {
      display: inline-block;
      background: #eef2ff;
      color: #4f46e5;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      padding: 4px 12px;
      border-radius: 100px;
      text-transform: uppercase;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin: 12px 0 4px;
    }
    .subtitle {
      font-size: 13px;
      color: #6b7280;
    }
    .body { padding: 28px; }
    .greeting { font-size: 15px; color: #1f2937; margin-bottom: 16px; }
    .greeting strong { color: #111827; }
    .message { font-size: 14px; color: #4b5563; margin-bottom: 24px; line-height: 1.7; }

    .details-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .details-box h3 {
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .detail-row {
      display: flex;
      padding: 6px 0;
      font-size: 13px;
    }
    .detail-label { color: #6b7280; width: 100px; flex-shrink: 0; }
    .detail-value { color: #111827; font-weight: 500; }

    .offer-image-section {
      margin-bottom: 24px;
    }
    .offer-image-section h3 {
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      text-align: center;
    }
    .offer-image-link {
      display: block;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .offer-image-link:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .offer-image-link img {
      width: 100%;
      display: block;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .btn {
      flex: 1;
      display: inline-block;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      transition: all 0.15s;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
      border: 1px solid #4f46e5;
    }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary {
      background: #ffffff;
      color: #4f46e5;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover { background: #f9fafb; }

    .closing { font-size: 14px; color: #4b5563; margin-top: 24px; line-height: 1.7; }
    .signature { margin-top: 16px; font-size: 14px; color: #1f2937; }
    .signature strong { font-size: 15px; }

    .footer {
      padding: 16px 28px;
      border-top: 1px solid #f0f2f5;
      text-align: center;
      background: #fafbfc;
    }
    .footer p { font-size: 11px; color: #9ca3af; margin: 2px 0; }
    .footer a { color: #4f46e5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      
      <!-- Header -->
      <div class="header">
        ${organizationLogo ? `<img src="${organizationLogo}" alt="${orgName}" class="logo" />` : ''}
        <div class="badge">Offer Letter</div>
        <h1 class="title">${jobTitle}</h1>
        <p class="subtitle">${orgName} · ${department || ''}</p>
      </div>

      <!-- Body -->
      <div class="body">
        <p class="greeting">Dear <strong>${candidateName}</strong>,</p>
        
        <p class="message">
          We are delighted to extend this formal offer of employment. After careful consideration of your qualifications and experience, we believe you will be a valuable addition to our team.
        </p>

        <!-- Details -->
        <div class="details-box">
          <h3>Offer Summary</h3>
          <div class="detail-row">
            <span class="detail-label">Position</span>
            <span class="detail-value">${jobTitle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Department</span>
            <span class="detail-value">${department || '—'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Start Date</span>
            <span class="detail-value">${formattedJoiningDate}</span>
          </div>
          ${salary ? `
          <div class="detail-row">
            <span class="detail-label">Salary</span>
            <span class="detail-value">${salary}</span>
          </div>
          ` : ''}
        </div>

        <!-- Offer Letter Image -->
        ${offerLetterImageUrl ? `
        <div class="offer-image-section">
          <h3>Your Offer Letter</h3>
          <a href="${offerLetterImageUrl}" target="_blank" class="offer-image-link">
            <img src="${offerLetterImageUrl}" alt="Offer Letter" />
          </a>
          <div class="actions">
            <a href="${offerLetterImageUrl}" target="_blank" class="btn btn-primary">View Full Letter</a>
            <a href="${offerLetterImageUrl}" download class="btn btn-secondary">Download</a>
          </div>
        </div>
        ` : ''}

        <p class="closing">
          Please review the offer letter at your earliest convenience. Should you have any questions or wish to discuss any aspect of this offer, please do not hesitate to contact us.
        </p>

        <p class="closing">
          We look forward to welcoming you aboard and building something great together.
        </p>

        <div class="signature">
          <p>Warm regards,</p>
          <p><strong>${orgName} Team</strong></p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Need help? <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        <p>&copy; ${new Date().getFullYear()} ${orgName}. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>`;

    const result = await transporter.sendMail({
      from: `"${orgName}" <${process.env.EMAIL_FROM}>`,
      to: candidateEmail,
      subject: `Offer Letter: ${jobTitle} — ${orgName}`,
      html,
      replyTo: supportEmail,
    });

    console.log("✅ Offer letter email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Offer letter email failed:", error);
    return { success: false, error: error.message };
  }
};