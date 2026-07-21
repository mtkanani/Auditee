const { body, param, query } = require('express-validator');

const createAssignmentValidation = [
  body('clientId')
    .isInt({ min: 1 })
    .withMessage('clientId must be a valid positive integer')
    .toInt(),
  body('userId')
    .isInt({ min: 1 })
    .withMessage('userId must be a valid positive integer')
    .toInt(),
];

const assignmentIdParamValidation = [
  param('assignmentId')
    .isInt({ min: 1 })
    .withMessage('assignmentId must be a valid positive integer')
    .toInt(),
];

const updateAssignmentValidation = [
  ...assignmentIdParamValidation,
  body('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('userId must be a valid positive integer')
    .toInt(),
  body('clientId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('clientId must be a valid positive integer')
    .toInt(),
];

const userIdParamValidation = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('userId must be a valid positive integer')
    .toInt(),
];

const clientIdParamValidation = [
  param('clientId')
    .isInt({ min: 1 })
    .withMessage('clientId must be a valid positive integer')
    .toInt(),
];

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('userId')
    .isInt({ min: 1 })
    .withMessage('Assigned userId must be a valid positive integer')
    .toInt(),
  body('clientId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('clientId must be a valid positive integer')
    .toInt(),
  body('description')
    .optional({ nullable: true })
    .isString()
    .trim(),
  body('priority')
    .optional({ nullable: true })
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO 8601 date string'),
];

module.exports = {
  createAssignmentValidation,
  assignmentIdParamValidation,
  updateAssignmentValidation,
  userIdParamValidation,
  clientIdParamValidation,
  createTaskValidation,
};
