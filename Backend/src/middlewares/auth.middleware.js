const prisma = require('../config/db');
const { UnauthorizedError } = require('../utils/errors');

// Tiny in-memory cache: token -> { user, cacheUntil, tokenExpiresAt }. 60s TTL.
const SESSION_TTL_MS = 60 * 1000;
const sessionCache = new Map();

/**
 * Looks up the person behind an access token: { id, email, role, firmId, ..., isClient }.
 * Served from a 60s in-memory cache (0 queries on a hit). Throws UnauthorizedError when the
 * session is missing or expired. Shared by the HTTP middleware and the realtime socket.
 */
const resolveSession = async (accessToken) => {
  const cached = sessionCache.get(accessToken);
  if (cached && cached.cacheUntil > Date.now() && cached.tokenExpiresAt > Date.now()) {
    return cached.user;
  }

  // Query only required fields — avoids pulling password hash and unneeded relations
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

  if (Date.now() > session.accessTokenExpiresAt.getTime()) {
    prisma.userSession.delete({ where: { id: session.id } }).catch(() => {});
    sessionCache.delete(accessToken);
    throw new UnauthorizedError('Session has expired. Please login again.');
  }

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

  sessionCache.set(accessToken, {
    user,
    cacheUntil: Date.now() + SESSION_TTL_MS,
    tokenExpiresAt: session.accessTokenExpiresAt.getTime(),
  });

  if (sessionCache.size > 10000) {
    sessionCache.clear(); // simple memory guard
  }

  return user;
};

/** Express middleware: verifies the Bearer access token and sets req.user. */
const authenticateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or invalid. Please login.');
    }
    req.user = await resolveSession(authHeader.slice(7));
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
    // Required here, not at the top: socket.js itself requires this file.
    require('../realtime/socket').disconnectToken(accessToken);
  } else {
    sessionCache.clear();
  }
};

module.exports = {
  authenticateSession,
  resolveSession,
  invalidateSessionCache,
};
