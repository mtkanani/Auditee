const publicUserService = require('./publicUser.service');

class PublicUserController {
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const data = await publicUserService.getDashboard(userId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Employee dashboard summary fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await publicUserService.getProfile(userId);
      return res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updated = await publicUserService.updateProfile(userId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyClients(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const clients = await publicUserService.getMyClients(userId, firmId);
      return res.status(200).json({
        success: true,
        message: 'My assigned clients fetched successfully',
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const tasks = await publicUserService.getMyTasks(userId, firmId, req.query);
      return res.status(200).json({
        success: true,
        message: 'My tasks fetched successfully',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const task = await publicUserService.getTaskDetails(taskId, userId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Task details fetched successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const { status } = req.body;
      const updated = await publicUserService.updateTaskStatus(taskId, status, userId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadTaskDocument(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const document = await publicUserService.uploadTaskDocument(taskId, req.body, userId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Task document uploaded successfully',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTimeEntry(req, res, next) {
    try {
      const userId = req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const timeEntry = await publicUserService.createTimeEntry(taskId, req.body, userId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Time entry logged successfully',
        data: timeEntry,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicUserController();
