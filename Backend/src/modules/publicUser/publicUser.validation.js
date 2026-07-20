const { body, param, query } = require('express-validator');

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('city')
    .optional({ nullable: true })
    .trim(),
  body('profileImage')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Profile image must be a valid URL'),
];

const taskIdParamValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a valid positive integer')
    .toInt(),
];

const updateTaskStatusValidation = [
  ...taskIdParamValidation,
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, COMPLETED, or CANCELLED'),
];

const uploadDocumentValidation = [
  ...taskIdParamValidation,
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('fileName is required'),
  body('fileUrl')
    .trim()
    .notEmpty()
    .withMessage('fileUrl is required'),
  body('fileType')
    .optional({ nullable: true })
    .trim(),
  body('fileSize')
    .optional({ nullable: true })
    .isInt({ min: 0 }),
];

const createTimeEntryValidation = [
  ...taskIdParamValidation,
  body('hours')
    .isFloat({ min: 0.1, max: 24 })
    .withMessage('Hours must be a positive number up to 24'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
];

module.exports = {
  updateProfileValidation,
  taskIdParamValidation,
  updateTaskStatusValidation,
  uploadDocumentValidation,
  createTimeEntryValidation,
};
