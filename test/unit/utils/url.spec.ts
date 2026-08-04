import { describe, expect, it } from 'vitest';
import { cleanDoubleSlashes } from '../../../src/utils';

describe('src/utils/url.ts', () => {
    it('should collapse repeated slashes', () => {
        expect(cleanDoubleSlashes('ghcr.io//tada5hi//some-repo')).toBe('ghcr.io/tada5hi/some-repo');
    });

    it('should keep the protocol separator intact', () => {
        expect(cleanDoubleSlashes('https://ghcr.io//tada5hi')).toBe('https://ghcr.io/tada5hi');
    });

    it('should leave a clean input untouched', () => {
        expect(cleanDoubleSlashes('ghcr.io/tada5hi/some-repo')).toBe('ghcr.io/tada5hi/some-repo');
    });
});
