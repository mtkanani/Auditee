const prisma = require('../../config/db');
const { parsePagination, findManyPaginated, countBy } = require('../../utils/pagination');

class DocumentRepository {
  /** One page of vault documents plus summary counts over every matching document. */
  async listVault(args, { page, limit }) {
    const { where } = args;
    const [result, categoryGroups, confidential] = await Promise.all([
      findManyPaginated(prisma.documentVault, args, parsePagination({ page, limit })),
      prisma.documentVault.groupBy({ by: ['category'], where, _count: { _all: true } }),
      prisma.documentVault.count({ where: { AND: [where, { isConfidential: true }] } }),
    ]);

    const byCategory = countBy(categoryGroups, 'category');
    return {
      ...result,
      summary: {
        total: Object.values(byCategory).reduce((a, b) => a + b, 0),
        gst: byCategory.GST_FILINGS || 0,
        tax: byCategory.INCOME_TAX || 0,
        confidential,
      },
    };
  }

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

  async findFirmDocuments({ firmId, category, search, clientId, taskId, page, limit }) {
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

    return await this.listVault({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    }, { page, limit });
  }

  async findClientDocuments({ clientId, firmId, category, search, page, limit }) {
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

    return await this.listVault({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    }, { page, limit });
  }

  async findUserDocuments({ firmId, category, search, page, limit }) {
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

    return await this.listVault({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        task: { select: { id: true, title: true } },
        uploader: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    }, { page, limit });
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
