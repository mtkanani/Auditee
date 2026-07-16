const prisma = require('../config/db');

/**
 * Creates a new Firm and its Firm Admin in a secure Prisma transaction.
 * Ensures the User is created first, then the Firm, then updates the User's firmId.
 */
const createFirmWithAdmin = async (firmData, adminData) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create Firm Admin User
    const user = await tx.user.create({
      data: {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email.toLowerCase().trim(),
        phone: adminData.phone,
        mobileNumber: adminData.phone || null,
        password: adminData.hashedPassword,
        city: firmData.city || null,
        role: 'FIRM_ADMIN',
        isVerified: true,
      },
    });

    // 2. Create Firm record referencing the created user
    const firm = await tx.firm.create({
      data: {
        firmName: firmData.firmName,
        email: firmData.email.toLowerCase().trim(),
        phone: firmData.phone,
        address: firmData.address || null,
        city: firmData.city || null,
        state: firmData.state || null,
        country: firmData.country || null,
        pincode: firmData.pincode || null,
        status: 'ACTIVE',
        firmAdminId: user.id,
      },
    });

    // 3. Set the User's firmId relation back to the created Firm
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { firmId: firm.id },
    });

    return { firm, admin: updatedUser };
  });
};

/**
 * Retrieves a single active (non-soft-deleted) Firm by its ID.
 */
const findFirmById = async (id, includeAdmin = true) => {
  return await prisma.firm.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: includeAdmin
      ? {
          firmAdmin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        }
      : undefined,
  });
};

/**
 * Queries and fetches firms based on search, status, and page/limit filters.
 */
const findFirms = async ({ page = 1, limit = 10, search, status }) => {
  const where = {
    deletedAt: null,
  };

  if (status) {
    where.status = status;
  }

  if (search) {
    const cleanSearch = search.trim();
    where.OR = [
      { firmName: { contains: cleanSearch, mode: 'insensitive' } },
      { email: { contains: cleanSearch, mode: 'insensitive' } },
      { phone: { contains: cleanSearch, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [totalRecords, firms] = await Promise.all([
    prisma.firm.count({ where }),
    prisma.firm.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        firmAdmin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    }),
  ]);

  return { totalRecords, firms };
};

/**
 * Updates a Firm's details.
 */
const updateFirm = async (id, data) => {
  return await prisma.firm.update({
    where: { id },
    data,
  });
};

/**
 * Updates a User's details (used to update Firm Admin).
 */
const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * Soft deletes a Firm by setting deletedAt to current time, and status to INACTIVE.
 * In the same transaction, deletes all active sessions for the Firm's users.
 */
const softDeleteFirm = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const firm = await tx.firm.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });

    // Find all users in this firm
    const users = await tx.user.findMany({
      where: { firmId: id },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    // Delete their sessions to force-logout immediately
    if (userIds.length > 0) {
      await tx.userSession.deleteMany({
        where: {
          userId: { in: userIds },
        },
      });
    }

    return firm;
  });
};

/**
 * Checks if a Firm exists with the given email address.
 */
const findFirmByEmail = async (email) => {
  return await prisma.firm.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      deletedAt: null,
    },
  });
};

/**
 * Checks if a User exists with the given email address.
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });
};

/**
 * Checks if a User exists with the given mobile number or phone.
 */
const findUserByMobileNumber = async (mobileNumber) => {
  if (!mobileNumber) return null;
  const cleanMobile = mobileNumber.trim();
  return await prisma.user.findFirst({
    where: {
      OR: [
        { mobileNumber: cleanMobile },
        { phone: cleanMobile },
      ],
    },
  });
};

module.exports = {
  createFirmWithAdmin,
  findFirmById,
  findFirms,
  updateFirm,
  updateUser,
  softDeleteFirm,
  findFirmByEmail,
  findUserByEmail,
  findUserByMobileNumber,
};
