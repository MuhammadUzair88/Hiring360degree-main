// utils/emailTemplate.js

export const candidateInterviewTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Invitation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .company-logo {
            margin-bottom: 20px;
        }
        .company-logo img {
            max-height: 50px;
            width: auto;
        }
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .message {
            font-size: 15px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .interview-details {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .detail-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-icon {
            width: 40px;
            height: 40px;
            background: #edf2f7;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 20px;
        }
        .detail-content {
            flex: 1;
        }
        .detail-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .detail-value {
            font-size: 15px;
            color: #2d3748;
            font-weight: 500;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .important-note {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .important-note strong {
            color: #92400e;
            display: block;
            margin-bottom: 5px;
        }
        .important-note p {
            color: #78350f;
            font-size: 14px;
            margin: 0;
        }
        .preparation-tips {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .preparation-tips h3 {
            color: #166534;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .preparation-tips ul {
            list-style: none;
            padding: 0;
        }
        .preparation-tips li {
            color: #15803d;
            font-size: 14px;
            padding: 6px 0;
            padding-left: 25px;
            position: relative;
        }
        .preparation-tips li:before {
            content: "✓";
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        .email-footer {
            background: #f7fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-links {
            margin-bottom: 15px;
        }
        .footer-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
        }
        .footer-text {
            color: #a0aec0;
            font-size: 12px;
            line-height: 1.6;
        }
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 20px 0;
        }
        @media only screen and (max-width: 480px) {
            .email-body { padding: 25px 20px; }
            .detail-item { flex-direction: column; align-items: flex-start; }
            .detail-icon { margin-bottom: 8px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            {logoHtml}
            <h1 class="header-title">Interview Invitation</h1>
            <p class="header-subtitle">{orgName} - {jobTitle}</p>
        </div>
        
        <div class="email-body">
            <p class="greeting">Dear {candidateName},</p>
            
            <p class="message">
                Congratulations! Your application for the <strong>{jobTitle}</strong> position has been 
                shortlisted. We are pleased to invite you to the next stage of our selection process.
            </p>

            <div class="interview-details">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-content">
                        <div class="detail-label">Interview Date & Time</div>
                        <div class="detail-value">{interviewDate}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">👤</div>
                    <div class="detail-content">
                        <div class="detail-label">Interviewer</div>
                        <div class="detail-value">{interviewerName}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">🎯</div>
                    <div class="detail-content">
                        <div class="detail-label">Interview Round</div>
                        <div class="detail-value">{roundName}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">💻</div>
                    <div class="detail-content">
                        <div class="detail-label">Format</div>
                        <div class="detail-value">Virtual Video Interview</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">⏱️</div>
                    <div class="detail-content">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">45-60 Minutes</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="{joinLink}" class="cta-button">
                    Join Interview Room
                </a>
                <p style="font-size: 13px; color: #718096; margin-top: 12px;">
                    Or copy this link: <br>
                    <a href="{joinLink}" style="color: #667eea;">{joinLink}</a>
                </p>
            </div>

            <div class="important-note">
                <strong>⚠️ Important Information</strong>
                <p>You will be placed in a virtual waiting room. The interviewer will admit you when ready. Please join 5 minutes before your scheduled time.</p>
            </div>

            <div class="preparation-tips">
                <h3>📋 Preparation Checklist</h3>
                <ul>
                    <li>Test your camera and microphone</li>
                    <li>Ensure stable internet connection</li>
                    <li>Find a quiet, well-lit space</li>
                    <li>Keep your resume and portfolio ready</li>
                    <li>Prepare questions for the interviewer</li>
                </ul>
            </div>

            <hr class="divider">
            
            <p style="font-size: 14px; color: #4a5568;">
                If you need to reschedule or have any questions, please contact us at 
                <a href="mailto:{supportEmail}" style="color: #667eea;">{supportEmail}</a>
            </p>
            
            <p style="font-size: 14px; color: #4a5568; margin-top: 20px;">
                Best of luck!<br>
                <strong>{orgName} Hiring Team</strong>
            </p>
        </div>
        
        <div class="email-footer">
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
            <p class="footer-text">
                This is an automated message from {orgName}'s recruitment system.<br>
                Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>`;

export const interviewerInterviewTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Scheduled - Host Access</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .email-header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .company-logo {
            margin-bottom: 20px;
        }
        .company-logo img {
            max-height: 50px;
            width: auto;
        }
        .host-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .message {
            font-size: 15px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        .candidate-card {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .candidate-card h3 {
            color: #166534;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .candidate-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 10px;
        }
        .candidate-avatar {
            width: 50px;
            height: 50px;
            background: #059669;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            font-weight: bold;
        }
        .candidate-details h4 {
            color: #064e3b;
            font-size: 16px;
            margin-bottom: 4px;
        }
        .candidate-details p {
            color: #047857;
            font-size: 14px;
        }
        .interview-details {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .detail-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-icon {
            width: 40px;
            height: 40px;
            background: #edf2f7;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 20px;
        }
        .detail-content {
            flex: 1;
        }
        .detail-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .detail-value {
            font-size: 15px;
            color: #2d3748;
            font-weight: 500;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
        }
        .host-instructions {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .host-instructions h3 {
            color: #92400e;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .host-instructions ol {
            padding-left: 20px;
        }
        .host-instructions li {
            color: #78350f;
            font-size: 14px;
            margin-bottom: 8px;
            line-height: 1.6;
        }
        .email-footer {
            background: #f7fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            color: #a0aec0;
            font-size: 12px;
            line-height: 1.6;
        }
        @media only screen and (max-width: 480px) {
            .email-body { padding: 25px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            {logoHtml}
            <div class="host-badge">🔑 HOST ACCESS</div>
            <h1 class="header-title">Interview Scheduled</h1>
            <p class="header-subtitle">{jobTitle} - {roundName}</p>
        </div>
        
        <div class="email-body">
            <p class="greeting">Hello {interviewerName},</p>
            
            <p class="message">
                You have been assigned as the <strong>Host</strong> for an upcoming interview. 
                Please review the details below and prepare accordingly.
            </p>

            <div class="candidate-card">
                <h3>👤 Candidate Information</h3>
                <div class="candidate-info">
                    <div class="candidate-avatar">
                        {candidateName.charAt(0)}
                    </div>
                    <div class="candidate-details">
                        <h4>{candidateName}</h4>
                        <p>{candidateEmail}</p>
                    </div>
                </div>
            </div>

            <div class="interview-details">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-content">
                        <div class="detail-label">Date & Time</div>
                        <div class="detail-value">{interviewDate}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">🎯</div>
                    <div class="detail-content">
                        <div class="detail-label">Interview Round</div>
                        <div class="detail-value">{roundName}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">⏱️</div>
                    <div class="detail-content">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">45-60 Minutes</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="{joinLink}" class="cta-button">
                    Enter Interview Workspace
                </a>
                <p style="font-size: 13px; color: #718096; margin-top: 12px;">
                    Direct link: <a href="{joinLink}" style="color: #059669;">{joinLink}</a>
                </p>
            </div>

            <div class="host-instructions">
                <h3>📋 Host Checklist</h3>
                <ol>
                    <li>Join 5 minutes early to set up your workspace</li>
                    <li>Candidate will be in waiting room - admit when ready</li>
                    <li>Test your camera, microphone, and screen sharing</li>
                    <li>Have interview questions and evaluation criteria ready</li>
                    <li>Record feedback immediately after the interview</li>
                </ol>
            </div>

            <p style="font-size: 14px; color: #4a5568; margin-top: 25px;">
                For technical support, contact: 
                <a href="mailto:{supportEmail}" style="color: #059669;">{supportEmail}</a>
            </p>
            
            <p style="font-size: 14px; color: #4a5568; margin-top: 20px;">
                Thank you for your contribution to our hiring process.<br>
                <strong>{orgName} Recruitment Team</strong>
            </p>
        </div>
        
        <div class="email-footer">
            <p class="footer-text">
                This is an automated notification from {orgName}'s recruitment system.<br>
                Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>`;

export const offerLetterTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offer Letter</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .email-header {
            background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .company-logo { margin-bottom: 20px; }
        .company-logo img { max-height: 50px; width: auto; }
        .header-title {
            color: #ffffff;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 15px;
        }
        .email-body { padding: 40px 30px; }
        .greeting {
            font-size: 19px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 18px;
        }
        .message {
            font-size: 15px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        .offer-details {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-item:last-child { border-bottom: none; }
        .detail-icon {
            width: 40px;
            height: 40px;
            background: #edf2f7;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 20px;
        }
        .detail-content { flex: 1; }
        .detail-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .detail-value {
            font-size: 15px;
            color: #2d3748;
            font-weight: 500;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
        }
        .important-note {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .important-note strong { color: #92400e; display: block; margin-bottom: 5px; }
        .important-note p { color: #78350f; font-size: 14px; margin: 0; }
        .email-footer {
            background: #f7fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text { color: #a0aec0; font-size: 12px; line-height: 1.6; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
        @media only screen and (max-width: 480px) {
            .email-body { padding: 25px 20px; }
            .detail-item { flex-direction: column; align-items: flex-start; }
            .detail-icon { margin-bottom: 8px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            {logoHtml}
            <h1 class="header-title">🎉 You've Been Offered a Position</h1>
            <p class="header-subtitle">{orgName} - {jobTitle}</p>
        </div>
 
        <div class="email-body">
            <p class="greeting">Dear {candidateName},</p>
 
            <p class="message">
                Congratulations! We are delighted to offer you the position of
                <strong>{jobTitle}</strong> at <strong>{orgName}</strong>. Please find the
                key details of your offer below, and view the full offer letter using the
                link provided.
            </p>
 
            <div class="offer-details">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-content">
                        <div class="detail-label">Joining Date</div>
                        <div class="detail-value">{joiningDate}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">💰</div>
                    <div class="detail-content">
                        <div class="detail-label">Compensation</div>
                        <div class="detail-value">{salary}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">🏢</div>
                    <div class="detail-content">
                        <div class="detail-label">Department</div>
                        <div class="detail-value">{department}</div>
                    </div>
                </div>
            </div>
 
            <div style="text-align: center;">
                <a href="{viewOfferLink}" class="cta-button">
                    View Full Offer Letter
                </a>
                <p style="font-size: 13px; color: #718096; margin-top: 12px;">
                    Or copy this link: <br>
                    <a href="{viewOfferLink}" style="color: #7c3aed;">{viewOfferLink}</a>
                </p>
            </div>
 
            <div class="important-note">
                <strong>⚠️ Next Steps</strong>
                <p>Please review the full offer letter carefully and respond with your acceptance at your earliest convenience.</p>
            </div>
 
            <hr class="divider">
 
            <p style="font-size: 14px; color: #4a5568;">
                Questions about your offer? Reach out to us at
                <a href="mailto:{supportEmail}" style="color: #7c3aed;">{supportEmail}</a>
            </p>
 
            <p style="font-size: 14px; color: #4a5568; margin-top: 20px;">
                Welcome aboard!<br>
                <strong>{orgName} Hiring Team</strong>
            </p>
        </div>
 
        <div class="email-footer">
            <p class="footer-text">
                This is an automated message from {orgName}'s recruitment system.<br>
                Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>`;