const prisma = require('../config/db');
const { UnauthorizedError } = require('../utils/errors');

// Tiny in-memory cache: token -> { user, cacheUntil, tokenExpiresAt }. 60s TTL.
const SESSION_TTL_MS = 60 * 1000;
const sessionCache = new Map();

/**
 * High-performance middleware to verify session accessToken stored in PostgreSQL database.
 * Includes in-memory caching to eliminate redundant database hits across requests (0 queries on cache hit).
 * Queries only necessary projection fields and resolves administeredFirm in a single query.
 */
const authenticateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
    }
    const accessToken = authHeader.slice(7);

    // 1. Check in-memory session cache first
    const cached = sessionCache.get(accessToken);
    if (cached && cached.cacheUntil > Date.now() && cached.tokenExpiresAt > Date.now()) {
      req.user = cached.user;
      return next();
    }

    // 2. Query only required fields — avoids pulling password hash and unneeded relations
    const session = await prisma.userSession.findUnique({
      where: { accessToken },
      select: {
        id: true,
        accessTokenExpiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            firmId: true,
            firstName: true,
            lastName: true,
            administeredFirm: { select: { id: true } },
          },
        },
        client: {
          select: {
            id: true,
            email: true,
            firmId: true,
            clientName: true,
          },
        },
      },
    });

    if (!session) {
      sessionCache.delete(accessToken);
      throw new UnauthorizedError('Active session not found. Please login again.');
    }

    // 3. Check expiration
    if (Date.now() > session.accessTokenExpiresAt.getTime()) {
      prisma.userSession.delete({ where: { id: session.id } }).catch(() => {});
      sessionCache.delete(accessToken);
      throw new UnauthorizedError('Session has expired. Please login again.');
    }

    // 4. Resolve authenticated identity
    let user;
    if (session.user) {
      const u = session.user;
      user = {
        id: u.id,
        email: u.email,
        role: u.role,
        firmId: u.firmId ?? u.administeredFirm?.id ?? null,
        firstName: u.firstName,
        lastName: u.lastName,
        isClient: false,
      };
    } else if (session.client) {
      const c = session.client;
      user = {
        id: c.id,
        clientId: c.id,
        email: c.email,
        role: 'CLIENT',
        firmId: c.firmId,
        clientName: c.clientName,
        isClient: true,
      };
    } else {
      throw new UnauthorizedError('Invalid user session context.');
    }

    // 5. Store in cache
    sessionCache.set(accessToken, {
      user,
      cacheUntil: Date.now() + SESSION_TTL_MS,
      tokenExpiresAt: session.accessTokenExpiresAt.getTime(),
    });

    if (sessionCache.size > 10000) {
      sessionCache.clear(); // simple memory guard
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Invalidate session cache on logout, password changes, or account deletions.
 */
const invalidateSessionCache = (accessToken) => {
  if (accessToken) {
    sessionCache.delete(accessToken);
  } else {
    sessionCache.clear();
  }
};

module.exports = {
  authenticateSession,
  invalidateSessionCache,
};
