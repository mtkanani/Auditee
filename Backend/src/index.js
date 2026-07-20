require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Launch Express application server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on ${HOST}:${PORT}`);
});

// Graceful exit for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception! Shutting down...', err);
  server.close(() => {
    prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
});

// Graceful exit for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
});

// Handle system termination signals (e.g. Docker, Heroku, Systemd)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    prisma.$disconnect().then(() => {
      console.log('Database client disconnected. Process terminated.');
    });
  });
});
