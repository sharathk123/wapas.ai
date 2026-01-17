import { NextResponse } from 'next/server';
import { verifyShopifyWebhook, extractCustomerData } from '@/lib/services/shopify';
import { generateScript, generateAudio } from '@/lib/services/sarvam';
import { sendAudio } from '@/lib/services/whatsapp';
import { createAdminClient } from '@/lib/supabase/admin';

export const POST = async (req: Request) => {
    try {
        const rawBody = await req.text();

        // 1. Verify webhook signature
        if (!verifyShopifyWebhook(req, rawBody)) {
            console.error('HMAC verification failed');
            return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('Webhook received and verified');
        const data = JSON.parse(rawBody);

        // 2. Extract customer data
        const customer = extractCustomerData(data);

        if (!customer || !customer.phone) {
            console.warn('No phone number in checkout data');
            return new NextResponse('No phone number', { status: 200 });
        }

        // Initialize Supabase Admin Client (Service Role) to bypass RLS
        const supabase = createAdminClient();

        // 2.1 Check for duplicates (DB Check)
        if (customer.checkoutId) {
            const { data: existing } = await supabase
                .from('recoveries')
                .select('id')
                .eq('shopify_checkout_id', customer.checkoutId)
                .eq('status', 'sent')
                .single();

            if (existing) {
                console.warn(`Skipping duplicate checkout: ${customer.checkoutId}`);
                return new NextResponse('Duplicate suppressed', { status: 200 });
            }
        }

        // 3. Detect language (Simple mapping based on state)
        // You might want to move this to a utility if it grows
        const stateLanguageMap: Record<string, string> = {
            'Andhra Pradesh': 'te-IN',
            'Telangana': 'te-IN',
            'Tamil Nadu': 'ta-IN',
            'Karnataka': 'kn-IN',
            'Kerala': 'ml-IN',
            'Maharashtra': 'mr-IN',
            'Gujarat': 'gu-IN',
            'West Bengal': 'bn-IN',
            'Punjab': 'pa-IN',
            'Odisha': 'od-IN',
        };
        const lang = stateLanguageMap[customer.province] || 'en-IN';

        console.log(`Processing: ${customer.name} | Phone: ${customer.phone} | Lang: ${lang}`);

        // 4. Generate voice script and audio
        const script = generateScript(customer.name, lang);
        const audioBuffer = await generateAudio(script, lang);

        if (!audioBuffer) {
            console.error('Failed to generate audio');
            // Log failure
            await supabase.from('recoveries').insert({
                shopify_checkout_id: customer.checkoutId,
                customer_phone: customer.phone,
                amount: customer.amount,
                currency: customer.currency,
                customer_name: customer.name,
                status: 'failed',
                error_message: 'Audio generation failed'
            });
            return new NextResponse('Audio generation failed', { status: 200 });
        }

        // 5. Send via WhatsApp
        const sent = await sendAudio(customer.phone, audioBuffer);

        // 6. Log result
        if (sent) {
            console.log(`Voice note delivered to ${customer.phone}`);
            await supabase.from('recoveries').insert({
                shopify_checkout_id: customer.checkoutId,
                customer_phone: customer.phone,
                amount: customer.amount,
                currency: customer.currency,
                customer_name: customer.name,
                status: 'sent',
                audio_url: 'sent_via_buffer'
            });
        } else {
            console.error(`Failed to send WhatsApp to ${customer.phone}`);
            await supabase.from('recoveries').insert({
                shopify_checkout_id: customer.checkoutId,
                customer_phone: customer.phone,
                amount: customer.amount,
                currency: customer.currency,
                customer_name: customer.name,
                status: 'failed',
                error_message: 'WhatsApp sending failed'
            });
        }

        return new NextResponse('Processed', { status: 200 });

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(`Server error: ${error.message}`);
        return new NextResponse('Internal error', { status: 500 });
    }
};
