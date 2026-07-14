const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/user.routes');
const deleteAccountRoutes = require('./routes/deleteAccountRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { setupSwagger } = require('./utils/swagger');
const { NotFoundError } = require('./utils/errors');

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Swagger Documentation
setupSwagger(app);

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', deleteAccountRoutes);

// Catch-all route for unmatched paths (throws 404 error)
app.use((req, res, next) => {
  next(new NotFoundError(`API Route ${req.originalUrl} not found on this server.`));
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
