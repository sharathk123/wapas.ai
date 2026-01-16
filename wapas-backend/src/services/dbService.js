/**
 * Database Service
 * Handles interactions with Supabase (PostgreSQL)
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const logger = require('../utils/logger');

// Initialize Supabase client
// Note: We use the SERVICE_ROLE_KEY if available for backend ops to bypass RLS, 
// otherwise standard ANON key.
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;

// Create client only if creds are present
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Log a recovery attempt
 * @param {Object} data Recovery data
 */
const logRecovery = async (data) => {
    if (!supabase) {
        logger.warn('Supabase not configured, skipping DB log');
        return null;
    }

    try {
        const { error } = await supabase
            .from('recoveries')
            .insert([
                {
                    shopify_checkout_id: data.checkoutId,
                    customer_phone: data.phone,
                    amount: data.amount,
                    currency: data.currency,
                    customer_name: data.name,
                    status: data.status, // 'sent', 'failed'
                    audio_url: data.audioPath, // e.g., 'audio_123.mp3'
                    error_message: data.error || null,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        logger.info(`Recorded recovery in DB for ${data.checkoutId}`);
    } catch (err) {
        logger.error(`Failed to log to DB: ${err.message}`);
    }
};

/**
 * Check if we've already sent a message to this checkout recently
 * @param {string} checkoutId The Shopify Checkout ID
 * @returns {boolean} True if duplicate found
 */
const isDuplicate = async (checkoutId) => {
    if (!supabase) return false;

    try {
        // Check for any successful attempt in the last 24 hours
        // or just by ID if you want strict 1-per-checkout
        const { data, error } = await supabase
            .from('recoveries')
            .select('id')
            .eq('shopify_checkout_id', checkoutId)
            .eq('status', 'sent')
            .limit(1);

        if (error) throw error;

        return data.length > 0;
    } catch (err) {
        logger.error(`DB Duplicate check failed: ${err.message}`);
        return false; // Fail open (send message) if DB is down
    }
};

module.exports = {
    logRecovery,
    isDuplicate,
    supabase
};
