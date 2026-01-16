/**
 * WhatsApp Business API Service
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Upload media file to WhatsApp and send as audio message
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} audioFilePath - Local path to audio file
 * @returns {boolean} Success status
 */
const sendAudio = async (to, audioFilePath) => {
    const { apiVersion, baseUrl, phoneId, token, timeout } = config.whatsapp;

    try {
        // Step 1: Upload audio to WhatsApp Media API
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioFilePath));
        formData.append('type', 'audio/mpeg');
        formData.append('messaging_product', 'whatsapp');

        const uploadResponse = await axios.post(
            `${baseUrl}/${apiVersion}/${phoneId}/media`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...formData.getHeaders()
                },
                timeout
            }
        );

        const mediaId = uploadResponse.data.id;
        logger.info(`Media uploaded: ${mediaId}`);

        // Step 2: Send audio message
        const sendResponse = await axios.post(
            `${baseUrl}/${apiVersion}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'audio',
                audio: { id: mediaId }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout
            }
        );

        const messageId = sendResponse.data.messages?.[0]?.id;
        logger.success(`WhatsApp sent: ${messageId}`);

        return true;

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        logger.error(`WhatsApp failed: ${errorMsg}`);
        return false;
    }
};

/**
 * Send a text message via WhatsApp
 * @param {string} to - Recipient phone number
 * @param {string} message - Text message
 * @returns {boolean} Success status
 */
const sendText = async (to, message) => {
    const { apiVersion, baseUrl, phoneId, token, timeout } = config.whatsapp;

    try {
        const response = await axios.post(
            `${baseUrl}/${apiVersion}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout
            }
        );

        const messageId = response.data.messages?.[0]?.id;
        logger.success(`WhatsApp text sent: ${messageId}`);
        return true;

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        logger.error(`WhatsApp text failed: ${errorMsg}`);
        return false;
    }
};

module.exports = {
    sendAudio,
    sendText
};
