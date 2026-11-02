const { emitToFirm } = require('./socket');

/**
 * After every successful POST / PUT / PATCH / DELETE, tells everyone in the firm which kinds of data
 * changed, so their open screens refetch them at once. Only module names are sent, never the data,
 * so nobody receives anything they couldn't already load.
 *
 * Changes are gathered per firm for a moment and sent as one event, so a burst of writes (e.g.
 * assigning a task to 20 people) causes one refresh instead of twenty.
 */
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SKIP = /^\/api\/(auth|ai|notifications)\b|^\/api\/(send-otp|verify-otp|forgot|reset|login|register)/;

// First matching pattern wins for each module; a path can touch several modules.
const MODULE_PATTERNS = [
  ['tasks', /\/(tasks|work-requests|time-entr)/],
  ['compliance', /\/compliance\b/],
  ['leads', /\/leads\b/],
  ['invoices', /\/(invoices|payments|bank-details)\b/],
  ['announcements', /\/announcements\b/],
  ['attendance', /\/(attendance|geofence)\b/],
  ['leave', /\/leave\b/],
  ['documents', /\/(documents|document-vault|document-requests)\b/],
  ['meetings', /\/meetings\b/],
  ['assignments', /\/client-assignments\b/],
  ['clients', /\/(clients|client-assignments)\b/],
  ['users', /\/(users|profile)\b/],
  ['firms', /\/admin\/firms\b/],
];

const modulesFor = (path) => {
  const found = MODULE_PATTERNS.filter(([, re]) => re.test(path)).map(([name]) => name);
  // Numbers on every home page and report can move with any change.
  return [...found, 'dashboard', 'reports'];
};

const FLUSH_MS = 120;
const pending = new Map(); // firmId -> Set(modules)

const queueChange = (firmId, modules) => {
  let set = pending.get(firmId);
  if (!set) {
    set = new Set();
    pending.set(firmId, set);
    setTimeout(() => {
      pending.delete(firmId);
      emitToFirm(firmId, 'data:changed', { modules: [...set] });
    }, FLUSH_MS);
  }
  modules.forEach((m) => set.add(m));
};

const broadcastChanges = (req, res, next) => {
  if (!WRITE_METHODS.has(req.method)) return next();
  res.on('finish', () => {
    const path = req.originalUrl.split('?')[0];
    // req.user is set by the route's authenticateSession, which ran before the response finished.
    const firmId = req.user?.firmId;
    if (!firmId || res.statusCode >= 400 || SKIP.test(path)) return;
    queueChange(firmId, modulesFor(path));
  });
  next();
};

module.exports = { broadcastChanges, modulesFor, queueChange };
