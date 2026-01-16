/**
 * Webhook Controller - Handles Shopify Abandoned Checkout Webhooks
 */

const crypto = require('crypto');
const config = require('../config');
const logger = require('../utils/logger');
const phone = require('../utils/phone');
const language = require('../utils/language');
const sarvamService = require('../services/sarvamService');
const whatsappService = require('../services/whatsappService');
const dbService = require('../services/dbService');

/**
 * Verify Shopify webhook signature using HMAC-SHA256
 */
const verifyShopifyWebhook = (req) => {
  try {
    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');

    if (!hmacHeader || !req.rawBody) {
      logger.warn('Missing HMAC header or raw body');
      return false;
    }

    const digest = crypto
      .createHmac('sha256', config.shopify.secret)
      .update(req.rawBody)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(hmacHeader)
    );
  } catch (error) {
    logger.error('HMAC verification error', error.message);
    return false;
  }
};

/**
 * Extract customer data from Shopify checkout payload
 */
const extractCustomerData = (data) => {
  const phoneRaw = data.customer?.phone || data.shipping_address?.phone;

  if (!phoneRaw) {
    return null;
  }

  return {
    phone: phone.clean(phoneRaw),
    name: data.customer?.first_name || 'Customer',
    province: data.shipping_address?.province || '',
    checkoutId: data.id ? String(data.id) : null,
    checkoutUrl: data.abandoned_checkout_url,
    amount: data.total_price || 0,
    currency: data.currency || 'INR'
  };
};

/**
 * Main webhook handler for abandoned checkout events
 */
exports.handleCheckoutUpdate = async (req, res) => {
  const startTime = Date.now();

  try {
    // 1. Verify webhook signature
    if (!verifyShopifyWebhook(req)) {
      logger.error('HMAC verification failed');
      return res.status(401).send('Unauthorized');
    }

    logger.info('Webhook received and verified');

    // 2. Extract customer data
    const customer = extractCustomerData(req.body);

    if (!customer || !customer.phone) {
      logger.warn('No phone number in checkout data');
      return res.status(200).send('No phone number');
    }

    // 2.1 Check for duplicates (DB Check)
    if (customer.checkoutId) {
      const isDuplicate = await dbService.isDuplicate(customer.checkoutId);
      if (isDuplicate) {
        logger.warn(`Skipping duplicate checkout: ${customer.checkoutId}`);
        return res.status(200).send('Duplicate suppressed');
      }
    }

    // 3. Detect language
    const lang = language.detectFromState(customer.province);

    logger.info(`Processing: ${customer.name} | Phone: ${customer.phone} | Lang: ${lang} | State: ${customer.province || 'N/A'}`);

    // 4. Generate voice script and audio
    const script = sarvamService.generateScript(customer.name, lang);
    const audioFilePath = await sarvamService.generateAudio(script, lang);

    if (!audioFilePath) {
      logger.error('Failed to generate audio');

      // Log failure to DB
      await dbService.logRecovery({
        ...customer,
        status: 'failed',
        error: 'Audio generation failed'
      });

      return res.status(200).send('Audio generation failed');
    }

    // 5. Send via WhatsApp
    const sent = await whatsappService.sendAudio(customer.phone, audioFilePath);

    // 6. Log result
    const duration = Date.now() - startTime;

    if (sent) {
      logger.success(`Voice note delivered to ${customer.phone} in ${duration}ms`);

      // Log success to DB
      await dbService.logRecovery({
        ...customer,
        status: 'sent',
        audioPath: require('path').basename(audioFilePath)
      });

    } else {
      logger.error(`Failed to send WhatsApp to ${customer.phone}`);

      // Log failure to DB
      await dbService.logRecovery({
        ...customer,
        status: 'failed',
        error: 'WhatsApp sending failed'
      });
    }

    res.status(200).send('Processed');

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Server error after ${duration}ms: ${error.message}`);
    res.status(500).send('Internal error');
  }
};