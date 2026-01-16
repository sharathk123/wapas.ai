/**
 * Language Detection Utilities
 */

const config = require('../config');

/**
 * Detect appropriate language based on Indian state/province
 * @param {string} province - State name from shipping address
 * @returns {string} Sarvam language code
 */
const detectFromState = (province) => {
    if (!province) return config.languages.defaultLanguage;

    return config.languages.stateMapping[province] || config.languages.defaultLanguage;
};

/**
 * Get all supported languages
 * @returns {string[]} Array of language codes
 */
const getSupportedLanguages = () => {
    return [...new Set(Object.values(config.languages.stateMapping))];
};

/**
 * Check if a language is supported
 * @param {string} langCode - Language code to check
 * @returns {boolean} True if supported
 */
const isSupported = (langCode) => {
    const supported = getSupportedLanguages();
    return supported.includes(langCode);
};

module.exports = {
    detectFromState,
    getSupportedLanguages,
    isSupported
};
