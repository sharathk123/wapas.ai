import axios from 'axios';
import FormData from 'form-data';

export const sendAudio = async (to: string, audioBuffer: Buffer) => {
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const baseUrl = 'https://graph.facebook.com';

    if (!phoneId || !token) {
        console.error('WhatsApp credentials missing');
        return false;
    }

    try {
        // Step 1: Upload audio to WhatsApp Media API
        const formData = new FormData();
        formData.append('file', audioBuffer, { filename: 'voice_note.mp3', contentType: 'audio/mpeg' });
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
                timeout: 30000
            }
        );

        const mediaId = uploadResponse.data.id;


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
                timeout: 10000
            }
        );

        if (sendResponse.status !== 200) {
            throw new Error(`WhatsApp API Error: ${sendResponse.statusText}`);
        }

        return true;

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error(`WhatsApp failed: ${errorMsg}`);
        return false;
    }
};
