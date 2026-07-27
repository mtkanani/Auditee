const express = require('express');
const aiController = require('./ai.controller');

const router = express.Router();

/**
 * Route: POST /api/ai/copilot
 * Public/Authenticated endpoint for AI Copilot queries across 4 Sub-AI modes.
 */
router.post('/copilot', aiController.handleCopilot);

module.exports = router;
