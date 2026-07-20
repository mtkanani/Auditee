const express = require('express');
const publicClientController = require('./publicClient.controller');
const {
  updateClientProfileValidation,
  createWorkRequestValidation,
  taskIdParamValidation,
  uploadDocumentValidation,
} = require('./publicClient.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);
router.use(authorizeRoles('CLIENT'));

router.get('/dashboard', publicClientController.getDashboard);

router.get('/profile', publicClientController.getProfile);
router.put('/profile', updateClientProfileValidation, validate, publicClientController.updateProfile);

router.get('/my-user', publicClientController.getMyAssignedUsers);

router.post('/tasks', createWorkRequestValidation, validate, publicClientController.createWorkRequest);
router.get('/tasks', publicClientController.getMyTasks);
router.get('/tasks/:taskId', taskIdParamValidation, validate, publicClientController.getTaskDetails);
router.post('/tasks/:taskId/documents', uploadDocumentValidation, validate, publicClientController.uploadTaskDocument);

module.exports = router;
