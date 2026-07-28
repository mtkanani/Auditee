const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticateSession } = require('../../middlewares/auth.middleware');

// All report routes require authentication
router.use(authenticateSession);

// GET /api/reports/overview - Overall summary analytics KPI metrics
router.get('/overview', reportController.getSummaryOverview);

// POST /api/reports/custom - Dynamic custom report builder
router.post('/custom', reportController.generateCustomReport);

// POST /api/reports/custom/export - Export custom report to CSV
router.post('/custom/export', reportController.exportReportCSV);

// GET /api/reports/:reportType - Preset reports
router.get('/:reportType', reportController.getReport);

// GET /api/reports/:reportType/export - Export preset report to CSV
router.get('/:reportType/export', reportController.exportReportCSV);

module.exports = router;
