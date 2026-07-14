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
    console.warn('⚠️ SMTP user or password missing. Generating an Ethereal Mail test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`✉️ Test SMTP configured. Username: ${testAccount.user}`);
      return transporterInstance;
    } catch (error) {
      console.error('❌ Failed to create Ethereal Mail test account:', error.message || error);
      console.warn('⚠️ Falling back to Mock/Console Mail Transporter (emails will be printed to console)...');
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
  }

  // Create transporter with environment SMTP credentials
  transporterInstance = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000, // 5 seconds connection timeout
    greetingTimeout: 5000,   // 5 seconds greeting timeout
    socketTimeout: 10000,    // 10 seconds socket timeout
    tls: {
      rejectUnauthorized: false // Prevents certificate verification issues on cloud environments
    }
  });

  return transporterInstance;
};

module.exports = { getTransporter };
