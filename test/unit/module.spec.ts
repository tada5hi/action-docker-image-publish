import { 
    beforeEach, 
    describe, 
    expect, 
    it, 
} from 'vitest';
import {
    MemoryDockerClient,
    MemoryGitClient,
    NoopLogger,
} from '../../src/core/index.ts';
import { publish } from '../../src/module.ts';
import type { Options, PublishContext } from '../../src/types.ts';

function buildOptions(extend: Partial<Options> = {}) : Options {
    return {
        dockerFileName: 'Dockerfile',
        dockerFilePath: '',
        buildArgs: [],
        cleanup: true,

        gitTag: true,
        gitTagPrefix: '',
        gitUser: 'tada5hi',
        gitPassword: 'some-password',

        registryHost: 'ghcr.io',
        registryUser: 'tada5hi',
        registryPassword: 'some-registry-password',
        registryRepository: 'tada5hi/some-repo',
        registryTags: ['latest'],

        ref: 'refs/heads/master',
        repository: 'tada5hi/some-repo',
        serverUrl: 'https://github.com',

        root: '/workspace',

        ...extend,
    };
}

describe('src/module.ts', () => {
    let docker : MemoryDockerClient;
    let git : MemoryGitClient;
    let context : PublishContext;

    beforeEach(() => {
        docker = new MemoryDockerClient();
        git = new MemoryGitClient();
        context = {
            docker, 
            git, 
            logger: new NoopLogger(), 
        };
    });

    it('should build and push the registry tags for a branch', async () => {
        const result = await publish(buildOptions(), context);

        expect(result.built).toBe(true);
        expect(result.images).toEqual(['ghcr.io/tada5hi/some-repo:latest']);
        expect(docker.pushed).toEqual(['ghcr.io/tada5hi/some-repo:latest']);
    });

    it('should clone the branch of a branch ref', async () => {
        await publish(buildOptions({ ref: 'refs/heads/feature/some-thing' }), context);

        expect(git.clones[0]?.branch).toBe('feature/some-thing');
        expect(git.clones[0]?.url).toBe('https://github.com/tada5hi/some-repo');
    });

    it('should not restrict the clone to a branch for a tag ref', async () => {
        await publish(buildOptions({ ref: 'refs/tags/v1.2.3' }), context);

        expect(git.clones[0]?.branch).toBeUndefined();
    });

    it('should derive the image tag from a git tag', async () => {
        const result = await publish(buildOptions({
            ref: 'refs/tags/v1.2.3',
            registryTags: [],
        }), context);

        expect(result.images).toEqual(['ghcr.io/tada5hi/some-repo:1.2.3']);
    });

    it('should push the git tag and the registry tags together', async () => {
        const result = await publish(buildOptions({
            ref: 'refs/tags/v1.2.3',
            registryTags: ['latest'],
        }), context);

        expect(result.images).toEqual([
            'ghcr.io/tada5hi/some-repo:1.2.3',
            'ghcr.io/tada5hi/some-repo:latest',
        ]);
    });

    it('should skip a git tag which does not match the prefix', async () => {
        const result = await publish(buildOptions({
            ref: 'refs/tags/other-package@1.2.3',
            gitTagPrefix: 'some-package',
            registryTags: [],
        }), context);

        expect(result.images).toEqual([]);
    });

    it('should strip the prefix of a matching git tag', async () => {
        const result = await publish(buildOptions({
            ref: 'refs/tags/some-package@1.2.3',
            gitTagPrefix: 'some-package',
            registryTags: [],
        }), context);

        expect(result.images).toEqual(['ghcr.io/tada5hi/some-repo:1.2.3']);
    });

    it('should lowercase the registry reference', async () => {
        const result = await publish(buildOptions({
            registryHost: 'GHCR.IO',
            registryRepository: 'TaDa5hi/Some-Repo',
        }), context);

        expect(result.images).toEqual(['ghcr.io/tada5hi/some-repo:latest']);
    });

    it('should collapse double slashes in the registry reference', async () => {
        const result = await publish(buildOptions({
            registryHost: 'ghcr.io/',
            registryRepository: '/tada5hi/some-repo',
        }), context);

        expect(result.images).toEqual(['ghcr.io/tada5hi/some-repo:latest']);
    });

    it('should skip the build when the image already exists', async () => {
        const options = buildOptions();

        // the local image id is derived from the ref, so a second run
        // against a daemon which already holds it must not rebuild
        const first = await publish(options, context);

        const existing = new MemoryDockerClient([first.imageId]);
        const second = await publish(options, { ...context, docker: existing });

        expect(first.built).toBe(true);
        expect(second.built).toBe(false);
        expect(existing.builds).toHaveLength(0);
    });

    it('should remove the built image when cleanup is enabled', async () => {
        const result = await publish(buildOptions({ cleanup: true }), context);

        expect(docker.removed).toContain(result.imageId);
    });

    it('should keep the built image when cleanup is disabled', async () => {
        const result = await publish(buildOptions({ cleanup: false }), context);

        expect(docker.removed).not.toContain(result.imageId);
    });

    it('should log in and out of the registry', async () => {
        await publish(buildOptions(), context);

        expect(docker.logins).toEqual([{
            host: 'ghcr.io',
            user: 'tada5hi',
            password: 'some-registry-password',
        }]);
        expect(docker.logouts).toEqual(['ghcr.io']);
    });

    it('should log out even when a push fails', async () => {
        const failing = new MemoryDockerClient();
        failing.pushImage = async () => {
            throw new Error('denied');
        };

        await expect(publish(buildOptions(), { ...context, docker: failing }))
            .rejects.toThrow('denied');

        expect(failing.logouts).toEqual(['ghcr.io']);
    });

    it('should reject an unparsable ref', async () => {
        await expect(publish(buildOptions({ ref: 'master' }), context))
            .rejects.toThrow(/could not be parsed/);
    });

    it('should label the image with the run identifiers', async () => {
        await publish(buildOptions({ runId: '42', runNumber: '7' }), context);

        expect(docker.builds[0]?.labels).toEqual({ runId: '42', runNumber: '7' });
    });

    it('should forward the docker file path to the build context', async () => {
        await publish(buildOptions({ dockerFilePath: 'services/api' }), context);

        expect(docker.builds[0]?.cwd).toBe('/workspace/.output/services/api');
    });
});
