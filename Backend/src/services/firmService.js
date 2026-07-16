const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const firmRepository = require('../repositories/firmRepository');
const { sendCredentialsEmail } = require('./emailService');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Creates a new Firm and its Firm Admin.
 * Checks for uniqueness, hashes password, executes database transaction, and emails credentials.
 */
const createFirm = async (firmInput, adminInput) => {
  const firmEmail = firmInput.email.toLowerCase().trim();
  const adminEmail = adminInput.email.toLowerCase().trim();

  // 1. Check if Firm email already exists
  const existingFirm = await firmRepository.findFirmByEmail(firmEmail);
  if (existingFirm) {
    throw new BadRequestError('A firm with this email is already registered.');
  }

  // 2. Check if Admin email already exists
  const existingUser = await firmRepository.findUserByEmail(adminEmail);
  if (existingUser) {
    throw new BadRequestError('A user with this email is already registered.');
  }

  // 2b. Check if Admin phone number already exists
  if (adminInput.phone) {
    const existingUserByPhone = await firmRepository.findUserByMobileNumber(adminInput.phone);
    if (existingUserByPhone) {
      throw new BadRequestError('A user with this phone number is already registered.');
    }
  }

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(adminInput.password, 10);

  // 4. Run database creation in transaction
  const result = await firmRepository.createFirmWithAdmin(
    firmInput,
    {
      ...adminInput,
      hashedPassword,
    }
  );

  // 5. Send login credentials to the admin email asynchronously
  try {
    await sendCredentialsEmail(adminEmail, adminInput.password, firmInput.firmName);
  } catch (error) {
    console.error('Failed to send credentials email to Firm Admin:', error.message || error);
  }

  return {
    firm: result.firm,
    admin: {
      id: result.admin.id,
      firstName: result.admin.firstName,
      lastName: result.admin.lastName,
      email: result.admin.email,
      phone: result.admin.phone,
      role: result.admin.role,
    },
  };
};

/**
 * Fetches firms with support for pagination, search, and status filtering.
 */
const getFirms = async (queryParams) => {
  const page = parseInt(queryParams.page || '1', 10);
  const limit = parseInt(queryParams.limit || '10', 10);
  const { search, status } = queryParams;

  const { totalRecords, firms } = await firmRepository.findFirms({
    page,
    limit,
    search,
    status,
  });

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    pagination: {
      currentPage: page,
      limit,
      totalRecords,
      totalPages,
    },
    filters: {
      search: search || null,
      status: status || null,
    },
    data: firms,
  };
};

/**
 * Fetches a single Firm by ID, throwing NotFoundError if it doesn't exist.
 */
const getFirmById = async (firmId) => {
  const firm = await firmRepository.findFirmById(firmId, true);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }
  return firm;
};

/**
 * Updates a Firm's details.
 */
const updateFirm = async (firmId, firmData) => {
  const firm = await firmRepository.findFirmById(firmId, false);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }

  // Check unique email if it's changing
  if (firmData.email) {
    const emailToCheck = firmData.email.toLowerCase().trim();
    if (emailToCheck !== firm.email.toLowerCase()) {
      const existingFirm = await firmRepository.findFirmByEmail(emailToCheck);
      if (existingFirm) {
        throw new BadRequestError('A firm with this email is already registered.');
      }
    }
  }

  const updatedFirm = await firmRepository.updateFirm(firmId, {
    firmName: firmData.firmName,
    email: firmData.email ? firmData.email.toLowerCase().trim() : undefined,
    phone: firmData.phone,
    address: firmData.address,
    city: firmData.city,
    state: firmData.state,
    country: firmData.country,
    pincode: firmData.pincode,
  });

  return updatedFirm;
};

/**
 * Updates the Firm Admin details.
 */
const updateFirmAdmin = async (firmId, adminData) => {
  const firm = await firmRepository.findFirmById(firmId, false);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }

  const adminId = firm.firmAdminId;
  const existingAdmin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!existingAdmin) {
    throw new NotFoundError('Firm Admin user not found.');
  }

  // Check unique email if it's changing
  if (adminData.email) {
    const emailToCheck = adminData.email.toLowerCase().trim();
    if (emailToCheck !== existingAdmin.email.toLowerCase()) {
      const existingUser = await firmRepository.findUserByEmail(emailToCheck);
      if (existingUser) {
        throw new BadRequestError('A user with this email is already registered.');
      }
    }
  }

  // Check unique phone if it's changing
  if (adminData.phone) {
    const phoneToCheck = adminData.phone.trim();
    if (phoneToCheck !== existingAdmin.phone && phoneToCheck !== existingAdmin.mobileNumber) {
      const existingUserByPhone = await firmRepository.findUserByMobileNumber(phoneToCheck);
      if (existingUserByPhone) {
        throw new BadRequestError('A user with this phone number is already registered.');
      }
    }
  }

  const updatedAdmin = await firmRepository.updateUser(adminId, {
    firstName: adminData.firstName,
    lastName: adminData.lastName,
    email: adminData.email ? adminData.email.toLowerCase().trim() : undefined,
    phone: adminData.phone,
    mobileNumber: adminData.phone,
  });

  return {
    id: updatedAdmin.id,
    firstName: updatedAdmin.firstName,
    lastName: updatedAdmin.lastName,
    email: updatedAdmin.email,
    phone: updatedAdmin.phone,
    role: updatedAdmin.role,
  };
};

/**
 * Updates a Firm's status.
 * If setting status to INACTIVE or SUSPENDED, purges all sessions of that firm's users.
 */
const changeFirmStatus = async (firmId, status) => {
  const firm = await firmRepository.findFirmById(firmId, false);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }

  const updatedFirm = await firmRepository.updateFirm(firmId, { status });

  // If status is non-ACTIVE, force logout all users from this firm
  if (status !== 'ACTIVE') {
    const users = await prisma.user.findMany({
      where: { firmId },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);
    if (userIds.length > 0) {
      await prisma.userSession.deleteMany({
        where: {
          userId: { in: userIds },
        },
      });
    }
  }

  return updatedFirm;
};

/**
 * Resets the password of the Firm Admin.
 * Deletes all active sessions for the admin user to force a re-login.
 */
const resetFirmAdminPassword = async (firmId, newPassword) => {
  const firm = await firmRepository.findFirmById(firmId, false);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }

  const adminId = firm.firmAdminId;

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear sessions
  await prisma.$transaction([
    prisma.user.update({
      where: { id: adminId },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    }),
    prisma.userSession.deleteMany({
      where: { userId: adminId },
    }),
  ]);

  return {
    success: true,
    message: 'Firm Admin password reset successfully.',
  };
};

/**
 * Soft deletes a firm by ID.
 */
const deleteFirm = async (firmId) => {
  const firm = await firmRepository.findFirmById(firmId, false);
  if (!firm) {
    throw new NotFoundError('Firm not found or has been deleted.');
  }

  await firmRepository.softDeleteFirm(firmId);

  return {
    success: true,
    message: 'Firm deleted successfully.',
  };
};

module.exports = {
  createFirm,
  getFirms,
  getFirmById,
  updateFirm,
  updateFirmAdmin,
  changeFirmStatus,
  resetFirmAdminPassword,
  deleteFirm,
};
