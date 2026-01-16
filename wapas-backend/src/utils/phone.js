/**
 * Phone Number Utilities
 */

const logger = require('./logger');

/**
 * Clean and format phone number to Indian format (91XXXXXXXXXX)
 * @param {string} phone - Raw phone number
 * @returns {string|null} Cleaned phone number or null
 */
const clean = (phone) => {
    if (!phone) return null;

    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Remove leading 0 if present
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    // Add country code if 10 digits
    if (cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }

    // Validate final length
    if (cleaned.length !== 12) {
        logger.warn(`Invalid phone number length: ${cleaned}`);
        return null;
    }

    return cleaned;
};

/**
 * Validate if phone number is a valid Indian mobile number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
const isValid = (phone) => {
    if (!phone) return false;
    const cleaned = clean(phone);
    return cleaned !== null && cleaned.startsWith('91') && cleaned.length === 12;
};

module.exports = {
    clean,
    isValid
};
