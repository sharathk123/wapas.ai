/**
 * Rate Limiting Middleware
 * Prevents abuse and protects the API
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Webhook rate limiter - Shopify may send bursts
const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute per IP
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    }
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: { error: 'Too many requests from this IP' },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    webhookLimiter,
    apiLimiter
};
