const prisma = require('../../config/db');

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdAndFirmId(id, firmId) {
    return await prisma.user.findFirst({
      where: {
        id,
        firmId,
        deletedAt: null,
      },
      select: {
        id: true,
        firmId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        mobileNumber: true,
        designation: true,
        role: true,
        status: true,
        profileImage: true,
        joiningDate: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        firmId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        designation: true,
        role: true,
        status: true,
        profileImage: true,
        joiningDate: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll({ firmId, page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', status, designation }) {
    const skip = (page - 1) * limit;

    const where = {
      firmId,
      deletedAt: null,
      role: 'USER',
    };

    if (status) {
      where.status = status;
    }

    if (designation) {
      where.designation = {
        contains: designation,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalRecords, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          firmId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          designation: true,
          role: true,
          status: true,
          profileImage: true,
          joiningDate: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return {
      data,
      pagination: {
        currentPage: page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  async update(id, firmId, data) {
    return await prisma.user.updateMany({
      where: { id, firmId, deletedAt: null },
      data,
    });
  }

  async softDelete(id, firmId) {
    return await prisma.user.updateMany({
      where: { id, firmId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  async updatePassword(id, firmId, hashedPassword) {
    return await prisma.user.updateMany({
      where: { id, firmId, deletedAt: null },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });
  }
}

module.exports = new UserRepository();
