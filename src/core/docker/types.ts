/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type RegistryCredentials = {
    host: string,

    user: string,

    password: string
};

export type ImageBuildOptions = {
    /**
     * Tag the built image with this reference.
     */
    image: string,

    /**
     * Name of the Dockerfile, relative to cwd.
     */
    fileName: string,

    /**
     * Build context directory.
     */
    cwd: string,

    labels?: Record<string, string>,

    /**
     * Additional build args, either as KEY=VALUE strings or as a record.
     */
    buildArgs?: Record<string, string> | string[]
};

export interface IDockerClient {
    login(credentials: RegistryCredentials) : Promise<void>;

    logout(host: string) : Promise<void>;

    imageExists(image: string) : Promise<boolean>;

    buildImage(options: ImageBuildOptions) : Promise<void>;

    tagImage(source: string, target: string) : Promise<void>;

    pushImage(image: string) : Promise<void>;

    removeImage(image: string) : Promise<void>;
}
