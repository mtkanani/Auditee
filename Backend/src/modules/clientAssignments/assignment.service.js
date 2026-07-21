const assignmentRepository = require('./assignment.repository');
const clientRepository = require('../clients/client.repository');
const userRepository = require('../users/user.repository');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class AssignmentService {
  async assignClient({ clientId, userId }, firmId, assignedBy) {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError('Client not found or does not belong to your firm');
    }

    const user = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!user) {
      throw new NotFoundError('User not found or does not belong to your firm');
    }

    const existing = await assignmentRepository.findAssignment(clientId, userId);
    if (existing) {
      throw new BadRequestError('Client is already assigned to this user');
    }

    return await assignmentRepository.create(clientId, userId, assignedBy);
  }

  async getAllAssignments(firmId) {
    const assignments = await assignmentRepository.findAllByFirm(firmId);
    return assignments;
  }

  async getUserClients(userId, firmId) {
    const user = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!user) {
      throw new NotFoundError('User not found in your firm');
    }

    const assignments = await assignmentRepository.findClientsByUserId(userId, firmId);
    return assignments.map((a) => a.client);
  }

  async getClientUsers(clientId, firmId) {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError('Client not found in your firm');
    }

    const assignments = await assignmentRepository.findUsersByClientId(clientId, firmId);
    return assignments.map((a) => a.user);
  }

  async removeAssignment(assignmentId, firmId) {
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment || assignment.client.firmId !== firmId) {
      throw new NotFoundError('Assignment not found');
    }

    await assignmentRepository.delete(assignmentId);
    return { message: 'Client assignment removed successfully' };
  }

  async changeAssignment(assignmentId, { userId, clientId }, firmId) {
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment || assignment.client.firmId !== firmId) {
      throw new NotFoundError('Assignment not found');
    }

    const payload = {};
    if (userId) {
      const user = await userRepository.findByIdAndFirmId(userId, firmId);
      if (!user) {
        throw new NotFoundError('Target User not found in your firm');
      }
      payload.userId = userId;
    }

    if (clientId) {
      const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
      if (!client) {
        throw new NotFoundError('Target Client not found in your firm');
      }
      payload.clientId = clientId;
    }

    return await assignmentRepository.update(assignmentId, payload);
  }

  async createTask(taskData, firmId, createdBy) {
    const { userId, clientId, title, description, priority, dueDate } = taskData;

    const user = await userRepository.findByIdAndFirmId(userId, firmId);
    if (!user) {
      throw new NotFoundError('Target User not found in your firm');
    }

    if (clientId) {
      const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
      if (!client) {
        throw new NotFoundError('Target Client not found in your firm');
      }
    }

    return await assignmentRepository.createTask({
      firmId,
      clientId: clientId || null,
      userId,
      title,
      description,
      priority,
      dueDate,
      createdBy,
    });
  }

  async getFirmTasks(firmId) {
    return await assignmentRepository.findTasksByFirm(firmId);
  }
}

module.exports = new AssignmentService();
