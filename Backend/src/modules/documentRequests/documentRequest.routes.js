const express = require('express');
const { body, param, query } = require('express-validator');
const controller = require('./documentRequest.controller');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/roleMiddleware');

const router = express.Router();
router.use(authenticateSession);

const idParam = [param('id').isInt({ min: 1 }).toInt()];

// Clients see what their firm is waiting for; the firm admin manages the requests.
router.get('/', authorizeRoles('FIRM_ADMIN', 'CLIENT'), [query('status').optional().isIn(['PENDING', 'RECEIVED', 'CANCELLED', 'ALL'])], validate, controller.list);
router.post(
  '/',
  authorizeRoles('FIRM_ADMIN'),
  [
    body('clientId').isInt({ min: 1 }).withMessage('Choose a client'),
    body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Say which document you need'),
    body('notes').optional({ nullable: true }).isString().isLength({ max: 1000 }),
    body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a date'),
  ],
  validate,
  controller.create
);
router.patch('/:id', authorizeRoles('FIRM_ADMIN'), [...idParam, body('status').isIn(['RECEIVED', 'CANCELLED'])], validate, controller.update);
router.post('/:id/remind', authorizeRoles('FIRM_ADMIN'), idParam, validate, controller.remind);

module.exports = router;
