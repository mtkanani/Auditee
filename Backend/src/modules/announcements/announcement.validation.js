const { body, param } = require('express-validator');

const createAnnouncementValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Notice content is required'),
  body('category')
    .optional({ nullable: true })
    .isString()
    .trim(),
  body('priority')
    .optional({ nullable: true })
    .isIn(['INFO', 'WARNING', 'URGENT'])
    .withMessage('Priority must be INFO, WARNING, or URGENT'),
  body('expiresAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('expiresAt must be a valid ISO date string'),
];

const announcementIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Announcement ID must be a positive integer')
    .toInt(),
];

module.exports = {
  createAnnouncementValidation,
  announcementIdParamValidation,
};
