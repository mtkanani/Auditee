const publicClientService = require('./publicClient.service');

class PublicClientController {
  async getDashboard(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const data = await publicClientService.getDashboard(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client dashboard metrics fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const profile = await publicClientService.getProfile(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client profile fetched successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const updated = await publicClientService.updateProfile(clientId, firmId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Client profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAssignedUsers(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const users = await publicClientService.getMyAssignedUsers(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Assigned users fetched successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async createWorkRequest(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const task = await publicClientService.createWorkRequest(req.body, clientId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Work request task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyTasks(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const tasks = await publicClientService.getMyTasks(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client tasks fetched successfully',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskDetails(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const task = await publicClientService.getTaskDetails(taskId, clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Task details fetched successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadTaskDocument(req, res, next) {
    try {
      const clientId = req.user.clientId || req.user.id;
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const document = await publicClientService.uploadTaskDocument(taskId, req.body, clientId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicClientController();
