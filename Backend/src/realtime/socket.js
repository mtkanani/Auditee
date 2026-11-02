const { Server } = require('socket.io');
const { isAllowedOrigin } = require('../config/cors');
const { resolveSession } = require('../middlewares/auth.middleware');

/**
 * Realtime channel (socket.io) for live updates without refreshing.
 *
 * Rooms, joined on connect from the verified session:
 *   user:<id>     one staff member (firm admin or employee)
 *   client:<id>   one client portal login
 *   firm:<id>     everyone signed in to that firm (staff and clients)
 *
 * Events sent to the browser:
 *   data:changed      { modules: ['tasks', ...] }  something in the firm changed: refetch those lists
 *   notification:new  { ...notification }          a new notification for this person
 *
 * This runs in one Node process. Running several API instances would need the socket.io Redis
 * adapter so emits reach sockets on the other instances.
 */
let io = null;

const room = {
  user: (id) => `user:${id}`,
  client: (id) => `client:${id}`,
  firm: (id) => `firm:${id}`,
};

const initRealtime = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
      credentials: true,
    },
    // Phones and laptops that sleep drop the connection; this notices within ~45s and reconnects.
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // Same token and session check as the HTTP API.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('missing token');
      socket.data.user = await resolveSession(token);
      socket.data.token = token;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const u = socket.data.user;
    socket.join(u.isClient ? room.client(u.id) : room.user(u.id));
    if (u.firmId) socket.join(room.firm(u.firmId));
  });

  return io;
};

const emitToUsers = (userIds, event, payload) => {
  if (!io) return;
  for (const id of new Set(userIds)) if (id) io.to(room.user(id)).emit(event, payload);
};

const emitToClients = (clientIds, event, payload) => {
  if (!io) return;
  for (const id of new Set(clientIds)) if (id) io.to(room.client(id)).emit(event, payload);
};

const emitToFirm = (firmId, event, payload) => {
  if (io && firmId) io.to(room.firm(firmId)).emit(event, payload);
};

/** Signs out live sockets of a deleted session (logout, password change, account deletion). */
const disconnectToken = (token) => {
  if (!io || !token) return;
  for (const socket of io.sockets.sockets.values()) {
    if (socket.data.token === token) socket.disconnect(true);
  }
};

const closeRealtime = () => new Promise((resolve) => (io ? io.close(() => resolve()) : resolve()));

module.exports = { initRealtime, emitToUsers, emitToClients, emitToFirm, disconnectToken, closeRealtime };
