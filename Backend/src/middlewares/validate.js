const { validationResult } = require('express-validator');

/**
 * Dual-mode validation middleware.
 *
 * Usage 1 — Direct middleware (placed after body() validators in array):
 *   router.post('/', [body('title').notEmpty(), validate], controller);
 *
 * Usage 2 — Factory function (wrapping validators):
 *   router.post('/', validate([body('title').notEmpty()]), controller);
 */
const validate = (reqOrValidations, res, next) => {
  // Factory mode: called with validations array (not an Express req object)
  if (Array.isArray(reqOrValidations) || (reqOrValidations && !res)) {
    const validations = Array.isArray(reqOrValidations) ? reqOrValidations : [reqOrValidations];
    return async (req, res2, next2) => {
      for (const validation of validations) {
        if (typeof validation.run === 'function') {
          await validation.run(req);
        }
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res2.status(400).json({
          success: false,
          status: 'fail',
          message: 'Validation failed',
          errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
        });
      }
      next2();
    };
  }

  // Direct middleware mode: called by Express with (req, res, next)
  const errors = validationResult(reqOrValidations);
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

module.exports = validate;

