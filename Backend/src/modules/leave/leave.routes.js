const express = require('express');
const leaveController = require('./leave.controller');
const { applyLeaveValidation, reviewLeaveValidation } = require('./leave.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

// Shared User & Admin Endpoints
router.post('/apply', applyLeaveValidation, validate, leaveController.applyLeave);
router.get('/my-requests', leaveController.getMyLeaveData);
router.get('/calendar', leaveController.getLeaveCalendar);
router.get('/policy', leaveController.getLeavePolicy);

// Firm Admin Approval & Policy Configuration Endpoints
router.put('/policy', authorizeRoles('FIRM_ADMIN'), leaveController.updateLeavePolicy);
router.get('/balances', authorizeRoles('FIRM_ADMIN'), leaveController.getAllEmployeeBalances);
router.patch('/balances/:userId', authorizeRoles('FIRM_ADMIN'), leaveController.updateEmployeeLeaveBalance);
router.get('/pending-requests', authorizeRoles('FIRM_ADMIN'), leaveController.getPendingRequests);
router.get('/all-requests', authorizeRoles('FIRM_ADMIN'), leaveController.getAllFirmLeaveRequests);
router.patch('/:id/review', authorizeRoles('FIRM_ADMIN'), reviewLeaveValidation, validate, leaveController.reviewLeave);

module.exports = router;
