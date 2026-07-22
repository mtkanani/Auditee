const express = require('express');
const complianceController = require('./compliance.controller');
const {
  createComplianceValidation,
  updateComplianceStatusValidation,
  generatePresetsValidation,
} = require('./compliance.validation');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticateSession);

router.get('/', complianceController.getAllComplianceItems);

router.use(authorizeRoles('FIRM_ADMIN'));

router.post('/', createComplianceValidation, validate, complianceController.createComplianceItem);
router.post('/generate-indian-presets', generatePresetsValidation, validate, complianceController.generateIndianPresets);
router.patch('/:id/status', updateComplianceStatusValidation, validate, complianceController.updateComplianceStatus);
router.post('/:id/create-task', complianceController.convertToTask);
router.post('/:id/send-reminder', complianceController.sendReminder);

module.exports = router;
