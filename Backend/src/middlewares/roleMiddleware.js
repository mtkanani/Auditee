const { ForbiddenError, UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to restrict access to specific roles.
 * @param {string[]} allowedRoles Array of roles that are allowed access.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
      }

      const userRole = req.user.role; // e.g. "SUPER_ADMIN", "FIRM_ADMIN", etc.
      if (!allowedRoles.includes(userRole)) {
        throw new ForbiddenError('Access denied. You do not have the required permissions.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRoles;
