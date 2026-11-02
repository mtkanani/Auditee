// Which sites may call the API (HTTP and the realtime socket share this list).

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://auditee.vercel.app',
];

// Every Vercel deployment and preview of this project gets its own address, e.g.
// https://auditee-git-main-meet-kananis-projects.vercel.app or https://auditee-a1b2c3-meet-kananis-projects.vercel.app.
// Only the Vercel team "meet-kananis-projects" can create addresses with that suffix. Another team can be set
// with VERCEL_TEAM_SLUG.
const vercelTeam = (process.env.VERCEL_TEAM_SLUG || 'meet-kananis-projects').replace(/[^a-z0-9-]/gi, '');
const vercelProjectOrigin = new RegExp(`^https://auditee(-[a-z0-9-]+)?-${vercelTeam}\\.vercel\\.app$`);

// Origins compare without a trailing slash, so "https://app.example.com/" in FRONTEND_URL still matches.
const normalizeOrigin = (o) => o.trim().replace(/\/+$/, '');

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(normalizeOrigin).filter(Boolean);
  allowedOrigins.push(...envOrigins);
}

const isAllowedOrigin = (origin) => {
  const o = normalizeOrigin(origin);
  return allowedOrigins.includes(o) || vercelProjectOrigin.test(o);
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, postman, same-origin)
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, origin);
    // Unknown site: send no CORS headers, so the browser blocks it. Add the site to FRONTEND_URL to allow it.
    console.warn(`CORS: blocked request from origin ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

module.exports = { allowedOrigins, isAllowedOrigin, corsOptions };
