import { sendAudio } from '../whatsapp';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock FormData
jest.mock('form-data', () => {
    return jest.fn().mockImplementation(() => ({
        append: jest.fn(),
        getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data; boundary=test' })
    }));
});

describe('WhatsApp Service', () => {
    beforeAll(() => {
        process.env.WHATSAPP_PHONE_ID = 'test_phone_id';
        process.env.WHATSAPP_TOKEN = 'test_token';
        process.env.WHATSAPP_API_VERSION = 'v18.0'; // Default in code
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendAudio', () => {
        const mockAudioBuffer = Buffer.from('audio');

        it('should successfully upload media and send message', async () => {
            // Mock Media Upload Response
            mockedAxios.post.mockResolvedValueOnce({
                data: { id: 'media_id_123' },
                status: 200
            });

            // Mock Message Send Response
            mockedAxios.post.mockResolvedValueOnce({
                data: { messages: [{ id: 'msg_id_123' }] },
                status: 200
            });

            const result = await sendAudio('+919876543210', mockAudioBuffer);

            // Check Media Upload Call
            expect(mockedAxios.post).toHaveBeenNthCalledWith(1,
                'https://graph.facebook.com/v18.0/test_phone_id/media',
                expect.any(Object), // FormData
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test_token',
                        'content-type': expect.stringContaining('multipart/form-data')
                    })
                })
            );

            // Check Message Send Call
            expect(mockedAxios.post).toHaveBeenNthCalledWith(2,
                'https://graph.facebook.com/v18.0/test_phone_id/messages',
                {
                    messaging_product: 'whatsapp',
                    to: '+919876543210',
                    type: 'audio',
                    audio: {
                        id: 'media_id_123'
                    }
                },
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test_token',
                        'Content-Type': 'application/json'
                    })
                })
            );

            expect(result).toBe(true);
        });

        it('should fail if media upload fails', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('Upload Failed'));

            const result = await sendAudio('+919876543210', mockAudioBuffer);

            expect(result).toBe(false);
            // Should verify that error was logged, but we are just checking return value
        });

        it('should fail if message sending fails', async () => {
            // Upload succeeds
            mockedAxios.post.mockResolvedValueOnce({
                data: { id: 'media_id_123' },
                status: 200
            });
            // Send fails
            mockedAxios.post.mockRejectedValueOnce(new Error('Send Failed'));

            const result = await sendAudio('+919876543210', mockAudioBuffer);

            expect(result).toBe(false);
        });
    });
});
