const express = require('express');
const assignmentController = require('./assignment.controller');
const userController = require('../users/user.controller');
const {
  createAssignmentValidation,
  assignmentIdParamValidation,
  updateAssignmentValidation,
  userIdParamValidation,
  clientIdParamValidation,
  createTaskValidation,
} = require('./assignment.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

// Base URL: /api/firm-admin/dashboard
router.get('/dashboard', authorizeRoles('FIRM_ADMIN'), userController.getDashboard);

// Base URL: /api/firm-admin/client-assignments
router.post('/client-assignments', authorizeRoles('FIRM_ADMIN'), createAssignmentValidation, validate, assignmentController.assignClient);
router.get('/client-assignments', authorizeRoles('FIRM_ADMIN'), assignmentController.getAllAssignments);
router.delete('/client-assignments/:assignmentId', authorizeRoles('FIRM_ADMIN'), assignmentIdParamValidation, validate, assignmentController.removeAssignment);
router.patch('/client-assignments/:assignmentId', authorizeRoles('FIRM_ADMIN'), updateAssignmentValidation, validate, assignmentController.changeAssignment);

// Direct Tasks routes (/api/firm-admin/tasks)
router.post('/tasks', authorizeRoles('FIRM_ADMIN'), createTaskValidation, validate, assignmentController.createTask);
router.get('/tasks', authorizeRoles('FIRM_ADMIN'), assignmentController.getFirmTasks);

// Sub routes
router.get('/users/:userId/clients', authorizeRoles('FIRM_ADMIN'), userIdParamValidation, validate, assignmentController.getUserClients);
router.get('/clients/:clientId/users', authorizeRoles('FIRM_ADMIN'), clientIdParamValidation, validate, assignmentController.getClientUsers);

module.exports = router;
