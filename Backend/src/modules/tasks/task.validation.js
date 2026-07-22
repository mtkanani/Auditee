const { body, param, query } = require('express-validator');

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority level'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('clientId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .toInt(),
  body('assignmentScope')
    .optional()
    .isIn(['SINGLE', 'MULTIPLE', 'ALL'])
    .withMessage('Assignment scope must be SINGLE, MULTIPLE, or ALL'),
  body('assignedUserIds')
    .optional()
    .isArray()
    .withMessage('assignedUserIds must be an array of user IDs'),
  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array of strings'),
  body('templateId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .toInt(),
];

const updateTaskStatusValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer')
    .toInt(),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'REQUESTED'])
    .withMessage('Invalid task status'),
];

const addSubtaskValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .toInt(),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Subtask title is required'),
];

const addCommentValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .toInt(),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment content cannot be empty'),
  body('fileUrl')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

const approveClientRequestValidation = [
  param('taskId')
    .isInt({ min: 1 })
    .toInt(),
  body('assignmentScope')
    .optional()
    .isIn(['SINGLE', 'MULTIPLE', 'ALL'])
    .withMessage('Assignment scope must be SINGLE, MULTIPLE, or ALL'),
  body('assignedUserIds')
    .optional()
    .isArray()
    .withMessage('assignedUserIds must be an array of user IDs'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601(),
];

const createTemplateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Template title is required'),
  body('category')
    .optional()
    .trim(),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('defaultSubtasks')
    .optional()
    .isArray()
    .withMessage('defaultSubtasks must be an array of subtask title strings'),
];

module.exports = {
  createTaskValidation,
  updateTaskStatusValidation,
  addSubtaskValidation,
  addCommentValidation,
  approveClientRequestValidation,
  createTemplateValidation,
};
