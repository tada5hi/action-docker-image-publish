import { describe, expect, it } from 'vitest';
import { DockerCLIClient, MemoryCommandRunner } from '../../../../src/core/index.ts';

describe('src/core/docker/cli.ts', () => {
    it('should pass the registry password through stdin', async () => {
        const runner = new MemoryCommandRunner();
        const client = new DockerCLIClient(runner);

        await client.login({
            host: 'ghcr.io', 
            user: 'tada5hi', 
            password: 'p@ss word', 
        });

        const call = runner.calls[0];

        expect(call?.args).toEqual([
            'login',
            'ghcr.io',
            '--username',
            'tada5hi',
            '--password-stdin',
        ]);
        expect(call?.options.stdin).toBe('p@ss word');
        // the secret must never reach the argument vector
        expect(call?.args).not.toContain('p@ss word');
    });

    it('should report an existing image', async () => {
        const runner = new MemoryCommandRunner()
            .respondTo('docker images -q', { stdout: 'a1b2c3\n' });

        expect(await new DockerCLIClient(runner).imageExists('a1b2c3')).toBe(true);
    });

    it('should report a missing image', async () => {
        const runner = new MemoryCommandRunner()
            .respondTo('docker images -q', { stdout: '\n' });

        expect(await new DockerCLIClient(runner).imageExists('a1b2c3')).toBe(false);
    });

    it('should build with labels and build args', async () => {
        const runner = new MemoryCommandRunner();

        await new DockerCLIClient(runner).buildImage({
            image: 'some-id',
            fileName: 'Dockerfile',
            cwd: '/workspace/.output',
            labels: { runId: '1', runNumber: '2' },
            buildArgs: ['FOO=bar'],
        });

        expect(runner.calls[0]?.args).toEqual([
            'build',
            '.',
            '--file',
            'Dockerfile',
            '--tag',
            'some-id',
            '--label',
            'runId=1',
            '--label',
            'runNumber=2',
            '--build-arg',
            'FOO=bar',
        ]);
        expect(runner.calls[0]?.options.cwd).toBe('/workspace/.output');
    });

    it('should accept build args as a record', async () => {
        const runner = new MemoryCommandRunner();

        await new DockerCLIClient(runner).buildImage({
            image: 'some-id',
            fileName: 'Dockerfile',
            cwd: '/workspace',
            buildArgs: { FOO: 'bar' },
        });

        expect(runner.calls[0]?.args).toContain('FOO=bar');
    });

    it('should tag, push and remove images', async () => {
        const runner = new MemoryCommandRunner();
        const client = new DockerCLIClient(runner);

        await client.tagImage('some-id', 'ghcr.io/tada5hi/some-repo:latest');
        await client.pushImage('ghcr.io/tada5hi/some-repo:latest');
        await client.removeImage('ghcr.io/tada5hi/some-repo:latest');
        await client.logout('ghcr.io');

        expect(runner.commandLines).toEqual([
            'docker tag some-id ghcr.io/tada5hi/some-repo:latest',
            'docker push ghcr.io/tada5hi/some-repo:latest',
            'docker image rm --force ghcr.io/tada5hi/some-repo:latest',
            'docker logout ghcr.io',
        ]);
    });

    it('should reject when the docker command fails', async () => {
        const runner = new MemoryCommandRunner()
            .respondTo('docker push', { code: 1, stderr: 'denied' });

        await expect(new DockerCLIClient(runner).pushImage('some-image'))
            .rejects.toThrow(/exit code 1/);
    });
});
