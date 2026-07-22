const prisma = require('../../config/db');

class TaskRepository {
  async createTask(taskData, assignedUserIds = [], subtasks = []) {
    const { assignmentScope, ...cleanData } = taskData;
    
    // Create base task
    const task = await prisma.task.create({
      data: {
        ...cleanData,
        assignees: assignedUserIds.length > 0 ? {
          create: assignedUserIds.map((uId) => ({ userId: uId })),
        } : undefined,
        subtasks: subtasks.length > 0 ? {
          create: subtasks.map((stTitle) => ({ title: typeof stTitle === 'string' ? stTitle : stTitle.title })),
        } : undefined,
      },
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        user: { select: { id: true, firstName: true, lastName: true, designation: true } },
        assignees: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, designation: true, profileImage: true } },
          },
        },
        subtasks: true,
      },
    });

    return task;
  }

  async findAllFirmTasks({ firmId, page = 1, limit = 10, status, priority, clientId, userId, search }) {
    const skip = (page - 1) * limit;

    const where = {
      firmId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (clientId) {
      where.clientId = parseInt(clientId, 10);
    }

    if (userId) {
      where.OR = [
        { userId: parseInt(userId, 10) },
        { assignees: { some: { userId: parseInt(userId, 10) } } },
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [totalRecords, data] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, clientName: true, companyName: true, gstNumber: true } },
          user: { select: { id: true, firstName: true, lastName: true, designation: true } },
          assignees: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true, designation: true } },
            },
          },
          subtasks: true,
          documents: true,
          _count: {
            select: { comments: true, subtasks: true },
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

  async findTaskById(taskId, firmId) {
    return await prisma.task.findFirst({
      where: {
        id: taskId,
        firmId,
        deletedAt: null,
      },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, phone: true, gstNumber: true } },
        user: { select: { id: true, firstName: true, lastName: true, designation: true, profileImage: true } },
        assignees: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, designation: true, profileImage: true } },
          },
        },
        subtasks: { orderBy: { createdAt: 'asc' } },
        comments: { orderBy: { createdAt: 'asc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        history: { orderBy: { createdAt: 'desc' } },
        dependencies: {
          include: {
            dependsOnTask: { select: { id: true, title: true, status: true, priority: true } },
          },
        },
      },
    });
  }

  async updateTask(taskId, firmId, data) {
    return await prisma.task.updateMany({
      where: { id: taskId, firmId, deletedAt: null },
      data,
    });
  }

  async assignUsersToTask(taskId, userIds) {
    // Clear old assignees & insert new
    await prisma.taskAssignee.deleteMany({ where: { taskId } });
    if (userIds && userIds.length > 0) {
      await prisma.taskAssignee.createMany({
        data: userIds.map((uId) => ({ taskId, userId: uId })),
      });
    }
  }

  // --- Subtasks ---
  async addSubtask(taskId, title) {
    return await prisma.taskSubtask.create({
      data: { taskId, title: title.trim() },
    });
  }

  async toggleSubtask(subtaskId, isCompleted, completedBy) {
    return await prisma.taskSubtask.update({
      where: { id: subtaskId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        completedBy: isCompleted ? completedBy : null,
      },
    });
  }

  // --- Comments ---
  async addComment(taskId, { userId, clientId, commenterName, commenterRole, comment, fileUrl }) {
    return await prisma.taskComment.create({
      data: {
        taskId,
        userId: userId || null,
        clientId: clientId || null,
        commenterName,
        commenterRole: commenterRole || 'EMPLOYEE',
        comment: comment.trim(),
        fileUrl: fileUrl ? fileUrl.trim() : null,
      },
    });
  }

  // --- Documents ---
  async addDocument(taskId, docData) {
    return await prisma.taskDocument.create({
      data: {
        taskId,
        fileName: docData.fileName.trim(),
        fileUrl: docData.fileUrl.trim(),
        fileType: docData.fileType || null,
        fileSize: docData.fileSize || null,
        uploadedBy: docData.uploadedBy || null,
        uploadedRole: docData.uploadedRole || 'EMPLOYEE',
      },
    });
  }

  // --- History Logs ---
  async logHistory(taskId, { action, details, performedBy, performedName }) {
    return await prisma.taskHistory.create({
      data: {
        taskId,
        action,
        details,
        performedBy: performedBy || null,
        performedName: performedName || 'System',
      },
    });
  }

  // --- Client Work Requests ---
  async findClientRequests(firmId) {
    return await prisma.task.findMany({
      where: {
        firmId,
        status: 'REQUESTED',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, phone: true } },
        documents: true,
      },
    });
  }

  // --- Task Templates ---
  async createTemplate(firmId, templateData) {
    return await prisma.taskTemplate.create({
      data: {
        firmId,
        title: templateData.title.trim(),
        category: templateData.category || 'GENERAL',
        priority: templateData.priority || 'MEDIUM',
        description: templateData.description ? templateData.description.trim() : null,
        defaultSubtasks: templateData.defaultSubtasks ? JSON.stringify(templateData.defaultSubtasks) : null,
      },
    });
  }

  async findTemplates(firmId) {
    return await prisma.taskTemplate.findMany({
      where: { firmId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- Task Dependencies ---
  async addDependency(taskId, dependsOnTaskId) {
    return await prisma.taskDependency.create({
      data: {
        taskId,
        dependsOnTaskId,
      },
    });
  }
}

module.exports = new TaskRepository();
