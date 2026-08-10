const express = require('express');
const attendanceController = require('./attendance.controller');
const { checkInValidation, checkOutValidation } = require('./attendance.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

// Shared Endpoints (Accessible by both Employees & Firm Admins)
router.get('/today', attendanceController.getTodayStatus);
router.post('/check-in', checkInValidation, validate, attendanceController.checkIn);
router.post('/check-out', checkOutValidation, validate, attendanceController.checkOut);
router.get('/my-logs', attendanceController.getMyLogs);

// Firm Admin Only Report & Settings
router.get('/firm-report', authorizeRoles('FIRM_ADMIN'), attendanceController.getFirmReport);
router.get('/geofence-settings', authorizeRoles('FIRM_ADMIN', 'EMPLOYEE', 'SENIOR_AUDITOR', 'JUNIOR_AUDITOR'), attendanceController.getGeofenceSettings);
router.put('/geofence-settings', authorizeRoles('FIRM_ADMIN'), attendanceController.updateGeofenceSettings);

module.exports = router;
