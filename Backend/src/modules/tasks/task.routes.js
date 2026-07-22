const express = require('express');
const taskController = require('./task.controller');
const {
  createTaskValidation,
  updateTaskStatusValidation,
  addSubtaskValidation,
  addCommentValidation,
  approveClientRequestValidation,
  createTemplateValidation,
} = require('./task.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

// Firm Admin / Employee / User accessible task endpoints
router.get('/', taskController.getAllTasks);
router.get('/client-requests', authorizeRoles('FIRM_ADMIN'), taskController.getClientRequests);
router.get('/templates', taskController.getTemplates);
router.post('/templates', authorizeRoles('FIRM_ADMIN'), createTemplateValidation, validate, taskController.createTemplate);

router.post('/', authorizeRoles('FIRM_ADMIN'), createTaskValidation, validate, taskController.createTask);
router.get('/:taskId', taskController.getTaskById);
router.patch('/:taskId/status', updateTaskStatusValidation, validate, taskController.updateTaskStatus);
router.patch('/:taskId/approve-request', authorizeRoles('FIRM_ADMIN'), approveClientRequestValidation, validate, taskController.approveClientRequest);

// Subtasks
router.post('/:taskId/subtasks', addSubtaskValidation, validate, taskController.addSubtask);
router.patch('/:taskId/subtasks/:subtaskId', taskController.toggleSubtask);

// Discussion Comments & File Attachments
router.post('/:taskId/comments', addCommentValidation, validate, taskController.addComment);
router.post('/:taskId/documents', taskController.addDocument);

// Task Dependencies
router.post('/:taskId/dependencies', authorizeRoles('FIRM_ADMIN'), taskController.addDependency);

module.exports = router;
