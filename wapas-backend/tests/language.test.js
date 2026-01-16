/**
 * Tests for Language Detection Utilities
 */

const language = require('../src/utils/language');

describe('Language Detection', () => {

    describe('detectFromState()', () => {
        test('should return Telugu for Telangana', () => {
            expect(language.detectFromState('Telangana')).toBe('te-IN');
        });

        test('should return Telugu for Andhra Pradesh', () => {
            expect(language.detectFromState('Andhra Pradesh')).toBe('te-IN');
        });

        test('should return Hindi for Hindi belt states', () => {
            expect(language.detectFromState('Uttar Pradesh')).toBe('hi-IN');
            expect(language.detectFromState('Bihar')).toBe('hi-IN');
            expect(language.detectFromState('Delhi')).toBe('hi-IN');
            expect(language.detectFromState('Rajasthan')).toBe('hi-IN');
        });

        test('should return Tamil for Tamil Nadu', () => {
            expect(language.detectFromState('Tamil Nadu')).toBe('ta-IN');
        });

        test('should return Kannada for Karnataka', () => {
            expect(language.detectFromState('Karnataka')).toBe('kn-IN');
        });

        test('should return Malayalam for Kerala', () => {
            expect(language.detectFromState('Kerala')).toBe('ml-IN');
        });

        test('should return Marathi for Maharashtra', () => {
            expect(language.detectFromState('Maharashtra')).toBe('mr-IN');
        });

        test('should return default English for unknown states', () => {
            expect(language.detectFromState('Unknown State')).toBe('en-IN');
        });

        test('should return default English for null/empty', () => {
            expect(language.detectFromState(null)).toBe('en-IN');
            expect(language.detectFromState('')).toBe('en-IN');
            expect(language.detectFromState(undefined)).toBe('en-IN');
        });
    });

    describe('getSupportedLanguages()', () => {
        test('should return array of language codes', () => {
            const languages = language.getSupportedLanguages();
            expect(Array.isArray(languages)).toBe(true);
            expect(languages).toContain('hi-IN');
            expect(languages).toContain('te-IN');
            expect(languages).toContain('en-IN');
        });
    });

    describe('isSupported()', () => {
        test('should return true for supported languages', () => {
            expect(language.isSupported('hi-IN')).toBe(true);
            expect(language.isSupported('te-IN')).toBe(true);
            expect(language.isSupported('en-IN')).toBe(true);
        });

        test('should return false for unsupported languages', () => {
            expect(language.isSupported('fr-FR')).toBe(false);
            expect(language.isSupported('de-DE')).toBe(false);
        });
    });
});
