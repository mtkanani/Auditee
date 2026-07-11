const prisma = require('../config/db');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to verify session accessToken stored in PostgreSQL database.
 * Verifies presence, matches entry in DB, validates expiration, and attaches authenticated user.
 */
const authenticateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
    }

    const accessToken = authHeader.split(' ')[1];

    // 1. Fetch session from PostgreSQL including user relations
    const session = await prisma.userSession.findUnique({
      where: { accessToken },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedError('Active session not found. Please login again.');
    }

    // 2. Validate token expiration
    if (new Date() > new Date(session.accessTokenExpiresAt)) {
      // Clean up expired session
      await prisma.userSession.delete({
        where: { id: session.id },
      }).catch(() => {}); // ignore cleanup failures

      throw new UnauthorizedError('Session has expired. Please login again.');
    }

    // 3. Attach authenticated user details to request object
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateSession,
};
