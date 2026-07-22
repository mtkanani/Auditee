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
      include: {
        services: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                designation: true,
                profileImage: true,
              },
            },
          },
        },
        tasks: {
          where: { deletedAt: null },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
            dueDate: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.client.create({
      data,
    });
  }

  async findAll({ firmId, page = 1, limit = 10, search, gstSearch, clientType, status, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;

    const where = {
      firmId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (clientType) {
      where.clientType = clientType;
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
        { tanNumber: { contains: search, mode: 'insensitive' } },
        { gstNumber: { contains: search, mode: 'insensitive' } },
        { contactPersonName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalRecords, data] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          services: {
            where: { status: 'ACTIVE' },
            select: { id: true, serviceName: true, feeAmount: true, billingFrequency: true },
          },
          assignments: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, designation: true },
              },
            },
          },
          _count: {
            select: { tasks: true, documents: true },
          },
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

  // --- Services CRUD ---
  async addService(clientId, serviceData) {
    return await prisma.clientServiceItem.create({
      data: {
        clientId,
        serviceName: serviceData.serviceName.trim(),
        serviceCategory: serviceData.serviceCategory ? serviceData.serviceCategory.trim() : 'TAXATION',
        billingFrequency: serviceData.billingFrequency || 'MONTHLY',
        feeAmount: serviceData.feeAmount ? parseFloat(serviceData.feeAmount) : 0.0,
        status: serviceData.status || 'ACTIVE',
      },
    });
  }

  async removeService(serviceId, clientId) {
    return await prisma.clientServiceItem.deleteMany({
      where: { id: serviceId, clientId },
    });
  }

  // --- Documents CRUD ---
  async addDocument(clientId, docData) {
    return await prisma.clientDocument.create({
      data: {
        clientId,
        documentName: docData.documentName.trim(),
        documentType: docData.documentType ? docData.documentType.trim() : 'OTHER',
        fileUrl: docData.fileUrl.trim(),
        fileSize: docData.fileSize ? parseInt(docData.fileSize, 10) : null,
        uploadedBy: docData.uploadedBy || null,
      },
    });
  }

  async deleteDocument(documentId, clientId) {
    return await prisma.clientDocument.deleteMany({
      where: { id: documentId, clientId },
    });
  }

  // --- Activity Log CRUD ---
  async logActivity(clientId, { action, description, performedBy, performedName }) {
    return await prisma.clientActivityLog.create({
      data: {
        clientId,
        action,
        description,
        performedBy: performedBy || null,
        performedName: performedName || 'Firm Admin',
      },
    });
  }

  async getActivityLogs(clientId) {
    return await prisma.clientActivityLog.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new ClientRepository();
