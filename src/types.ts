/*
 * Copyright (c) 2022-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { IDockerClient, IGitClient, ILogger } from './core/index.ts';

export type Options = {
    /**
     * Dockerfile name.
     *
     * Default: Dockerfile
     */
    dockerFileName: string,

    /**
     * Path to the Dockerfile, relative to the repository root.
     *
     * Default: ''
     */
    dockerFilePath: string,

    /**
     * Additional docker build args, as KEY=VALUE strings.
     *
     * Default: []
     */
    buildArgs: string[],

    /**
     * Delete the built image at the end.
     *
     * Default: true
     */
    cleanup: boolean,

    /**
     * Clone the repository at the ref before building, instead of building
     * the working directory.
     *
     * On a GitHub runner the repository is already checked out, so this is
     * only needed for standalone use.
     *
     * Default: false
     */
    clone: boolean,

    /**
     * Whether to create an image tag for a git tag.
     *
     * Default: true
     */
    gitTag: boolean,

    /**
     * Only match git tags with this prefix.
     *
     * Default: ''
     */
    gitTagPrefix: string,

    /**
     * User for cloning the repository.
     */
    gitUser: string,

    /**
     * Password/token for cloning the repository.
     */
    gitPassword: string,

    /**
     * Default: ghcr.io
     */
    registryHost: string,

    registryUser: string,

    registryPassword: string,

    /**
     * Registry repository full name (e.g. project/repository).
     */
    registryRepository: string,

    /**
     * Registry image tags (e.g. latest).
     *
     * Default: ['latest']
     */
    registryTags: string[],

    /**
     * The git ref to publish (e.g. refs/tags/v1.2.3).
     */
    ref: string,

    /**
     * Repository full name (e.g. owner/repository).
     */
    repository: string,

    /**
     * Base url of the git server.
     *
     * Default: https://github.com
     */
    serverUrl: string,

    /**
     * Applied as an image label, when set.
     */
    runId?: string,

    /**
     * Applied as an image label, when set.
     */
    runNumber?: string,

    /**
     * Directory the repository is cloned into.
     */
    root: string
};

export type GithubRef = {
    type: 'branch' | 'tag' | 'pull',

    value: string
};

export type PublishContext = {
    docker: IDockerClient,

    git: IGitClient,

    logger: ILogger
};

export type PublishResult = {
    /**
     * Local id the image was built under.
     */
    imageId: string,

    /**
     * Whether the image had to be built.
     */
    built: boolean,

    /**
     * Fully qualified references pushed to the registry.
     */
    images: string[]
};
