const express = require('express');
const { param } = require('express-validator');
const notificationController = require('./notification.controller');
const validate = require('../../middlewares/validate');
const { authenticateSession } = require('../../middlewares/auth.middleware');

// Every signed-in role (firm admin, employee, client) has its own notifications.
const router = express.Router();
router.use(authenticateSession);

router.get('/', notificationController.list);
router.post('/read-all', notificationController.markAllRead);
router.patch('/:id/read', [param('id').isInt({ min: 1 }).toInt()], validate, notificationController.markRead);

module.exports = router;
