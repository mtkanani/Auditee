const prisma = require('../config/db');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to verify session accessToken stored in PostgreSQL database.
 * Verifies presence, matches entry in DB, validates expiration, and attaches authenticated user/client.
 */
const authenticateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
    }

    const accessToken = authHeader.split(' ')[1];

    // 1. Fetch session from PostgreSQL including user and client relations
    const session = await prisma.userSession.findUnique({
      where: { accessToken },
      include: {
        user: true,
        client: true,
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

    // 3. Attach authenticated user or client details to request object
    if (session.user) {
      // For Firm Admin, Super Admin, or Employee (User)
      let firmId = session.user.firmId;
      
      // If user is FIRM_ADMIN but firmId is not set directly on user, fetch administeredFirm
      if (!firmId && session.user.role === 'FIRM_ADMIN') {
        const adminFirm = await prisma.firm.findUnique({
          where: { firmAdminId: session.user.id },
          select: { id: true },
        });
        if (adminFirm) {
          firmId = adminFirm.id;
        }
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        firmId: firmId,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        isClient: false,
      };
    } else if (session.client) {
      // For Client user login
      req.user = {
        id: session.client.id,
        clientId: session.client.id,
        email: session.client.email,
        role: 'CLIENT',
        firmId: session.client.firmId,
        clientName: session.client.clientName,
        isClient: true,
      };
    } else {
      throw new UnauthorizedError('Invalid user session context.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateSession,
};
