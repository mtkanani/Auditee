const crypto = require('crypto');
const prisma = require('../config/db');
const { sendDeleteAccountEmail } = require('./emailService');
const { BadRequestError, RateLimitError, NotFoundError } = require('../utils/errors');
const { invalidateSessionCache } = require('../middlewares/auth.middleware');

// A verified code allows deletion for this long; after that the person must verify again.
const VERIFIED_WINDOW_MS = 15 * 60 * 1000;

/** The employee/admin user or the client (portal login) behind an email, or null. */
const findAccount = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return { kind: 'user', account: user };
  const client = await prisma.client.findFirst({ where: { email, deletedAt: null } });
  return client ? { kind: 'client', account: client } : null;
};

/**
 * Business logic for requesting and sending an account deletion OTP.
 * @param {string} email User email address
 */
const requestDeleteOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // 1. Verify that the account exists (employee/admin user or client portal login)
  if (!(await findAccount(normalizedEmail))) {
    throw new NotFoundError('User account not found.');
  }

  // 2. Spam Prevention: Limit to max 10 OTP requests per hour per email
  const hourlyAttempts = await prisma.otpRequestLog.count({
    where: {
      email: normalizedEmail,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });
  if (hourlyAttempts >= 10) {
    throw new RateLimitError('Maximum of 10 OTP requests per hour per email exceeded. Please try again later.');
  }

  // 3. Generate secure random 6-digit OTP code
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  // 4. Update database tables transactionally
  await prisma.$transaction([
    // Log OTP request
    prisma.otpRequestLog.create({
      data: { email: normalizedEmail },
    }),
    // Delete existing delete-account codes for this email
    prisma.deleteAccountOtp.deleteMany({
      where: { email: normalizedEmail },
    }),
    // Save new code
    prisma.deleteAccountOtp.create({
      data: {
        email: normalizedEmail,
        otp,
        verified: false,
        expiresAt,
      },
    }),
  ]);

  // 5. Dispatch code via email
  await sendDeleteAccountEmail(normalizedEmail, otp);

  return { message: 'Account deletion OTP sent successfully to your email.' };
};

/**
 * Business logic for verifying an account deletion OTP.
 * @param {string} email User email address
 * @param {string} otp The 6-digit code
 */
const verifyDeleteOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Fetch latest deletion OTP record
  const otpRecord = await prisma.deleteAccountOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new BadRequestError('Invalid or expired OTP request. Please request a new OTP.');
  }

  // 2. Match OTP input
  if (otpRecord.otp !== otp) {
    throw new BadRequestError('Invalid OTP code. Please try again.');
  }

  // 3. Validate expiration
  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw new BadRequestError('OTP has expired. Please request a new OTP.');
  }

  // 4. Mark OTP as verified in the DB
  await prisma.deleteAccountOtp.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  return { message: 'OTP verified successfully.' };
};

/**
 * Business logic to permanently delete a user account.
 * @param {string} email User email address
 */
const deleteUserAccount = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Confirm the account exists
  const found = await findAccount(normalizedEmail);
  if (!found) {
    throw new NotFoundError('User account not found.');
  }

  // 2. Validate that a recently verified deletion OTP is present. This endpoint needs no login, so
  //    an old verification must not let someone who only knows the email delete the account later.
  const otpRecord = await prisma.deleteAccountOtp.findFirst({
    where: {
      email: normalizedEmail,
      verified: true,
      createdAt: { gte: new Date(Date.now() - VERIFIED_WINDOW_MS) },
    },
  });
  if (!otpRecord) {
    throw new BadRequestError('OTP verification is required before deleting your account.');
  }

  // 3. Remove the account. Clients are the firm's records (invoices, tasks, documents the firm must
  //    keep), so for them only the portal login goes: password cleared and sessions signed out.
  const removeAccount =
    found.kind === 'user'
      ? [
          // Delete user (cascades to user sessions automatically due to schema definitions)
          prisma.user.delete({ where: { id: found.account.id } }),
        ]
      : [
          prisma.client.update({ where: { id: found.account.id }, data: { password: null } }),
          prisma.userSession.deleteMany({ where: { clientId: found.account.id } }),
          prisma.clientActivityLog.create({
            data: {
              clientId: found.account.id,
              action: 'PORTAL_ACCOUNT_DELETED',
              description: 'Client deleted their portal login. Their records stay with the firm.',
              performedName: found.account.clientName || 'Client',
            },
          }),
        ];

  await prisma.$transaction([
    ...removeAccount,
    // Clean up deletion OTP logs
    prisma.deleteAccountOtp.deleteMany({
      where: { email: normalizedEmail },
    }),
    // Clean up other authentication OTP logs to prevent database bloat
    prisma.otp.deleteMany({
      where: { email: normalizedEmail },
    }),
    prisma.forgotPasswordOtp.deleteMany({
      where: { email: normalizedEmail },
    }),
    prisma.otpRequestLog.deleteMany({
      where: { email: normalizedEmail },
    }),
  ]);

  console.log(`[Security Log] Account permanently deleted for email: ${normalizedEmail}`);
  invalidateSessionCache();

  return {
    message:
      found.kind === 'user'
        ? 'Account deleted successfully.'
        : 'Your portal login has been deleted. Your firm keeps the records of work done for you.',
  };
};


module.exports = {
  requestDeleteOtp,
  verifyDeleteOtp,
  deleteUserAccount,
};
