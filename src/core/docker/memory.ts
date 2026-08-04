/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    IDockerClient,
    ImageBuildOptions,
    RegistryCredentials,
} from './types.ts';

/**
 * In memory docker client, tracking the images it was told about
 * so the orchestrator can be exercised without a docker daemon.
 */
export class MemoryDockerClient implements IDockerClient {
    readonly images : Set<string> = new Set();

    readonly builds : ImageBuildOptions[] = [];

    readonly pushed : string[] = [];

    readonly removed : string[] = [];

    readonly logins : RegistryCredentials[] = [];

    readonly logouts : string[] = [];

    constructor(images: string[] = []) {
        for (const image of images) {
            this.images.add(image);
        }
    }

    async login(credentials: RegistryCredentials) : Promise<void> {
        this.logins.push(credentials);
    }

    async logout(host: string) : Promise<void> {
        this.logouts.push(host);
    }

    async imageExists(image: string) : Promise<boolean> {
        return this.images.has(image);
    }

    async buildImage(options: ImageBuildOptions) : Promise<void> {
        this.builds.push(options);
        this.images.add(options.image);
    }

    async tagImage(source: string, target: string) : Promise<void> {
        if (!this.images.has(source)) {
            throw new Error(`The image ${source} does not exist.`);
        }

        this.images.add(target);
    }

    async pushImage(image: string) : Promise<void> {
        if (!this.images.has(image)) {
            throw new Error(`The image ${image} does not exist.`);
        }

        this.pushed.push(image);
    }

    async removeImage(image: string) : Promise<void> {
        this.images.delete(image);
        this.removed.push(image);
    }
}
