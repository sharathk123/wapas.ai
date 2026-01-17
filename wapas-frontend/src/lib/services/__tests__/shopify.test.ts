import { verifyShopifyWebhook, extractCustomerData } from '../shopify';
import crypto from 'crypto';

describe('Shopify Service', () => {
    const secret = 'test_secret';

    beforeAll(() => {
        process.env.SHOPIFY_WEBHOOK_SECRET = secret;
    });

    describe('verifyShopifyWebhook', () => {
        it('should return true for valid hmac', async () => {
            const rawBody = '{"test": "data"}';
            const signature = crypto
                .createHmac('sha256', secret)
                .update(rawBody)
                .digest('base64');

            // Mock the Request object
            const req = {
                headers: {
                    get: (name: string) => name === 'X-Shopify-Hmac-Sha256' ? signature : null
                }
            } as unknown as Request;

            const isValid = await verifyShopifyWebhook(req, rawBody);
            expect(isValid).toBe(true);
        });

        it('should return false for invalid hmac', async () => {
            const rawBody = '{"test": "data"}';
            const signature = 'invalid_signature';

            const req = {
                headers: {
                    get: (name: string) => name === 'X-Shopify-Hmac-Sha256' ? signature : null
                }
            } as unknown as Request;

            const isValid = await verifyShopifyWebhook(req, rawBody);
            expect(isValid).toBe(false);
        });

        it('should return false if secret is missing', async () => {
            const OLD_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
            delete process.env.SHOPIFY_WEBHOOK_SECRET;

            const req = {
                headers: {
                    get: () => 'some_sig'
                }
            } as unknown as Request;

            const isValid = await verifyShopifyWebhook(req, 'data');
            expect(isValid).toBe(false);
            process.env.SHOPIFY_WEBHOOK_SECRET = OLD_SECRET;
        });
    });

    describe('extractCustomerData', () => {
        it('should return null if phone is missing', () => {
            const payload = {
                id: 12345,
                email: 'test@example.com',
                customer: { first_name: 'John' },
                total_price: '100.00'
            };
            // No phone in customer or shipping_address
            expect(extractCustomerData(payload)).toBeNull();
        });

        it('should extract correct data with phone from customer', () => {
            const payload = {
                id: 12345,
                email: 'test@example.com',
                customer: {
                    first_name: 'John',
                    phone: '+91 98765 43210'
                },
                currency: 'INR',
                total_price: '100.00',
                abandoned_checkout_url: 'https://checkout.url'
            };

            const result = extractCustomerData(payload);

            expect(result).not.toBeNull();
            expect(result?.phone).toBe('+919876543210');
            expect(result?.name).toBe('John');
            expect(result?.checkoutId).toBe('12345');
            expect(result?.amount).toBe('100.00');
        });

        it('should fallback defaults when fields missing', () => {
            const payload = {
                id: 12345,
                shipping_address: {
                    phone: '1234567890',
                    province: 'Karnataka'
                }
            };

            const result = extractCustomerData(payload);
            expect(result?.phone).toBe('1234567890');
            expect(result?.name).toBe('Customer'); // Default
            expect(result?.currency).toBe('INR'); // Default
            expect(result?.province).toBe('Karnataka');
        });
    });
});
