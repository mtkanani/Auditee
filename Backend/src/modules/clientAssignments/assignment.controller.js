const assignmentService = require('./assignment.service');

class AssignmentController {
  async assignClient(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const assignedBy = req.user.id;
      const result = await assignmentService.assignClient(req.body, firmId, assignedBy);
      return res.status(201).json({
        success: true,
        message: 'Client assigned to user successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAssignments(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const data = await assignmentService.getAllAssignments(firmId);
      return res.status(200).json({
        success: true,
        message: 'Client assignments fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserClients(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = parseInt(req.params.userId, 10);
      const clients = await assignmentService.getUserClients(userId, firmId);
      return res.status(200).json({
        success: true,
        message: 'User clients fetched successfully',
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientUsers(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const users = await assignmentService.getClientUsers(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client assigned users fetched successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeAssignment(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const assignmentId = parseInt(req.params.assignmentId, 10);
      const result = await assignmentService.removeAssignment(assignmentId, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeAssignment(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const assignmentId = parseInt(req.params.assignmentId, 10);
      const updated = await assignmentService.changeAssignment(assignmentId, req.body, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client assignment updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const createdBy = req.user.id;
      const task = await assignmentService.createTask(req.body, firmId, createdBy);
      return res.status(201).json({
        success: true,
        message: 'Task created and assigned successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFirmTasks(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const tasks = await assignmentService.getFirmTasks(firmId);
      return res.status(200).json({
        success: true,
        message: 'Firm tasks fetched successfully',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssignmentController();
