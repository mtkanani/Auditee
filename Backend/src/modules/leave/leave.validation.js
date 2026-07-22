const { body, param, query } = require('express-validator');

const applyLeaveValidation = [
  body('leaveType')
    .notEmpty()
    .isIn(['CASUAL_LEAVE', 'SICK_LEAVE', 'EARNED_LEAVE', 'UNPAID_LEAVE'])
    .withMessage('Invalid leave type'),
  body('startDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Start date is required'),
  body('endDate')
    .notEmpty()
    .isISO8601()
    .withMessage('End date is required'),
  body('totalDays')
    .optional()
    .isFloat({ min: 0.5 })
    .toFloat(),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Leave reason is required'),
];

const reviewLeaveValidation = [
  param('id')
    .isInt({ min: 1 })
    .toInt(),
  body('status')
    .notEmpty()
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be APPROVED or REJECTED'),
  body('adminRemarks')
    .optional({ nullable: true })
    .trim(),
];

module.exports = {
  applyLeaveValidation,
  reviewLeaveValidation,
};
