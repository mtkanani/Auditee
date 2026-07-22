const taskService = require('./task.service');

class TaskController {
  async createTask(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const createdBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const task = await taskService.createTask(req.body, firmId, createdBy, performedName);
      return res.status(201).json({
        success: true,
        message: 'Task created and assigned successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const result = await taskService.getAllFirmTasks(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: 'Firm tasks fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const task = await taskService.getTaskById(taskId, firmId);
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
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const { status } = req.body;
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'User';
      const updatedTask = await taskService.updateTaskStatus(taskId, status, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveClientRequest(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const task = await taskService.approveClientRequest(taskId, req.body, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: 'Client Work Request approved and assigned',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientRequests(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const requests = await taskService.getClientRequests(firmId);
      return res.status(200).json({
        success: true,
        message: 'Client work requests fetched',
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  async addSubtask(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const { title } = req.body;
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'User';
      const subtask = await taskService.addSubtask(taskId, title, firmId, performedBy, performedName);
      return res.status(201).json({
        success: true,
        message: 'Subtask added to checklist',
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleSubtask(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const subtaskId = parseInt(req.params.subtaskId, 10);
      const { isCompleted } = req.body;
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'User';
      const updated = await taskService.toggleSubtask(taskId, subtaskId, isCompleted, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: 'Subtask toggled successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const comment = await taskService.addComment(taskId, req.body, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'Discussion comment posted',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const doc = await taskService.addDocument(taskId, req.body, firmId, req.user);
      return res.status(201).json({
        success: true,
        message: 'File attachment uploaded',
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const template = await taskService.createTemplate(req.body, firmId);
      return res.status(201).json({
        success: true,
        message: 'Task audit template created',
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTemplates(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const templates = await taskService.getTemplates(firmId);
      return res.status(200).json({
        success: true,
        message: 'Audit templates fetched',
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  async addDependency(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const taskId = parseInt(req.params.taskId, 10);
      const { dependsOnTaskId } = req.body;
      const dependency = await taskService.addDependency(taskId, parseInt(dependsOnTaskId, 10), firmId);
      return res.status(201).json({
        success: true,
        message: 'Task dependency linked',
        data: dependency,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
