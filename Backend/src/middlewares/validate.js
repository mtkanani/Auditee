const { validationResult } = require('express-validator');

/**
 * Middleware to intercept validation results from express-validator.
 * Returns a 400 Bad Request response with a lists of issues.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};
