import { describe, expect, it } from 'vitest';
import { trimRefName } from '../../../src/utils';

describe('src/utils/ref-name.ts', () => {
    it('should strip the v sign of a semver tag', () => {
        expect(trimRefName('v1.2.3')).toBe('1.2.3');
    });

    it('should keep a semver tag without a v sign', () => {
        expect(trimRefName('1.2.3')).toBe('1.2.3');
    });

    it('should keep a non semver name starting with v', () => {
        expect(trimRefName('vNext')).toBe('vNext');
    });

    it('should strip a monorepo prefix', () => {
        expect(trimRefName('some-package@1.2.3', 'some-package')).toBe('1.2.3');
    });

    it('should strip a monorepo prefix with a v sign', () => {
        expect(trimRefName('some-package@v1.2.3', 'some-package')).toBe('1.2.3');
    });

    it('should strip a plain prefix', () => {
        expect(trimRefName('release-1.2.3', 'release-')).toBe('1.2.3');
    });

    it('should keep the name when the prefix does not match', () => {
        expect(trimRefName('v1.2.3', 'other-')).toBe('1.2.3');
        expect(trimRefName('some-tag', 'other-')).toBe('some-tag');
    });

    it('should keep a monorepo prefix when the remainder is no semver', () => {
        expect(trimRefName('some-package@next', 'some-package')).toBe('@next');
    });
});
