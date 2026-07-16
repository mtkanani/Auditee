const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { sendOtpEmail, sendForgotPasswordEmail, sendLoginOtpEmail } = require('./emailService');
const { BadRequestError, RateLimitError, NotFoundError, UnauthorizedError } = require('../utils/errors');

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
const generate6DigitOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Business logic for requesting and sending an OTP.
 */
const requestOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email is already registered before sending OTP
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw new BadRequestError('Email already registered');
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // 1. Spam Prevention: Max 10 OTP requests per hour per email
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

  // 2. Generate secure 6-digit OTP
  const otp = generate6DigitOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  // 3. Database operations (Transactional to guarantee integrity)
  await prisma.$transaction([
    // Log the OTP request attempt
    prisma.otpRequestLog.create({
      data: {
        email: normalizedEmail,
      },
    }),
    // Delete any previous OTP records for the same email
    prisma.otp.deleteMany({
      where: {
        email: normalizedEmail,
      },
    }),
    // Create the new OTP record
    prisma.otp.create({
      data: {
        email: normalizedEmail,
        otp,
        verified: false,
        expiresAt,
      },
    }),
  ]);

  // 4. Send email to user
  await sendOtpEmail(normalizedEmail, otp);

  return { message: 'OTP sent successfully to your email.' };
};

/**
 * Business logic for verifying an OTP.
 */
const verifyOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find the latest OTP record for this email
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 2. Check if OTP record exists
  if (!otpRecord) {
    throw new BadRequestError('Invalid or expired OTP request. Please request a new OTP.');
  }

  // 3. Check if stored OTP matches entered OTP
  if (otpRecord.otp !== otp) {
    throw new BadRequestError('Invalid OTP code. Please try again.');
  }

  // 4. Check whether OTP has expired
  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw new BadRequestError('OTP has expired. Please request a new OTP.');
  }

  // 5. If OTP is valid:
  // - Mark current OTP as verified = true
  // - Delete/invalidate old OTP records (e.g. any other records for this email, if any exist)
  await prisma.$transaction([
    prisma.otp.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verified: true,
      },
    }),
    // Optional: Clean up any other records that might have accumulated
    prisma.otp.deleteMany({
      where: {
        email: normalizedEmail,
        id: {
          not: otpRecord.id,
        },
      },
    }),
  ]);

  return { message: 'OTP verified successfully.' };
};

/**
 * Business logic for user registration.
 * Checks email and mobile uniqueness, checks OTP verified state, hashes password, saves user details, and cleans up verification tokens.
 */
const registerUser = async (userData) => {
  const { firstName, lastName, mobileNumber, email, password, city, role } = userData;

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedMobile = mobileNumber.trim();

  // 1. Check if email already exists
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUserByEmail) {
    throw new BadRequestError('Email already registered');
  }

  // 2. Check if mobile number already exists
  const existingUserByMobile = await prisma.user.findUnique({
    where: { mobileNumber: trimmedMobile },
  });
  if (existingUserByMobile) {
    throw new BadRequestError('Mobile number already registered');
  }

  // 3. Verify email OTP status
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
      verified: true,
    },
  });
  if (!otpRecord) {
    throw new BadRequestError('Please verify your email using OTP before registration');
  }

  // 4. Hash password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);

  // Map input role string to Prisma enum Role dynamically
  let mappedRole = 'USER';
  if (role) {
    const roleUpper = role.toUpperCase();
    if (['SUPER_ADMIN', 'FIRM_ADMIN', 'USER', 'EMPLOYEE', 'CLIENT', 'ADMIN'].includes(roleUpper)) {
      mappedRole = roleUpper;
    }
  }

  // 5. Create new user and delete active OTP inside a transaction to ensure integrity
  const [newUser] = await prisma.$transaction([
    prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: trimmedMobile,
        email: normalizedEmail,
        password: hashedPassword,
        city: city.trim(),
        role: mappedRole,
        isVerified: true,
      },
    }),
    prisma.otp.deleteMany({
      where: {
        email: normalizedEmail,
      },
    }),
  ]);

  // Return the registered user mapping back enum role to lowercase
  return {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    mobileNumber: newUser.mobileNumber,
    city: newUser.city,
    role: newUser.role.toLowerCase(),
  };
};

/**
 * Business logic for user login.
 * Validates email and password, generates secure random tokens using crypto, stores them in the db, and purges expired sessions.
 */
const loginUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // 2. Compare password using bcrypt.compare()
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Purge expired sessions automatically during login to prevent database bloat
  await prisma.userSession.deleteMany({
    where: {
      refreshTokenExpiresAt: {
        lt: new Date(),
      },
    },
  });

  // 4. Generate secure random tokens using crypto.randomBytes
  const accessToken = crypto.randomBytes(64).toString('hex');
  const refreshToken = crypto.randomBytes(128).toString('hex');
  const idToken = crypto.randomBytes(64).toString('hex');

  // 5. Read expirations from env configurations
  const accessTokenExpiryMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRY_MINUTES || '15', 10);
  const refreshTokenExpiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7', 10);
  const idTokenExpiryMinutes = parseInt(process.env.ID_TOKEN_EXPIRY_MINUTES || '60', 10);

  const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiryMinutes * 60 * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiryDays * 24 * 60 * 60 * 1000);
  const idTokenExpiresAt = new Date(Date.now() + idTokenExpiryMinutes * 60 * 1000);

  // 6. Save active session to the database
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      accessToken,
      refreshToken,
      idToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      idTokenExpiresAt,
    },
  });

  // 7. Map enum role back to lowercase for consistent client-side response contracts
  return {
    tokens: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      idToken: session.idToken,
    },
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      city: user.city,
      role: user.role.toLowerCase(),
    },
  };
};

