import { describe, expect, it } from 'vitest';
import { buildDockerImageURL } from '../../../../src/core/index.ts';

describe('src/core/docker/url.ts', () => {
    it('should append a tag with a colon', () => {
        expect(buildDockerImageURL('ghcr.io/tada5hi/some-repo', 'latest'))
            .toBe('ghcr.io/tada5hi/some-repo:latest');
    });

    it('should append a digest with an at sign', () => {
        expect(buildDockerImageURL('ghcr.io/tada5hi/some-repo', 'sha256:abc'))
            .toBe('ghcr.io/tada5hi/some-repo@sha256:abc');
    });

    it('should build the base from a context object', () => {
        expect(buildDockerImageURL({
            host: 'ghcr.io',
            owner: 'tada5hi',
            name: 'some-repo',
            tag: '1.2.3',
        })).toBe('ghcr.io/tada5hi/some-repo:1.2.3');
    });

    it('should keep a reference which already carries a tag', () => {
        expect(buildDockerImageURL('ghcr.io/tada5hi/some-repo:1.2.3', 'latest'))
            .toBe('ghcr.io/tada5hi/some-repo:1.2.3');
    });

    it('should keep a reference which already carries a digest', () => {
        expect(buildDockerImageURL('ghcr.io/tada5hi/some-repo@sha256:abc'))
            .toBe('ghcr.io/tada5hi/some-repo@sha256:abc');
    });

    it('should return the base untouched without a tag', () => {
        expect(buildDockerImageURL('ghcr.io/tada5hi/some-repo'))
            .toBe('ghcr.io/tada5hi/some-repo');
    });
});
