/**
 * Tests for Sarvam Service
 */

const sarvamService = require('../src/services/sarvamService');

describe('Sarvam Service', () => {

    describe('generateScript()', () => {
        test('should generate English script', () => {
            const script = sarvamService.generateScript('Sharath', 'en-IN');
            expect(script).toContain('Hi Sharath');
            expect(script).toContain('Wapas');
        });

        test('should generate Hindi script', () => {
            const script = sarvamService.generateScript('Sharath', 'hi-IN');
            expect(script).toContain('Namaste Sharath');
            expect(script).toContain('Wapas');
        });

        test('should generate Telugu script', () => {
            const script = sarvamService.generateScript('Sharath', 'te-IN');
            expect(script).toContain('Namaskaram Sharath');
            expect(script).toContain('Wapas');
        });

        test('should generate Tamil script', () => {
            const script = sarvamService.generateScript('Sharath', 'ta-IN');
            expect(script).toContain('Vanakkam Sharath');
        });

        test('should default to English for unknown language', () => {
            const script = sarvamService.generateScript('Sharath', 'unknown');
            expect(script).toContain('Hi Sharath');
        });

        test('should handle Customer as default name', () => {
            const script = sarvamService.generateScript('Customer', 'en-IN');
            expect(script).toContain('Hi Customer');
        });
    });

    // Note: generateAudio() tests would require mocking axios
    // and are typically done as integration tests
});