/**
 * Business logic for verifying login OTP and generating active sessions.
 */
const verifyLoginOtpAndGenerateSession = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // 2. Find the latest OTP record for this email
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Check if OTP record exists
  if (!otpRecord) {
    throw new BadRequestError('Invalid or expired OTP request. Please log in again.');
  }

  // 4. Check if stored OTP matches entered OTP
  if (otpRecord.otp !== otp) {
    throw new BadRequestError('Invalid OTP code. Please try again.');
  }

  // 5. Check whether OTP has expired
  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw new BadRequestError('OTP has expired. Please log in again.');
  }

  // 6. Purge expired sessions and delete the OTP inside a transaction to ensure integrity
  await prisma.$transaction([
    prisma.userSession.deleteMany({
      where: {
        refreshTokenExpiresAt: {
          lt: new Date(),
        },
      },
    }),
    prisma.otp.deleteMany({
      where: {
        email: normalizedEmail,
      },
    }),
  ]);

  // 7. Generate secure random tokens using crypto.randomBytes
  const accessToken = crypto.randomBytes(64).toString('hex');
  const refreshToken = crypto.randomBytes(128).toString('hex');
  const idToken = crypto.randomBytes(64).toString('hex');

  // 8. Read expirations from env configurations
  const accessTokenExpiryMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRY_MINUTES || '15', 10);
  const refreshTokenExpiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7', 10);
  const idTokenExpiryMinutes = parseInt(process.env.ID_TOKEN_EXPIRY_MINUTES || '60', 10);

  const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiryMinutes * 60 * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiryDays * 24 * 60 * 60 * 1000);
  const idTokenExpiresAt = new Date(Date.now() + idTokenExpiryMinutes * 60 * 1000);

  // 9. Save new user session in the PostgreSQL database
  await prisma.userSession.create({
    data: {
      userId: user.id,
      accessToken,
      refreshToken,
      idToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      idTokenExpiresAt,
    },
  });

  // 10. Return success details with mapped lowercase role
  return {
    tokens: {
      accessToken,
      refreshToken,
      idToken,
    },
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.toLowerCase(),
    },
  };
};

/**
 * Business logic for user change password.
 * Verifies email presence, matches old password, ensures new password is new, hashes, and updates database records.
 */
const updateUserPassword = async (email, currentPassword, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // 2. Verify current password matches using bcrypt
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new BadRequestError('Current password is incorrect');
  }

  // 3. Verify new password is different from current password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new BadRequestError('New password must be different from current password');
  }

  // 4. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 5. Update user password and passwordChangedAt timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  return { message: 'Password changed successfully' };
};

/**
 * Business logic for sending Forgot Password OTP.
 * Verifies email exists, runs rate limits, deletes previous codes, saves new OTP, and sends reset email.
 */
const requestForgotPasswordOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check user exists
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // 2. Rate limiting check (max 10 requests per hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
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

  // 3. Generate random 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // 4. Save to DB and delete old codes in transaction
  await prisma.$transaction([
    prisma.otpRequestLog.create({
      data: { email: normalizedEmail },
    }),
    prisma.forgotPasswordOtp.deleteMany({
      where: { email: normalizedEmail },
    }),
    prisma.forgotPasswordOtp.create({
      data: {
        email: normalizedEmail,
        otp,
        verified: false,
        expiresAt,
      },
    }),
  ]);

  // 5. Send Email
  await sendForgotPasswordEmail(normalizedEmail, otp);

  return { message: 'OTP sent successfully' };
};

/**
 * Business logic for verifying Forgot Password OTP.
 * Validates match and checks expiry, then updates verified state.
 */
const verifyForgotPasswordOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find the latest OTP record
  const otpRecord = await prisma.forgotPasswordOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord || otpRecord.otp !== otp) {
    throw new BadRequestError('Invalid OTP');
  }

  // 2. Check if expired
  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw new BadRequestError('OTP has expired');
  }

  // 3. Mark verified = true
  await prisma.forgotPasswordOtp.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  return { message: 'OTP verified successfully' };
};

/**
 * Business logic to Reset User Password using verified OTP.
 * Confirms OTP verified flag is active, checks new password is new, hashes, and updates.
 */
const resetUserPassword = async (email, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Verify user exists
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // 2. Verify OTP verified = true status in forgot_password_otps
  const otpRecord = await prisma.forgotPasswordOtp.findFirst({
    where: {
      email: normalizedEmail,
      verified: true,
    },
  });
  if (!otpRecord) {
    throw new BadRequestError('Please verify OTP first');
  }

  // 3. Verify new password is not same as current password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new BadRequestError('New password must be different from old password');
  }

  // 4. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 5. Update user password and purge OTPs in transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    }),
    prisma.forgotPasswordOtp.deleteMany({
      where: { email: normalizedEmail },
    }),
  ]);

  return { message: 'Password reset successfully' };
};

module.exports = {
  requestOtp,
  verifyOtp,
  registerUser,
  loginUser,
  verifyLoginOtpAndGenerateSession,
  updateUserPassword,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetUserPassword,
};
