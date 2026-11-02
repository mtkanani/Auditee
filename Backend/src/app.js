const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { corsOptions } = require('./config/cors');
const { broadcastChanges } = require('./realtime/changeFeed');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./modules/events/event.routes');
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
const complianceRoutes = require('./modules/compliance/compliance.routes');
const leadRoutes = require('./modules/leads/lead.routes');
const invoiceRoutes = require('./modules/invoices/invoice.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const leaveRoutes = require('./modules/leave/leave.routes');
const documentRoutes = require('./modules/documents/document.routes');
const aiRoutes = require('./modules/ai/ai.routes');
const meetingRoutes = require('./modules/meetings/meeting.routes');
const reportRoutes = require('./modules/reports/report.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const documentRequestRoutes = require('./modules/documentRequests/documentRequest.routes');

const errorHandler = require('./middlewares/errorHandler');
const { setupSwagger } = require('./utils/swagger');
const { NotFoundError } = require('./utils/errors');

const app = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// After any successful change, tell everyone in the firm (over the socket) which data to refresh.
app.use(broadcastChanges);

// Initialize Swagger Documentation
setupSwagger(app);

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api', oldUserRoutes);
app.use('/api', deleteAccountRoutes);
app.use('/api/admin/firms', firmRoutes);

// Modular Auditee SaaS routes
app.use('/api/events', eventRoutes);
app.use('/api/firm-admin/invoices', invoiceRoutes);
app.use('/api/client/invoices', invoiceRoutes);
app.use('/api/firm-admin/users', firmAdminUserRoutes);
app.use('/api/firm-admin/clients', firmAdminClientRoutes);
app.use('/api/firm-admin/announcements', announcementAdminRoutes);
app.use('/api/user/announcements', announcementUserRoutes);
app.use('/api/client/announcements', announcementUserRoutes);
app.use('/api/firm-admin/tasks', taskRoutes);
app.use('/api/firm-admin/compliance', complianceRoutes);
app.use('/api/user/compliance', complianceRoutes);
app.use('/api/firm-admin/leads', leadRoutes);
app.use('/api/firm-admin', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/document-requests', documentRequestRoutes);
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
