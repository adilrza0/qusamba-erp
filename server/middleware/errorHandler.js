/**
 * Centralized error-handling middleware.
 *
 * Express recognises this as an error handler because it has 4 parameters.
 * All unhandled errors from route handlers end up here.
 */
const errorHandler = (err, _req, res, _next) => {
  // Default to 500 if no status code was set
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  // In production, hide internal details from clients
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`❌  [${statusCode}] ${err.message}`);
  if (!isProduction) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Include stack trace only in development for debugging
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
