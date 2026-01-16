/**
 * Sarvam AI Text-to-Speech Service
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

// Voice scripts for different languages
const VOICE_SCRIPTS = {
    'en-IN': (name) =>
        `Hi ${name}, your cart on Wapas dot A I is waiting for you. Please complete your order before items go out of stock.`,

    'te-IN': (name) =>
        `Namaskaram ${name}, mee cart Wapas dot A I lo wait chestundi. Dayachesi mee order complete cheyandi.`,

    'hi-IN': (name) =>
        `Namaste ${name}, aapka cart Wapas dot A I par wait kar raha hai. Kripaya apna order complete karein.`,

    'ta-IN': (name) =>
        `Vanakkam ${name}, ungal cart Wapas dot A I il kaathirukkipadhu. Thayavu seithu ungal order complete pannungal.`,

    'kn-IN': (name) =>
        `Namaskara ${name}, nimma cart Wapas dot A I nalli kaayuttide. Dayavittu nimma order complete maadi.`,

    'ml-IN': (name) =>
        `Namaskkaram ${name}, ningalude cart Wapas dot A I yil kaathirikkunnu. Dayavayi ningalude order complete cheyyuka.`,

    'mr-IN': (name) =>
        `Namaskar ${name}, tumcha cart Wapas dot A I var vaat pahat aahe. Krupaya tumcha order complete kara.`,

    'gu-IN': (name) =>
        `Namaskar ${name}, tamaru cart Wapas dot A I par rani joi che. Krupaya tamaru order complete karo.`,

    'bn-IN': (name) =>
        `Namaskar ${name}, apnar cart Wapas dot A I te opekha korche. Doya kore apnar order complete korun.`,

    'pa-IN': (name) =>
        `Sat Sri Akal ${name}, tuhadda cart Wapas dot A I te udeek kar reha hai. Kirpa karke apna order complete karo.`,

    'od-IN': (name) =>
        `Namaskar ${name}, apananka cart Wapas dot A I re apeksha karuachi. Dayakari apananka order sampurna karantu.`,
};

/**
 * Generate voice script based on customer name and language
 */
const generateScript = (name, language) => {
    const scriptFn = VOICE_SCRIPTS[language] || VOICE_SCRIPTS[config.languages.defaultLanguage];
    return scriptFn(name);
};

/**
 * Generate audio file using Sarvam TTS API
 * @returns {string|null} Local file path or null on error
 */
const generateAudio = async (text, languageCode) => {
    const { apiUrl, apiKey, speaker, audioCodec, timeout } = config.sarvam;

    try {
        const response = await axios.post(apiUrl, {
            inputs: [text],
            target_language_code: languageCode,
            speaker: speaker,
            output_audio_codec: audioCodec
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': apiKey
            },
            timeout
        });

        // Decode and save audio file
        const base64Audio = response.data.audios[0];
        const fileName = `voice_${Date.now()}.mp3`;
        const audioDir = path.join(__dirname, '../../public/audio');

        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        const filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Audio, 'base64'));

        logger.info(`Audio saved: ${fileName}`);
        return filePath;

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        logger.error(`Sarvam TTS failed: ${errorMsg}`);
        return null;
    }
};

module.exports = {
    generateScript,
    generateAudio
};
