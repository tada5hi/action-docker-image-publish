/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'node:path';
import type { ICommandRunner } from '../command/index.ts';
import type {
    IDockerClient,
    ImageBuildOptions,
    RegistryCredentials,
} from './types.ts';

/**
 * Docker client backed by the docker CLI.
 *
 * The CLI is preferred over the daemon API because it brings BuildKit,
 * .dockerignore handling and credential helpers for free.
 */
export class DockerCLIClient implements IDockerClient {
    protected runner : ICommandRunner;

    protected binary : string;

    constructor(runner: ICommandRunner, binary = 'docker') {
        this.runner = runner;
        this.binary = binary;
    }

    async login(credentials: RegistryCredentials) : Promise<void> {
        // the password is written to stdin, so it never appears
        // in the argument vector or in a shell command line.
        await this.runner.run(
            this.binary,
            [
                'login',
                credentials.host,
                '--username',
                credentials.user,
                '--password-stdin',
            ],
            { stdin: credentials.password },
        );
    }

    async logout(host: string) : Promise<void> {
        await this.runner.run(this.binary, ['logout', host]);
    }

    async imageExists(image: string) : Promise<boolean> {
        const result = await this.runner.run(this.binary, ['images', '-q', image]);

        return result.stdout.trim().length > 0;
    }

    async buildImage(options: ImageBuildOptions) : Promise<void> {
        const args : string[] = [
            'build',
            '.',
            '--file',
            options.fileName,
            '--tag',
            options.image,
        ];

        if (options.labels) {
            for (const [key, value] of Object.entries(options.labels)) {
                args.push('--label', `${key}=${value}`);
            }
        }

        if (options.buildArgs) {
            if (Array.isArray(options.buildArgs)) {
                for (const buildArg of options.buildArgs) {
                    args.push('--build-arg', buildArg);
                }
            } else {
                for (const [key, value] of Object.entries(options.buildArgs)) {
                    args.push('--build-arg', `${key}=${value}`);
                }
            }
        }

        let cwd = options.cwd || process.cwd();
        if (!path.isAbsolute(cwd)) {
            cwd = path.join(process.cwd(), cwd);
        }

        await this.runner.run(this.binary, args, { cwd });
    }

    async tagImage(source: string, target: string) : Promise<void> {
        await this.runner.run(this.binary, ['tag', source, target]);
    }

    async pushImage(image: string) : Promise<void> {
        await this.runner.run(this.binary, ['push', image]);
    }

    async removeImage(image: string) : Promise<void> {
        await this.runner.run(this.binary, ['image', 'rm', '--force', image]);
    }
}
