const { AppError } = require('../utils/errors');

/**
 * Send verbose error payload in development.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Send sanitised error payload in production.
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak database/system details
  console.error('💥 ERROR:', err);
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong on our end. Please try again later.',
  });
};

/**
 * Express centralized error handler middleware.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Prisma Database connection errors or validation errors if any
  if (err.code && err.code.startsWith('P')) {
    // If it's a Prisma error, convert to user-friendly format or mark as bad request/db failure
    console.error('Prisma Error code:', err.code, err.message);
    err = new AppError('Database operation failed.', 500);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
