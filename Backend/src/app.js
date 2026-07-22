const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const oldUserRoutes = require('./routes/user.routes');
const deleteAccountRoutes = require('./routes/deleteAccountRoutes');
const firmRoutes = require('./routes/firmRoutes');

// Import modular domain routes
const firmAdminUserRoutes = require('./modules/users/user.routes');
const firmAdminClientRoutes = require('./modules/clients/client.routes');
const assignmentRoutes = require('./modules/clientAssignments/assignment.routes');
const publicUserRoutes = require('./modules/publicUser/publicUser.routes');
const publicClientRoutes = require('./modules/publicClient/publicClient.routes');
const { adminRouter: announcementAdminRoutes, userRouter: announcementUserRoutes } = require('./modules/announcements/announcement.routes');
const taskRoutes = require('./modules/tasks/task.routes');

const errorHandler = require('./middlewares/errorHandler');
const { setupSwagger } = require('./utils/swagger');
const { NotFoundError } = require('./utils/errors');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:8080',
  'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, postman, same-origin)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Swagger Documentation
setupSwagger(app);

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api', oldUserRoutes);
app.use('/api', deleteAccountRoutes);
app.use('/api/admin/firms', firmRoutes);

// Modular Auditee SaaS routes
app.use('/api/firm-admin/users', firmAdminUserRoutes);
app.use('/api/firm-admin/clients', firmAdminClientRoutes);
app.use('/api/firm-admin/announcements', announcementAdminRoutes);
app.use('/api/user/announcements', announcementUserRoutes);
app.use('/api/firm-admin', assignmentRoutes);
app.use('/api/firm-admin/tasks', taskRoutes);
app.use('/api/user/tasks', taskRoutes);
app.use('/api/client/tasks', taskRoutes);
app.use('/api/user', publicUserRoutes);
app.use('/api/client', publicClientRoutes);

// Root route status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auditee API is running successfully!',
    timestamp: new Date(),
  });
});

// Catch-all route for unmatched paths (throws 404 error)
app.use((req, res, next) => {
  next(new NotFoundError(`API Route ${req.originalUrl} not found on this server.`));
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
