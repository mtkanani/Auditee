const taskRepository = require('./task.repository');
const prisma = require('../../config/db');
const { NotFoundError, BadRequestError } = require('../../utils/errors');

class TaskService {
  async createTask(taskData, firmId, createdBy, performedName = 'Firm Admin') {
    let targetUserIds = [];

    if (taskData.assignmentScope === 'ALL') {
      // Fetch all active firm employees
      const firmUsers = await prisma.user.findMany({
        where: { firmId, role: { in: ['USER', 'EMPLOYEE'] }, status: 'ACTIVE', deletedAt: null },
        select: { id: true },
      });
      targetUserIds = firmUsers.map((u) => u.id);
    } else if (Array.isArray(taskData.assignedUserIds) && taskData.assignedUserIds.length > 0) {
      targetUserIds = taskData.assignedUserIds.map((id) => parseInt(id, 10));
    }

    const payload = {
      firmId,
      clientId: taskData.clientId ? parseInt(taskData.clientId, 10) : null,
      userId: targetUserIds.length > 0 ? targetUserIds[0] : null,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : null,
      priority: taskData.priority || 'MEDIUM',
      status: taskData.status || 'PENDING',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      createdByType: taskData.createdByType || 'FIRM_ADMIN',
      createdBy: createdBy || null,
      templateId: taskData.templateId ? parseInt(taskData.templateId, 10) : null,
    };

    const task = await taskRepository.createTask(payload, targetUserIds, taskData.subtasks || []);

    // Auto Log History
    await taskRepository.logHistory(task.id, {
      action: 'TASK_CREATED',
      details: `Task '${task.title}' created and assigned to ${targetUserIds.length} employee(s).`,
      performedBy: createdBy,
      performedName,
    });

    return task;
  }

  async getAllFirmTasks(queryParams, firmId) {
    return await taskRepository.findAllFirmTasks({ ...queryParams, firmId });
  }

  async getTaskById(taskId, firmId) {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  async updateTaskStatus(taskId, status, firmId, performedBy, performedName = 'Firm Admin') {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    await taskRepository.updateTask(taskId, firmId, { status });

    await taskRepository.logHistory(taskId, {
      action: 'STATUS_UPDATED',
      details: `Task status changed from '${task.status}' to '${status}'.`,
      performedBy,
      performedName,
    });

    return await this.getTaskById(taskId, firmId);
  }

  async approveClientRequest(taskId, approvalData, firmId, performedBy, performedName = 'Firm Admin') {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Client request not found');
    }

    let targetUserIds = [];
    if (approvalData.assignmentScope === 'ALL') {
      const firmUsers = await prisma.user.findMany({
        where: { firmId, role: { in: ['USER', 'EMPLOYEE'] }, status: 'ACTIVE', deletedAt: null },
        select: { id: true },
      });
      targetUserIds = firmUsers.map((u) => u.id);
    } else if (Array.isArray(approvalData.assignedUserIds) && approvalData.assignedUserIds.length > 0) {
      targetUserIds = approvalData.assignedUserIds.map((id) => parseInt(id, 10));
    }

    const payload = {
      status: 'PENDING', // Change status from REQUESTED to PENDING
      priority: approvalData.priority || task.priority,
      dueDate: approvalData.dueDate ? new Date(approvalData.dueDate) : task.dueDate,
      userId: targetUserIds.length > 0 ? targetUserIds[0] : null,
    };

    await taskRepository.updateTask(taskId, firmId, payload);
    if (targetUserIds.length > 0) {
      await taskRepository.assignUsersToTask(taskId, targetUserIds);
    }

    await taskRepository.logHistory(taskId, {
      action: 'CLIENT_REQUEST_APPROVED',
      details: `Client Work Request approved and assigned to ${targetUserIds.length} auditor(s).`,
      performedBy,
      performedName,
    });

    return await this.getTaskById(taskId, firmId);
  }

  // --- Subtasks ---
  async addSubtask(taskId, title, firmId, performedBy, performedName = 'Firm Admin') {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const subtask = await taskRepository.addSubtask(taskId, title);

    await taskRepository.logHistory(taskId, {
      action: 'SUBTASK_ADDED',
      details: `Subtask '${subtask.title}' added to checklist.`,
      performedBy,
      performedName,
    });

    return subtask;
  }

  async toggleSubtask(taskId, subtaskId, isCompleted, firmId, performedBy, performedName = 'User') {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await taskRepository.toggleSubtask(subtaskId, isCompleted, performedBy);

    await taskRepository.logHistory(taskId, {
      action: 'SUBTASK_TOGGLED',
      details: `Subtask '${updated.title}' marked as ${isCompleted ? 'COMPLETED' : 'INCOMPLETE'}.`,
      performedBy,
      performedName,
    });

    return updated;
  }

  // --- Comments ---
  async addComment(taskId, commentData, firmId, performer) {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const comment = await taskRepository.addComment(taskId, {
      userId: performer.role !== 'CLIENT' ? performer.id : null,
      clientId: performer.role === 'CLIENT' ? performer.id : null,
      commenterName: `${performer.firstName || ''} ${performer.lastName || ''}`.trim() || 'User',
      commenterRole: performer.role || 'EMPLOYEE',
      comment: commentData.comment,
      fileUrl: commentData.fileUrl,
    });

    await taskRepository.logHistory(taskId, {
      action: 'COMMENT_ADDED',
      details: `New discussion comment posted by ${comment.commenterName}.`,
      performedBy: performer.id,
      performedName: comment.commenterName,
    });

    return comment;
  }

  // --- Documents ---
  async addDocument(taskId, docData, firmId, performer) {
    const task = await taskRepository.findTaskById(taskId, firmId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const doc = await taskRepository.addDocument(taskId, {
      ...docData,
      uploadedBy: performer.id,
      uploadedRole: performer.role,
    });

    await taskRepository.logHistory(taskId, {
      action: 'DOCUMENT_ATTACHED',
      details: `File attachment '${doc.fileName}' uploaded.`,
      performedBy: performer.id,
      performedName: `${performer.firstName || ''} ${performer.lastName || ''}`.trim() || 'User',
    });

    return doc;
  }

  // --- Client Requests ---
  async getClientRequests(firmId) {
    return await taskRepository.findClientRequests(firmId);
  }

  // --- Templates ---
  async createTemplate(templateData, firmId) {
    return await taskRepository.createTemplate(firmId, templateData);
  }

  async getTemplates(firmId) {
    return await taskRepository.findTemplates(firmId);
  }

  // --- Dependencies ---
  async addDependency(taskId, dependsOnTaskId, firmId) {
    const task = await taskRepository.findTaskById(taskId, firmId);
    const prerequisiteTask = await taskRepository.findTaskById(dependsOnTaskId, firmId);
    if (!task || !prerequisiteTask) {
      throw new NotFoundError('Task or prerequisite task not found');
    }

    return await taskRepository.addDependency(taskId, dependsOnTaskId);
  }
}

module.exports = new TaskService();
