import { describe, expect, it } from 'vitest';
import { toBoolean } from '../../../src/utils';

describe('src/utils/boolean.ts', () => {
    it('should pass through booleans', () => {
        expect(toBoolean(true)).toBe(true);
        expect(toBoolean(false)).toBe(false);
    });

    it('should parse truthy strings', () => {
        expect(toBoolean('true')).toBe(true);
        expect(toBoolean('TRUE')).toBe(true);
        expect(toBoolean('t')).toBe(true);
    });

    it('should parse falsy strings', () => {
        expect(toBoolean('false')).toBe(false);
        expect(toBoolean('False')).toBe(false);
        expect(toBoolean('f')).toBe(false);
    });

    it('should return undefined for unknown input', () => {
        expect(toBoolean('yes')).toBeUndefined();
        expect(toBoolean('')).toBeUndefined();
        expect(toBoolean(1)).toBeUndefined();
        expect(toBoolean(undefined)).toBeUndefined();
        expect(toBoolean(null)).toBeUndefined();
    });
});
