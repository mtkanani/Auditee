const prisma = require('../../config/db');

class ClientRepository {
  async findByEmail(email) {
    return await prisma.client.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findByIdAndFirmId(id, firmId) {
    return await prisma.client.findFirst({
      where: {
        id,
        firmId,
        deletedAt: null,
      },
    });
  }

  async create(data) {
    return await prisma.client.create({
      data,
    });
  }

  async findAll({ firmId, page = 1, limit = 10, search, gstSearch, status, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;

    const where = {
      firmId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (gstSearch) {
      where.gstNumber = {
        contains: gstSearch,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { panNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalRecords, data] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          firmId: true,
          clientType: true,
          clientName: true,
          companyName: true,
          email: true,
          phone: true,
          gstNumber: true,
          panNumber: true,
          businessType: true,
          address: true,
          city: true,
          state: true,
          country: true,
          pincode: true,
          status: true,
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
    return await prisma.client.updateMany({
      where: { id, firmId, deletedAt: null },
      data,
    });
  }

  async softDelete(id, firmId) {
    return await prisma.client.updateMany({
      where: { id, firmId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = new ClientRepository();
