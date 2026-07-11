const nodemailer = require('nodemailer');
const { getTransporter } = require('../config/mailer');

/**
 * Sends an OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendOtpEmail = async (toEmail, otp) => {
  const transporter = await getTransporter();

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

  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal test mail service, print link to console
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
 * Sends a Forgot Password OTP email to the user.
 * @param {string} toEmail Recipient email address.
 * @param {string} otp The 6-digit OTP string.
 */
const sendForgotPasswordEmail = async (toEmail, otp) => {
  const transporter = await getTransporter();

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

  const info = await transporter.sendMail(mailOptions);

  const testUrl = nodemailer.getTestMessageUrl(info);
  if (testUrl) {
    console.log('----------------------------------------------------');
    console.log(`✉️  Ethereal Test Forgot Password Mail sent!`);
    console.log(`🔗  Preview URL: ${testUrl}`);
    console.log('----------------------------------------------------');
  }

  return info;
};

module.exports = {
  sendOtpEmail,
  sendForgotPasswordEmail,
};
