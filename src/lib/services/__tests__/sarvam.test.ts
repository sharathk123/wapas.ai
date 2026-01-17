import { generateAudio, generateScript } from '../sarvam';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Sarvam Service', () => {
    beforeAll(() => {
        process.env.SARVAM_API_KEY = 'test_sarvam_key';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateScript', () => {
        it('should generate correct script for supported language', () => {
            const script = generateScript('John', 'hi-IN');
            expect(script).toContain('Namaste John');
        });

        it('should fallback to English for unsupported language', () => {
            const script = generateScript('John', 'unknown');
            expect(script).toContain('Hi John');
        });
    });

    describe('generateAudio', () => {
        it('should make correct API call and return Buffer from base64 response', async () => {
            const mockBase64 = Buffer.from('audio_content').toString('base64');
            const expectedBuffer = Buffer.from('audio_content');

            // Mock successful response with base64 audio
            mockedAxios.post.mockResolvedValueOnce({
                data: {
                    audios: [mockBase64]
                },
                status: 200
            });

            const result = await generateAudio('Hello world', 'hi-IN');

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('https://api.sarvam.ai/text-to-speech'),
                {
                    inputs: ['Hello world'],
                    target_language_code: 'hi-IN',
                    speaker: 'meera',
                    output_audio_codec: 'mp3'
                },
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'api-subscription-key': 'test_sarvam_key'
                    })
                })
            );
            expect(result).toEqual(expectedBuffer);
        });

        it('should return null on API failure', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

            const result = await generateAudio('fail', 'hi-IN');
            expect(result).toBeNull();
        });

        it('should return null if API returns no audio', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { audios: [] }, // Empty array
                status: 200
            });

            const result = await generateAudio('fail', 'hi-IN');
            expect(result).toBeNull();
        });
    });
});
