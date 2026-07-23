const { validationResult } = require('express-validator');

/**
 * Validation middleware factory.
 * Accepts an array (or a single) of express‑validator middlewares and
 * runs them. If validation errors are present, a 400 response is sent.
 *
 * Example usage:
 *   router.post('/', validate([body('title').notEmpty()]), controller);
 */
module.exports = (validations) => {
  // Ensure we always work with an array for simplicity
  const validationArray = Array.isArray(validations) ? validations : [validations];
  return async (req, res, next) => {
    // Run each validator; they attach errors to the request
    for (const validation of validationArray) {
      if (typeof validation.run === 'function') {
        await validation.run(req);
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
      });
    }
    next();
  };
};
