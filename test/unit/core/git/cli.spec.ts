import { describe, expect, it } from 'vitest';
import {
    GitCLIClient,
    MemoryCommandRunner,
    buildCloneURL,
    escapeCredential,
} from '../../../../src/core/index.ts';

describe('src/core/git/cli.ts', () => {
    describe('escapeCredential', () => {
        it('should leave an unreserved token untouched', () => {
            expect(escapeCredential('ghp_abcDEF123')).toBe('ghp_abcDEF123');
        });

        it('should percent encode characters reserved in a url userinfo section', () => {
            expect(escapeCredential('a@b:c/d')).toBe('a%40b%3Ac%2Fd');
        });

        it('should encode every reserved character', () => {
            expect(escapeCredential('!#$&\'()*+,/:;=?@[]')).toBe(
                '%21%23%24%26%27%28%29%2A%2B%2C%2F%3A%3B%3D%3F%40%5B%5D',
            );
        });
    });

    describe('buildCloneURL', () => {
        it('should inject credentials after the protocol', () => {
            expect(buildCloneURL('https://github.com/tada5hi/some-repo', 'tada5hi', 'secret'))
                .toBe('https://tada5hi:secret@github.com/tada5hi/some-repo');
        });

        it('should escape credentials', () => {
            expect(buildCloneURL('https://github.com/o/r', 'user', 'p@ss/word'))
                .toBe('https://user:p%40ss%2Fword@github.com/o/r');
        });

        it('should leave the url untouched without credentials', () => {
            expect(buildCloneURL('https://github.com/o/r')).toBe('https://github.com/o/r');
        });
    });

    describe('GitCLIClient', () => {
        it('should clone without a branch for a tag', async () => {
            const runner = new MemoryCommandRunner();
            const client = new GitCLIClient(runner);

            await client.clone({
                url: 'https://github.com/tada5hi/some-repo',
                directory: '.output',
                cwd: '/workspace',
            });

            expect(runner.calls).toHaveLength(1);
            expect(runner.calls[0]?.command).toBe('git');
            expect(runner.calls[0]?.args).toEqual([
                'clone',
                'https://github.com/tada5hi/some-repo',
                '.output',
            ]);
            expect(runner.calls[0]?.options.cwd).toBe('/workspace');
        });

        it('should restrict the clone to a branch', async () => {
            const runner = new MemoryCommandRunner();
            const client = new GitCLIClient(runner);

            await client.clone({
                url: 'https://github.com/tada5hi/some-repo',
                directory: '.output',
                cwd: '/workspace',
                branch: 'feature/some-thing',
            });

            expect(runner.calls[0]?.args).toEqual([
                'clone',
                '--branch',
                'feature/some-thing',
                'https://github.com/tada5hi/some-repo',
                '.output',
            ]);
        });
    });
});
