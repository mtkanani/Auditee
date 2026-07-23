// src/modules/events/event.validation.js
const { query, body } = require('express-validator');

// GET /api/events?start=ISO&end=ISO
const getEventsValidation = [
  query('start')
    .exists({ checkFalsy: true })
    .withMessage('start date is required')
    .isISO8601()
    .withMessage('start must be a valid ISO date')
    .toDate(),
  query('end')
    .exists({ checkFalsy: true })
    .withMessage('end date is required')
    .isISO8601()
    .withMessage('end must be a valid ISO date')
    .toDate(),
];

// POST /api/events (admin only)
const createEventValidation = [
  body('type')
    .exists({ checkFalsy: true })
    .withMessage('Event type is required')
    .isIn(['TASK', 'COMPLIANCE', 'MEETING', 'LEAVE', 'CUSTOM'])
    .withMessage('Invalid event type'),
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .isString()
    .isLength({ max: 200 })
    .withMessage('Title too long'),
  body('start')
    .exists({ checkFalsy: true })
    .withMessage('Start date required')
    .isISO8601()
    .withMessage('Start must be ISO date')
    .toDate(),
  body('end')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('End must be ISO date')
    .toDate(),
  body('userId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer')
    .toInt(),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('metadata must be an object'),
];

module.exports = {
  getEventsValidation,
  createEventValidation,
};
