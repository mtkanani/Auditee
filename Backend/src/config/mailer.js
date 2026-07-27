const nodemailer = require('nodemailer');

let transporterInstance = null;

/**
 * Initializes and retrieves the Nodemailer transporter.
 * Uses Nodemailer's built-in `service: 'gmail'` when SMTP_USER & SMTP_PASS (App Password) are provided,
 * with strict 4-second connection timeouts to prevent cloud host hanging.
 */
const getTransporter = async () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  // 1. Preferred: Gmail Service with App Password (automatically strips spaces & sets 4s timeout)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const cleanPassword = process.env.SMTP_PASS.replace(/\s+/g, '');
    console.log(`🔌 Configuring Gmail Transport for ${process.env.SMTP_USER}...`);
    
    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com') {
      transporterInstance = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPassword,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000,
        tls: { rejectUnauthorized: false },
      });
    } else {
      transporterInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPassword,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000,
      });
    }
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
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 5000,
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
