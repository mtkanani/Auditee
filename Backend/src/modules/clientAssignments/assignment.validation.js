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

module.exports = {
  createAssignmentValidation,
  assignmentIdParamValidation,
  updateAssignmentValidation,
  userIdParamValidation,
  clientIdParamValidation,
};
