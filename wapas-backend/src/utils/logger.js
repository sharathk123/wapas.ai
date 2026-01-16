/**
 * Simple Logger Utility for Wapas.ai
 * Provides consistent logging format with timestamps
 */

const LOG_LEVELS = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

/**
 * Format timestamp for logs
 */
const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Core logging function
 */
const log = (level, message, data = null) => {
    const timestamp = getTimestamp();
    const prefix = `[${timestamp}] [${level}]`;

    if (data) {
        console.log(`${prefix} ${message}`, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    } else {
        console.log(`${prefix} ${message}`);
    }
};

const logger = {
    info: (message, data) => log(LOG_LEVELS.INFO, message, data),
    success: (message, data) => log(LOG_LEVELS.SUCCESS, message, data),
    warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
    error: (message, data) => log(LOG_LEVELS.ERROR, message, data),

    // Domain-specific loggers (same as info but can be extended later)
    webhook: (message, data) => log(LOG_LEVELS.INFO, message, data),
    audio: (message, data) => log(LOG_LEVELS.INFO, message, data),
    whatsapp: (message, data) => log(LOG_LEVELS.INFO, message, data),
};

module.exports = logger;
