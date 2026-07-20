const { body, param } = require('express-validator');

const updateClientProfileValidation = [
  body('clientName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name must be between 2 and 100 characters'),
  body('companyName')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Company name cannot exceed 150 characters'),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('address')
    .optional({ nullable: true })
    .trim(),
  body('city')
    .optional({ nullable: true })
    .trim(),
  body('state')
    .optional({ nullable: true })
    .trim(),
  body('pincode')
    .optional({ nullable: true })
    .trim()
    .isPostalCode('IN')
    .withMessage('Invalid pincode format'),
];

const createWorkRequestValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO date string'),
];

const taskIdParamValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a valid positive integer')
    .toInt(),
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

module.exports = {
  updateClientProfileValidation,
  createWorkRequestValidation,
  taskIdParamValidation,
  uploadDocumentValidation,
};
