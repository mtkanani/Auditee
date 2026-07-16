const nodemailer = require('nodemailer');
const { getTransporter } = require('../config/mailer');

/**
 * Refreshes and retrieves a temporary Access Token using the Google OAuth2 Refresh Token.
 */
const getGmailAccessToken = async () => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh Gmail access token: ${data.error_description || JSON.stringify(data)}`);
  }
  return data.access_token;
};

/**
 * Sends an email using Google's Gmail REST API (over HTTPS Port 443, bypassing SMTP blocks).
 */
const sendGmailViaRest = async ({ to, subject, html }) => {
  const accessToken = await getGmailAccessToken();
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  const emailLines = [
    `From: ${fromAddress}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    html
  ];

  const emailRaw = emailLines.join('\r\n');
  const base64Safe = Buffer.from(emailRaw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Safe,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Gmail API send failed: ${JSON.stringify(data)}`);
  }

  console.log(`✅ Email sent successfully via Gmail REST API! Message ID: ${data.id}`);
  return data;
};

/**
 * Helper function to send email via Gmail REST API (HTTPS) or Nodemailer SMTP fallback.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
    console.log(`Sending email to ${to} via Gmail REST API (HTTPS)...`);
    try {
      return await sendGmailViaRest({ to, subject, html });
    } catch (error) {
      console.error('❌ Gmail REST API Error:', error.message || error);
      throw error;
    }
  }

  // Fallback to Nodemailer SMTP
  console.log(`Sending email to ${to} via Nodemailer SMTP...`);
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to,
    subject,
    text,
    html,
  });

  const testUrl = nodemailer.getTestMessageUrl(info);
  if (testUrl) {
    console.log('----------------------------------------------------');
    console.log(`✉️  Ethereal Test Mail sent!`);
    console.log(`🔗  Preview URL: ${testUrl}`);
    console.log('----------------------------------------------------');
  }

  return info;
};

/**
 * Sends an OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: toEmail,
    subject: 'Secure OTP Verification Code',
    text: `Your OTP verification code is ${otp}. This code is valid for 5 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #4f46e5;
            margin-bottom: 24px;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
          }
          .otp-container {
            text-align: center;
            margin: 28px 0;
          }
          .otp-code {
            display: inline-block;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #4f46e5;
            background-color: #eff6ff;
            padding: 12px 32px;
            border-radius: 8px;
            border: 1.5px dashed #3b82f6;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            margin-top: 28px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Security Verification</div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested a One-Time Password (OTP) to verify your account. Please use the verification code below to proceed:</p>
            <div class="otp-container">
              <span class="otp-code">${otp}</span>
            </div>
            <p>This code is active for <strong>5 minutes</strong>. For security reasons, do not share this email or verification code with anyone.</p>
          </div>
          <div class="footer">
            This is an automated system notification. Replies to this address are not monitored.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await sendEmail(mailOptions);
};

/**
 * Sends a Forgot Password OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendForgotPasswordEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: toEmail,
    subject: 'Reset Password Verification OTP',
    text: `Your password reset verification code is ${otp}. This code is valid for 5 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Password OTP</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #ef4444;
            margin-bottom: 24px;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
          }
          .otp-container {
            text-align: center;
            margin: 28px 0;
          }
          .otp-code {
            display: inline-block;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #ef4444;
            background-color: #fef2f2;
            padding: 12px 32px;
            border-radius: 8px;
            border: 1.5px dashed #f87171;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            margin-top: 28px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Password Reset Request</div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for your account. Please use the verification code below to proceed with the password reset:</p>
            <div class="otp-container">
              <span class="otp-code">${otp}</span>
            </div>
            <p>This code is active for <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            This is an automated security notification. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await sendEmail(mailOptions);
};

/**
 * Sends a Delete Account confirmation OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendDeleteAccountEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: toEmail,
    subject: 'Confirm Account Deletion OTP',
    text: `Your account deletion verification code is ${otp}. This code is valid for 5 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Delete Account OTP</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 24px;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
          }
          .otp-container {
            text-align: center;
            margin: 28px 0;
          }
          .otp-code {
            display: inline-block;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #dc2626;
            background-color: #fef2f2;
            padding: 12px 32px;
            border-radius: 8px;
            border: 1.5px dashed #f87171;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            margin-top: 28px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Permanent Account Deletion Request</div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to permanently delete your Auditee account. If you wish to proceed, please use the verification code below to authorize this deletion:</p>
            <div class="otp-container">
              <span class="otp-code">${otp}</span>
            </div>
            <p>This code is active for <strong>5 minutes</strong>. If you did not initiate this request, please change your password immediately to secure your account.</p>
          </div>
          <div class="footer">
            This is an automated security notification. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await sendEmail(mailOptions);
};

/**
 * Sends a Login OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendLoginOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: toEmail,
    subject: 'Login Verification Code',
    text: `Your login verification code is ${otp}. This code is valid for 5 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Login Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 24px;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
          }
          .otp-container {
            text-align: center;
            margin: 28px 0;
          }
          .otp-code {
            display: inline-block;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #10b981;
            background-color: #ecfdf5;
            padding: 12px 32px;
            border-radius: 8px;
            border: 1.5px dashed #34d399;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            margin-top: 28px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Login Verification</div>
          <div class="content">
            <p>Hello,</p>
            <p>Please use the verification code below to complete your login:</p>
            <div class="otp-container">
              <span class="otp-code">${otp}</span>
            </div>
            <p>This code is active for <strong>5 minutes</strong>. If you did not attempt to log in, please secure your password immediately.</p>
          </div>
          <div class="footer">
            This is an automated system notification. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await sendEmail(mailOptions);
};

/**
 * Sends newly created Firm Admin login credentials.
 * @param {string} toEmail Recipient email address.
 * @param {string} tempPassword The temporary or assigned password.
 * @param {string} firmName The firm name.
 */
const sendCredentialsEmail = async (toEmail, tempPassword, firmName) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: toEmail,
    subject: 'Welcome to Auditee - Firm Admin Access Credentials',
    text: `Welcome to Auditee!\n\nYour firm "${firmName}" has been successfully registered.\n\nHere are your login credentials:\nEmail: ${toEmail}\nPassword: ${tempPassword}\n\nPlease change your password after logging in.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Auditee Firm Registration</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #4f46e5;
            margin-bottom: 24px;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
          }
          .credentials-container {
            margin: 20px 0;
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #bfdbfe;
          }
          .credentials-item {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            margin-top: 28px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Auditee Firm Registration</div>
          <div class="content">
            <p>Hello,</p>
            <p>Your firm <strong>${firmName}</strong> has been successfully registered on the Auditee platform by the Super Admin.</p>
            <p>You have been assigned as the <strong>Firm Admin</strong>. Here are your temporary login credentials to access the platform:</p>
            <div class="credentials-container">
              <div class="credentials-item"><strong>Login Email:</strong> ${toEmail}</div>
              <div class="credentials-item"><strong>Password:</strong> ${tempPassword}</div>
            </div>
            <p>For security reasons, we strongly recommend that you log in and change your password immediately.</p>
          </div>
          <div class="footer">
            This is an automated system notification from Auditee. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await sendEmail(mailOptions);
};

module.exports = {
  sendOtpEmail,
  sendForgotPasswordEmail,
  sendDeleteAccountEmail,
  sendLoginOtpEmail,
  sendCredentialsEmail,
};

