const aiService = require('./ai.service');

class AIController {
  async handleCopilot(req, res, next) {
    try {
      const { mode = 'trainee', message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Message parameter is required.',
        });
      }

      const result = await aiService.getCopilotResponse({ mode, message, history });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
