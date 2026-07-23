// src/modules/events/event.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const validate = require('../../middlewares/validate');
const { getEventsValidation, createEventValidation } = require('./event.validation');

// GET /api/events?start=ISO&end=ISO
router.get('/', validate(getEventsValidation), eventController.getEvents);

// POST /api/events (admin only)
router.post('/', validate(createEventValidation), eventController.createEvent);

module.exports = router;
