/**
 * Wapas.ai Configuration
 * Centralized configuration for all services
 */

module.exports = {
    // Server settings
    server: {
        port: process.env.PORT || 3000
    },

    // Shopify settings
    shopify: {
        secret: process.env.SHOPIFY_SECRET
    },

    // Sarvam TTS settings
    sarvam: {
        apiUrl: 'https://api.sarvam.ai/text-to-speech',
        apiKey: process.env.SARVAM_API_KEY,
        speaker: 'manisha',
        audioCodec: 'mp3',
        timeout: 30000
    },

    // WhatsApp API settings
    whatsapp: {
        apiVersion: 'v17.0',
        baseUrl: 'https://graph.facebook.com',
        phoneId: process.env.WHATSAPP_PHONE_ID,
        token: process.env.WHATSAPP_TOKEN,
        timeout: 30000
    },

    // Supabase (Database) settings
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        tableName: 'recoveries'
    },

    // Language mappings by Indian state
    languages: {
        defaultLanguage: 'en-IN',

        stateMapping: {
            // Telugu states
            'Telangana': 'te-IN',
            'Andhra Pradesh': 'te-IN',

            // Hindi belt
            'Uttar Pradesh': 'hi-IN',
            'Madhya Pradesh': 'hi-IN',
            'Bihar': 'hi-IN',
            'Rajasthan': 'hi-IN',
            'Jharkhand': 'hi-IN',
            'Chhattisgarh': 'hi-IN',
            'Uttarakhand': 'hi-IN',
            'Haryana': 'hi-IN',
            'Himachal Pradesh': 'hi-IN',
            'Delhi': 'hi-IN',

            // Tamil
            'Tamil Nadu': 'ta-IN',

            // Kannada
            'Karnataka': 'kn-IN',

            // Malayalam
            'Kerala': 'ml-IN',

            // Marathi
            'Maharashtra': 'mr-IN',

            // Gujarati
            'Gujarat': 'gu-IN',

            // Bengali
            'West Bengal': 'bn-IN',

            // Punjabi
            'Punjab': 'pa-IN',

            // Odia
            'Odisha': 'od-IN',

            // Assamese (Hindi fallback)
            'Assam': 'hi-IN',

            // North East (English fallback)
            'Arunachal Pradesh': 'en-IN',
            'Manipur': 'en-IN',
            'Meghalaya': 'en-IN',
            'Mizoram': 'en-IN',
            'Nagaland': 'en-IN',
            'Sikkim': 'en-IN',
            'Tripura': 'en-IN',

            // Union Territories
            'Goa': 'en-IN',
            'Jammu and Kashmir': 'hi-IN',
            'Ladakh': 'hi-IN',
            'Chandigarh': 'hi-IN',
            'Puducherry': 'ta-IN',
            'Andaman and Nicobar Islands': 'en-IN',
            'Dadra and Nagar Haveli and Daman and Diu': 'gu-IN',
            'Lakshadweep': 'ml-IN',
        }
    }
};
