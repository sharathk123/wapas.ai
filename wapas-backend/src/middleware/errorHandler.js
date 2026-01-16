/**
 * Error Handler Middleware
 * Centralized error handling for production
 */

const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(`Unhandled error: ${err.message}`, {
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    // Don't expose internal errors in production
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(err.status || 500).json({
        error: {
            message: isProduction ? 'Internal server error' : err.message,
            ...(isProduction ? {} : { stack: err.stack })
        }
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: { message: 'Endpoint not found' }
    });
};

/**
 * Async wrapper to catch promise rejections
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
