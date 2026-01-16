/**
 * Tests for Phone Utilities
 */

const phone = require('../src/utils/phone');

describe('Phone Utilities', () => {

    describe('clean()', () => {
        test('should return null for empty input', () => {
            expect(phone.clean(null)).toBeNull();
            expect(phone.clean('')).toBeNull();
            expect(phone.clean(undefined)).toBeNull();
        });

        test('should clean 10-digit Indian number', () => {
            expect(phone.clean('8008544481')).toBe('918008544481');
        });

        test('should handle number with leading 0', () => {
            expect(phone.clean('08008544481')).toBe('918008544481');
        });

        test('should handle number with country code', () => {
            expect(phone.clean('918008544481')).toBe('918008544481');
        });

        test('should handle formatted phone numbers', () => {
            expect(phone.clean('+91 800 854 4481')).toBe('918008544481');
            expect(phone.clean('91-8008-544-481')).toBe('918008544481');
            expect(phone.clean('(+91) 8008544481')).toBe('918008544481');
        });

        test('should return null for invalid length', () => {
            expect(phone.clean('12345')).toBeNull();
            expect(phone.clean('123456789012345')).toBeNull();
        });
    });

    describe('isValid()', () => {
        test('should return true for valid Indian numbers', () => {
            expect(phone.isValid('918008544481')).toBe(true);
            expect(phone.isValid('8008544481')).toBe(true);
            expect(phone.isValid('+91 8008544481')).toBe(true);
        });

        test('should return false for invalid numbers', () => {
            expect(phone.isValid(null)).toBe(false);
            expect(phone.isValid('')).toBe(false);
            expect(phone.isValid('12345')).toBe(false);
        });
    });
});
