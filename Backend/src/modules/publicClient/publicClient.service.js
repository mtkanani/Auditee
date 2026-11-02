const prisma = require('../../config/db');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');
const { resolveAttachment, attachmentDownload } = require('../../utils/attachments');

class PublicClientService {
  async getDashboard(clientId, firmId) {
    const [taskGroups, assignedUsersCount, recentTasks] = await Promise.all([
      prisma.task.groupBy({
        by: ['status'],
        where: { clientId, firmId, deletedAt: null },
        _count: { _all: true },
      }),
      prisma.clientAssignment.count({
        where: { clientId, user: { firmId, deletedAt: null } },
      }),
      prisma.task.findMany({
        where: { clientId, firmId, deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, designation: true },
          },
        },
      }),
    ]);

    const byStatus = Object.fromEntries(taskGroups.map((g) => [g.status, g._count._all]));
    const pendingTasks = byStatus.PENDING || 0;
    const inProgressTasks = byStatus.IN_PROGRESS || 0;
    const completedTasks = byStatus.COMPLETED || 0;
    const totalTasks = taskGroups.reduce((acc, g) => acc + g._count._all, 0);

    return {
      assignedUsersCount,
      tasksSummary: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
      recentTasks,
    };
  }


  async getProfile(clientId, firmId) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, firmId, deletedAt: null },
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
        createdAt: true,
        firm: {
          select: { id: true, firmName: true, email: true, phone: true },
        },
      },
    });

    if (!client) throw new NotFoundError('Client profile not found');
    return client;
  }

  async updateProfile(clientId, firmId, updateData) {
    const payload = {};
    if (updateData.clientName) payload.clientName = updateData.clientName.trim();
    if (updateData.companyName !== undefined) payload.companyName = updateData.companyName ? updateData.companyName.trim() : null;
    if (updateData.phone !== undefined) payload.phone = updateData.phone ? updateData.phone.trim() : null;
    if (updateData.address !== undefined) payload.address = updateData.address ? updateData.address.trim() : null;
    if (updateData.city !== undefined) payload.city = updateData.city ? updateData.city.trim() : null;
    if (updateData.state !== undefined) payload.state = updateData.state ? updateData.state.trim() : null;
    if (updateData.pincode !== undefined) payload.pincode = updateData.pincode ? updateData.pincode.trim() : null;

    await prisma.client.updateMany({
      where: { id: clientId, firmId, deletedAt: null },
      data: payload,
    });

    return await this.getProfile(clientId, firmId);
  }

  async getMyAssignedUsers(clientId, firmId) {
    const assignments = await prisma.clientAssignment.findMany({
      where: {
        clientId,
        user: { firmId, deletedAt: null },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            designation: true,
            profileImage: true,
          },
        },
      },
    });

    return assignments.map((a) => a.user);
  }

  async createWorkRequest({ title, description, priority, dueDate }, clientId, firmId) {
    // Automatically identify primary assigned user for this client
    const assignment = await prisma.clientAssignment.findFirst({
      where: {
        clientId,
        user: { firmId, deletedAt: null },
      },
      orderBy: { assignedAt: 'asc' },
    });

    const assignedUserId = assignment ? assignment.userId : null;

    const task = await prisma.task.create({
      data: {
        firmId,
        clientId,
        userId: assignedUserId,
        title: title.trim(),
        description: description ? description.trim() : null,
        priority: priority || 'MEDIUM',
        status: 'REQUESTED',
        dueDate: dueDate ? new Date(dueDate) : null,
        createdByType: 'CLIENT',
        createdBy: clientId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        client: {
          select: { id: true, clientName: true, companyName: true },
        },
      },
    });

    return task;
  }

  async getMyTasks(clientId, firmId) {
    return await prisma.task.findMany({
      where: { clientId, firmId, deletedAt: null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, designation: true } },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskDetails(taskId, clientId, firmId) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, firmId, deletedAt: null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, designation: true, email: true, phone: true } },
        documents: true,
      },
    });

    if (!task) throw new NotFoundError('Task not found');
    if (task.clientId !== clientId) throw new ForbiddenError('Access denied to this task');

    return task;
  }

  async uploadTaskDocument(taskId, docData, clientId, firmId) {
    const task = await this.getTaskDetails(taskId, clientId, firmId);
    const file = await resolveAttachment(docData, firmId, 'tasks');
    return await prisma.taskDocument.create({
      data: {
        taskId: task.id,
        fileName: docData.fileName,
        ...file,
        uploadedBy: clientId,
        uploadedRole: 'CLIENT',
      },
    });
  }

  /** Download link for an attachment on a task this client can see. */
  async getTaskDocumentDownload(taskId, documentId, clientId, firmId) {
    if (!Number.isInteger(documentId)) throw new NotFoundError('Attachment not found');
    const task = await this.getTaskDetails(taskId, clientId, firmId);
    const doc = await prisma.taskDocument.findFirst({ where: { id: documentId, taskId: task.id } });
    if (!doc) throw new NotFoundError('Attachment not found');
    return attachmentDownload(doc, doc.fileName);
  }
}

module.exports = new PublicClientService();
