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
      console.error('❌ Failed to create Ethereal Mail test account:', error);
      throw error;
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
  });

  return transporterInstance;
};

module.exports = { getTransporter };
