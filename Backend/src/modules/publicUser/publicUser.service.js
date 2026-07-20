const prisma = require('../../config/db');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');

class PublicUserService {
  async getDashboard(userId, firmId) {
    const [assignedClientsCount, totalTasks, pendingTasks, inProgressTasks, completedTasks, recentTasks] = await Promise.all([
      prisma.clientAssignment.count({
        where: {
          userId,
          client: { firmId, deletedAt: null },
        },
      }),
      prisma.task.count({
        where: { userId, firmId, deletedAt: null },
      }),
      prisma.task.count({
        where: { userId, firmId, status: 'PENDING', deletedAt: null },
      }),
      prisma.task.count({
        where: { userId, firmId, status: 'IN_PROGRESS', deletedAt: null },
      }),
      prisma.task.count({
        where: { userId, firmId, status: 'COMPLETED', deletedAt: null },
      }),
      prisma.task.findMany({
        where: { userId, firmId, deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { id: true, clientName: true, companyName: true },
          },
        },
      }),
    ]);

    return {
      assignedClientsCount,
      tasksSummary: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
      recentTasks,
    };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firmId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        mobileNumber: true,
        designation: true,
        status: true,
        profileImage: true,
        joiningDate: true,
        createdAt: true,
        firm: {
          select: { id: true, firmName: true, email: true },
        },
      },
    });
    if (!user) throw new NotFoundError('User profile not found');
    return user;
  }

  async updateProfile(userId, updateData) {
    const payload = {};
    if (updateData.firstName) payload.firstName = updateData.firstName.trim();
    if (updateData.lastName) payload.lastName = updateData.lastName.trim();
    if (updateData.phone !== undefined) payload.phone = updateData.phone ? updateData.phone.trim() : null;
    if (updateData.city !== undefined) payload.city = updateData.city ? updateData.city.trim() : null;
    if (updateData.profileImage !== undefined) payload.profileImage = updateData.profileImage || null;

    await prisma.user.update({
      where: { id: userId },
      data: payload,
    });

    return await this.getProfile(userId);
  }

  async getMyClients(userId, firmId) {
    const assignments = await prisma.clientAssignment.findMany({
      where: {
        userId,
        client: { firmId, deletedAt: null },
      },
      include: {
        client: {
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
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return assignments.map((a) => a.client);
  }

  async getMyTasks(userId, firmId, queryParams) {
    const { status, priority, search } = queryParams;
    const where = {
      userId,
      firmId,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.task.findMany({
      where,
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        documents: true,
        timeEntries: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskDetails(taskId, userId, firmId) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, firmId, deletedAt: null },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, phone: true } },
        documents: true,
        timeEntries: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!task) throw new NotFoundError('Task not found');
    if (task.userId !== userId) throw new ForbiddenError('Access denied: Task is not assigned to you');

    return task;
  }

  async updateTaskStatus(taskId, status, userId, firmId) {
    const task = await this.getTaskDetails(taskId, userId, firmId);
    return await prisma.task.update({
      where: { id: task.id },
      data: { status },
      include: {
        client: { select: { id: true, clientName: true } },
      },
    });
  }

  async uploadTaskDocument(taskId, docData, userId, firmId) {
    const task = await this.getTaskDetails(taskId, userId, firmId);
    return await prisma.taskDocument.create({
      data: {
        taskId: task.id,
        fileName: docData.fileName,
        fileUrl: docData.fileUrl,
        fileType: docData.fileType || null,
        fileSize: docData.fileSize ? parseInt(docData.fileSize, 10) : null,
        uploadedBy: userId,
        uploadedRole: 'USER',
      },
    });
  }

  async createTimeEntry(taskId, timeData, userId, firmId) {
    const task = await this.getTaskDetails(taskId, userId, firmId);
    return await prisma.timeEntry.create({
      data: {
        taskId: task.id,
        userId,
        hours: parseFloat(timeData.hours),
        description: timeData.description || null,
        date: timeData.date ? new Date(timeData.date) : new Date(),
      },
    });
  }
}

module.exports = new PublicUserService();
