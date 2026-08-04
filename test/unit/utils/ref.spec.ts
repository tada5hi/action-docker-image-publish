import { describe, expect, it } from 'vitest';
import { parseGitHubRef } from '../../../src/utils';

describe('src/utils/ref.ts', () => {
    it('should parse a branch ref', () => {
        expect(parseGitHubRef('refs/heads/master')).toEqual({
            type: 'branch',
            value: 'master',
        });
    });

    it('should keep slashes in a branch name', () => {
        expect(parseGitHubRef('refs/heads/feature/some-thing')).toEqual({
            type: 'branch',
            value: 'feature/some-thing',
        });
    });

    it('should parse a tag ref', () => {
        expect(parseGitHubRef('refs/tags/v1.2.3')).toEqual({
            type: 'tag',
            value: 'v1.2.3',
        });
    });

    it('should parse a pull ref', () => {
        expect(parseGitHubRef('refs/pulls/42')).toEqual({
            type: 'pull',
            value: '42',
        });
    });

    it('should return undefined for a non refs/ input', () => {
        expect(parseGitHubRef('heads/master')).toBeUndefined();
        expect(parseGitHubRef('master')).toBeUndefined();
    });

    it('should return undefined for an unknown ref type', () => {
        expect(parseGitHubRef('refs/remotes/origin')).toBeUndefined();
    });

    it('should return undefined for a too short ref', () => {
        expect(parseGitHubRef('refs/heads')).toBeUndefined();
    });
});
