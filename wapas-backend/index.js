/**
 * Wapas.ai - Vernacular Voice Recovery SaaS
 * Main Server Entry Point
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const logger = require('./src/utils/logger');
const { webhookLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const { handleCheckoutUpdate } = require('./src/controllers/webhookController');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for API
}));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Middleware: Parse JSON with raw body preservation for Shopify HMAC verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Static: Serve audio files (for debugging/testing)
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main webhook endpoint for Shopify abandoned checkout
app.post('/webhooks/shopify/checkout-update',
  webhookLimiter,
  handleCheckoutUpdate
);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.success(`Wapas.ai server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Webhook URL: POST /webhooks/shopify/checkout-update`);
  logger.info(`Health check: GET /health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});