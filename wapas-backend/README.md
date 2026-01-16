# Wapas.ai - Vernacular Voice Recovery SaaS

Recover abandoned carts in India using personalized AI voice notes via WhatsApp.

## Features

- 🛒 Shopify webhook integration for abandoned checkouts
- 🎤 Sarvam AI text-to-speech (11 Indian languages)
- 📱 WhatsApp Business API integration
- 🌐 State-wise language detection

## Supported Languages

| Language | States |
|----------|--------|
| English | Default, NE States, Goa |
| Telugu | Telangana, Andhra Pradesh |
| Hindi | UP, MP, Bihar, Delhi, etc. |
| Tamil | Tamil Nadu |
| Kannada | Karnataka |
| Malayalam | Kerala |
| Marathi | Maharashtra |
| Gujarati | Gujarat |
| Bengali | West Bengal |
| Punjabi | Punjab |
| Odia | Odisha |

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   SHOPIFY_SECRET=your_shopify_webhook_secret
   WHATSAPP_TOKEN=your_whatsapp_access_token
   WHATSAPP_PHONE_ID=your_whatsapp_phone_id
   SARVAM_API_KEY=your_sarvam_api_key
   PORT=3000
   ```
4. Run: `node index.js`

## Production

**Live URL:** `https://wapas-backend-live.onrender.com`

## API Endpoints

- `POST /webhooks/shopify/checkout-update` - Shopify webhook
- `GET /health` - Health check

## Tech Stack

- Node.js + Express
- Sarvam AI (TTS)
- WhatsApp Business API
- Shopify Webhooks
