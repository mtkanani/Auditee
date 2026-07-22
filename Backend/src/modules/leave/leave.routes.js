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

// Firm Admin Approval & Pending Inbox Endpoints
router.get('/pending-requests', authorizeRoles('FIRM_ADMIN'), leaveController.getPendingRequests);
router.patch('/:id/review', authorizeRoles('FIRM_ADMIN'), reviewLeaveValidation, validate, leaveController.reviewLeave);

module.exports = router;
