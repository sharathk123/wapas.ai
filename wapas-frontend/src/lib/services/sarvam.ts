import axios from 'axios';

// Voice scripts for different languages
const VOICE_SCRIPTS: Record<string, (name: string) => string> = {
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

const DEFAULT_LANGUAGE = 'en-IN';

export const generateScript = (name: string, language: string) => {
    const scriptFn = VOICE_SCRIPTS[language] || VOICE_SCRIPTS[DEFAULT_LANGUAGE];
    return scriptFn(name);
};

export const generateAudio = async (text: string, languageCode: string): Promise<Buffer | null> => {
    const apiUrl = process.env.SARVAM_API_URL || 'https://api.sarvam.ai/text-to-speech';
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
        console.error('SARVAM_API_KEY is missing');
        return null;
    }

    try {
        const response = await axios.post(apiUrl, {
            inputs: [text],
            target_language_code: languageCode,
            speaker: 'meera', // Default speaker
            output_audio_codec: 'mp3'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': apiKey
            },
            timeout: 10000
        });

        // Decode base64 audio to Buffer
        if (response.data && response.data.audios && response.data.audios[0]) {
            return Buffer.from(response.data.audios[0], 'base64');
        }

        return null;

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error(`Sarvam TTS failed: ${errorMsg}`);
        return null;
    }
};
