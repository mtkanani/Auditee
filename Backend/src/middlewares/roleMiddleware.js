const { ForbiddenError, UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to restrict access to specific roles.
 * Case-insensitive role check with expanded role alias support.
 * @param {string[]} allowedRoles Array of roles that are allowed access.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
      }

      const rawRole = req.user.role || '';
      const userRoleUpper = rawRole.toUpperCase();

      console.log('🔒 RBAC Check:', {
        userId: req.user.id,
        email: req.user.email,
        userRole: rawRole,
        allowedRoles,
      });

      // Expand allowed roles (case-insensitive & handle common aliases)
      const expandedAllowedRoles = allowedRoles.flatMap((r) => {
        const upper = String(r).toUpperCase();
        if (upper === 'ADMIN' || upper === 'FIRM_ADMIN') return ['ADMIN', 'FIRM_ADMIN'];
        if (upper === 'USER' || upper === 'EMPLOYEE') return ['USER', 'EMPLOYEE'];
        return [upper];
      });

      if (!expandedAllowedRoles.includes(userRoleUpper)) {
        console.warn(`⛔ Access Denied for User ID ${req.user.id} (${req.user.email}) - Role: '${rawRole}', Required: [${allowedRoles.join(', ')}]`);
        throw new ForbiddenError(
          `Access denied. Your role '${rawRole}' does not have the required permissions (${allowedRoles.join(', ')}).`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRoles;
