const nodemailer = require('nodemailer');

let transporterInstance = null;

/**
 * Initializes and retrieves the Nodemailer transporter.
 * Prefers standard SMTP_PASS (App Password) if configured,
 * otherwise falls back to Gmail OAuth2 or Mock Console Mailer.
 */
const getTransporter = async () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  // 1. Preferred: Standard SMTP with user & password (e.g. Gmail App Password)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('🔌 Configuring Standard SMTP Transport (App Password)...');
    const host = process.env.SMTP_HOST || (process.env.SMTP_USER.endsWith('@gmail.com') ? 'smtp.gmail.com' : 'smtp.ethereal.email');
    const port = parseInt(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? '465' : '587'), 10);

    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false
      }
    });
    return transporterInstance;
  }

  // 2. Secondary: Gmail OAuth2 if client credentials are set without SMTP_PASS
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
    console.log('🔌 Configuring Gmail OAuth2 Transport...');
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
    return transporterInstance;
  }

  // 3. Fallback: Mock Console Mailer for development
  console.warn('⚠️ SMTP credentials not configured. Using Mock Console Mailer for local dev...');
  transporterInstance = {
    sendMail: async (mailOptions) => {
      console.log('\n====================================================');
      console.log('✉️  [MOCK EMAIL SENT]');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Text:    ${mailOptions.text}`);
      console.log('====================================================\n');
      return {
        messageId: 'mock-id-' + Date.now(),
        envelope: { from: mailOptions.from, to: [mailOptions.to] },
      };
    }
  };
  return transporterInstance;
};

module.exports = { getTransporter };
