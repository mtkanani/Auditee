const nodemailer = require('nodemailer');

let transporterInstance = null;

/**
 * Initializes and retrieves the Nodemailer transporter.
 * If credentials are missing in development, it provisions a temporary Ethereal SMTP test account.
 */
const getTransporter = async () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  const isTestAccountNeeded = !process.env.SMTP_USER || !process.env.SMTP_PASS;

  if (isTestAccountNeeded) {
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
  }

  // Configure Gmail OAuth2 if client credentials are provided (bypasses SMTP blocks)
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

  // Create transporter with environment SMTP credentials
  const host = process.env.SMTP_HOST || (process.env.SMTP_USER && process.env.SMTP_USER.endsWith('@gmail.com') ? 'smtp.gmail.com' : 'smtp.ethereal.email');
  const port = parseInt(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? '465' : '587'), 10);

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds connection timeout
    greetingTimeout: 10000,   // 10 seconds greeting timeout
    socketTimeout: 15000,    // 15 seconds socket timeout
    tls: {
      rejectUnauthorized: false // Prevents certificate verification issues on cloud environments
    }
  });

  return transporterInstance;
};

module.exports = { getTransporter };
