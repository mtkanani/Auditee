const crypto = require('crypto');
const prisma = require('../config/db');
const { sendDeleteAccountEmail } = require('./emailService');
const { BadRequestError, RateLimitError, NotFoundError } = require('../utils/errors');

/**
 * Business logic for requesting and sending an account deletion OTP.
 * @param {string} email User email address
 */
const requestDeleteOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // 1. Verify that target user exists in the database
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
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

  // 1. Confirm user exists in the database
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    throw new NotFoundError('User account not found.');
  }

  // 2. Validate that a verified deletion OTP is present
  const otpRecord = await prisma.deleteAccountOtp.findFirst({
    where: {
      email: normalizedEmail,
      verified: true,
    },
  });
  if (!otpRecord) {
    throw new BadRequestError('OTP verification is required before deleting your account.');
  }

  // 3. Delete user account and purge all related tracking entries transactionally
  await prisma.$transaction([
    // Delete user (cascades to user sessions automatically due to schema definitions)
    prisma.user.delete({
      where: { id: user.id },
    }),
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

  return { message: 'Account deleted successfully.' };
};

module.exports = {
  requestDeleteOtp,
  verifyDeleteOtp,
  deleteUserAccount,
};
