// src/modules/events/event.controller.js
const eventService = require('./event.service');

/**
 * GET /api/events
 * Expects query params: start (ISO), end (ISO)
 */
const getEvents = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const user = req.user; // injected by auth middleware
    const events = await eventService.getEvents({ start, end }, user);
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/events (admin only)
 */
const createEvent = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = req.user;
    const event = await eventService.createCustomEvent(payload, user);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, createEvent };
