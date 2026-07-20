const express = require('express');
const assignmentController = require('./assignment.controller');
const {
  createAssignmentValidation,
  assignmentIdParamValidation,
  updateAssignmentValidation,
  userIdParamValidation,
  clientIdParamValidation,
} = require('./assignment.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);
router.use(authorizeRoles('FIRM_ADMIN'));

// Base URL: /api/firm-admin/client-assignments
router.post('/client-assignments', createAssignmentValidation, validate, assignmentController.assignClient);
router.get('/client-assignments', assignmentController.getAllAssignments);
router.delete('/client-assignments/:assignmentId', assignmentIdParamValidation, validate, assignmentController.removeAssignment);
router.patch('/client-assignments/:assignmentId', updateAssignmentValidation, validate, assignmentController.changeAssignment);

// Sub routes
router.get('/users/:userId/clients', userIdParamValidation, validate, assignmentController.getUserClients);
router.get('/clients/:clientId/users', clientIdParamValidation, validate, assignmentController.getClientUsers);

module.exports = router;
