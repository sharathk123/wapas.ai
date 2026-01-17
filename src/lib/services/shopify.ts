import crypto from 'crypto';

export const verifyShopifyWebhook = (req: Request, rawBody: string) => {
    try {
        const hmacHeader = req.headers.get('X-Shopify-Hmac-Sha256');
        const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

        if (!hmacHeader || !secret) {
            console.warn('Missing HMAC header or secret');
            return false;
        }

        const digest = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('base64');

        return crypto.timingSafeEqual(
            Buffer.from(digest),
            Buffer.from(hmacHeader)
        );
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('HMAC verification error', error.message);
        return false;
    }
};

export const extractCustomerData = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const phoneRaw = data.customer?.phone || data.shipping_address?.phone;

    if (!phoneRaw) {
        return null;
    }

    // Basic cleaning (remove spaces, dashes)
    const phone = phoneRaw.replace(/\s+/g, '').replace(/-/g, '');

    return {
        phone: phone,
        name: data.customer?.first_name || 'Customer',
        province: data.shipping_address?.province || '',
        checkoutId: data.id ? String(data.id) : null,
        checkoutUrl: data.abandoned_checkout_url,
        amount: data.total_price || 0,
        currency: data.currency || 'INR'
    };
};
