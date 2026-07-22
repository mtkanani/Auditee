const prisma = require('../../config/db');

class DocumentRepository {
  async createDocument(data) {
    return await prisma.documentVault.create({
      data,
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }

  async findFirmDocuments({ firmId, category, search, clientId, taskId }) {
    const where = {
      firmId,
      deletedAt: null,
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (clientId) {
      where.clientId = parseInt(clientId, 10);
    }

    if (taskId) {
      where.taskId = parseInt(taskId, 10);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return await prisma.documentVault.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }

  async findClientDocuments({ clientId, firmId, category, search }) {
    const where = {
      firmId,
      clientId,
      deletedAt: null,
      isConfidential: false,
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.documentVault.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }

  async findUserDocuments({ firmId, category, search }) {
    const where = {
      firmId,
      deletedAt: null,
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return await prisma.documentVault.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
  }

  async findDocumentById(id, firmId) {
    return await prisma.documentVault.findFirst({
      where: { id, firmId, deletedAt: null },
    });
  }

  async softDeleteDocument(id, firmId) {
    return await prisma.documentVault.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = new DocumentRepository();
