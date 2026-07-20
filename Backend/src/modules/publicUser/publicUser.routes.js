const express = require('express');
const publicUserController = require('./publicUser.controller');
const {
  updateProfileValidation,
  taskIdParamValidation,
  updateTaskStatusValidation,
  uploadDocumentValidation,
  createTimeEntryValidation,
} = require('./publicUser.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);
router.use(authorizeRoles('USER', 'EMPLOYEE'));

router.get('/dashboard', publicUserController.getDashboard);

router.get('/profile', publicUserController.getProfile);
router.put('/profile', updateProfileValidation, validate, publicUserController.updateProfile);

router.get('/clients', publicUserController.getMyClients);

router.get('/tasks', publicUserController.getMyTasks);
router.get('/tasks/:taskId', taskIdParamValidation, validate, publicUserController.getTaskDetails);
router.patch('/tasks/:taskId/status', updateTaskStatusValidation, validate, publicUserController.updateTaskStatus);
router.post('/tasks/:taskId/documents', uploadDocumentValidation, validate, publicUserController.uploadTaskDocument);
router.post('/tasks/:taskId/time-entry', createTimeEntryValidation, validate, publicUserController.createTimeEntry);

module.exports = router;
