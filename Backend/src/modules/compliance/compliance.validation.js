const { body, param, query } = require('express-validator');

const createComplianceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Compliance title is required'),
  body('category')
    .optional()
    .isIn(['GST', 'INCOME_TAX', 'TDS', 'ROC_MCA', 'PF_ESI', 'AUDIT'])
    .withMessage('Category must be GST, INCOME_TAX, TDS, ROC_MCA, PF_ESI, or AUDIT'),
  body('dueDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Due date is required and must be a valid date'),
  body('period')
    .optional({ nullable: true })
    .trim(),
  body('clientId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .toInt(),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('penaltyDetails')
    .optional({ nullable: true })
    .trim(),
];

const updateComplianceStatusValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('status')
    .notEmpty()
    .isIn(['UPCOMING', 'IN_PROGRESS', 'FILED', 'OVERDUE', 'EXTENDED'])
    .withMessage('Invalid compliance status'),
];

const generatePresetsValidation = [
  body('year')
    .notEmpty()
    .isInt({ min: 2020, max: 2035 })
    .toInt(),
  body('month')
    .notEmpty()
    .isInt({ min: 1, max: 12 })
    .toInt(),
];

module.exports = {
  createComplianceValidation,
  updateComplianceStatusValidation,
  generatePresetsValidation,
};
