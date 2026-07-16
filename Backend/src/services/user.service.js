const prisma = require('../config/db');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Service logic to query, search, page, and sort user database records.
 * @param {object} queryParams Filters and query details passed from request.
 */
const fetchUsers = async (queryParams) => {
  const { page = 1, limit = 10, search, role, sortBy, sortOrder } = queryParams;

  const where = {};

  // 1. Role Filter mapping lowercase user input to DB Enum
  if (role) {
    const roleUpper = role.toUpperCase();
    if (['SUPER_ADMIN', 'FIRM_ADMIN', 'USER', 'EMPLOYEE', 'CLIENT', 'ADMIN'].includes(roleUpper)) {
      where.role = roleUpper;
    }
  }

  // 2. Case-Insensitive Search logic across multiple columns
  if (search) {
    const cleanSearch = search.trim();
    where.OR = [
      { firstName: { contains: cleanSearch, mode: 'insensitive' } },
      { lastName: { contains: cleanSearch, mode: 'insensitive' } },
      { email: { contains: cleanSearch, mode: 'insensitive' } },
      { mobileNumber: { contains: cleanSearch, mode: 'insensitive' } },
      { city: { contains: cleanSearch, mode: 'insensitive' } },
    ];
  }

  // 3. Sorting configuration
  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder ? sortOrder.toLowerCase() : 'asc';
  } else {
    orderBy.createdAt = 'desc'; // Default: newest records first
  }

  // 4. Pagination calculations
  const skip = (page - 1) * limit;
  const take = limit;

  // 5. Query count and list in parallel for optimal database response times
  const [totalRecords, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobileNumber: true,
        email: true,
        city: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  // 6. Handle cases where database results are empty
  if (totalRecords === 0 || users.length === 0) {
    throw new NotFoundError('No users found');
  }

  const totalPages = Math.ceil(totalRecords / limit);

  // 7. Format details returning lowercase role API string matches
  return {
    pagination: {
      currentPage: page,
      limit,
      totalRecords,
      totalPages,
    },
    filters: {
      search: search || null,
      role: role || null,
    },
    data: users.map((user) => ({
      ...user,
      role: user.role.toLowerCase(),
    })),
  };
};

/**
 * Service logic to update user profile details.
 * Checks for restricted fields (email, role, password), verifies user presence, validates mobile uniqueness, and saves changes.
 * @param {string} userId UUID of user to update.
 * @param {object} updateData Body parameters sent for updates.
 */
const updateUserProfile = async (userId, updateData) => {
  // 1. Explicitly check for restricted fields
  if (updateData.hasOwnProperty('email')) {
    throw new BadRequestError('Email cannot be updated');
  }
  if (updateData.hasOwnProperty('role')) {
    throw new BadRequestError('Role cannot be updated');
  }
  if (updateData.hasOwnProperty('password')) {
    throw new BadRequestError('Password cannot be updated from this API');
  }

  // 2. Find if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  const { firstName, lastName, mobileNumber, city } = updateData;
  const dataToUpdate = {};

  // 3. Uniqueness check for mobile number if it's being updated
  if (mobileNumber !== undefined) {
    const cleanMobile = mobileNumber.trim();
    
    // Query another user matching this mobile number
    const duplicateUser = await prisma.user.findFirst({
      where: {
        mobileNumber: cleanMobile,
        NOT: { id: userId },
      },
    });

    if (duplicateUser) {
      throw new BadRequestError('Mobile number already exists');
    }
    dataToUpdate.mobileNumber = cleanMobile;
  }

  // 4. Build payload with optional fields (do not overwrite if not sent)
  if (firstName !== undefined) dataToUpdate.firstName = firstName.trim();
  if (lastName !== undefined) dataToUpdate.lastName = lastName.trim();
  if (city !== undefined) dataToUpdate.city = city.trim();

  // 5. If no fields are provided to update, return the existing user (omitting password)
  if (Object.keys(dataToUpdate).length === 0) {
    return {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      mobileNumber: existingUser.mobileNumber,
      email: existingUser.email,
      city: existingUser.city,
      role: existingUser.role.toLowerCase(),
      isVerified: existingUser.isVerified,
      updatedAt: existingUser.updatedAt,
    };
  }

  // 6. Update user in PostgreSQL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      mobileNumber: true,
      email: true,
      city: true,
      role: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    ...updatedUser,
    role: updatedUser.role.toLowerCase(),
  };
};

module.exports = {
  fetchUsers,
  updateUserProfile,
};
