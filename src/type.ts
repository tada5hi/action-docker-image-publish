/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import github from '@actions/github';

export type Options = {
    /**
     * Action secret
     */
    token: string,

    /**
     * Dockerfile name
     *
     * default: Dockerfile
     */
    dockerFileName: string,

    /**
     * Path to Dockerfile
     *
     * Default: .
     */
    dockerFilePath: string,

    /**
     * Directory to check for changes.
     *
     * Default: .
     */
    path: string,

    /**
     * Glob pattern to ignore specific files & directories for changes.
     */
    ignores: string[],

    /**
     * Publish by a specific tag.
     *
     * Default: 'latest'
     */
    imageTag: string,

    /**
     * Default: ghcr.io
     */
    registryHost: string,

    /**
     * Default: github.repository.owner.name
     */
    registryUser: string,

    /**
     * Default: github.secret
     */
    registryPassword: string,

    /**
     * Default: github.repository.owner.name
     */
    registryProject: string,

    /**
     * Default: github.repository.owner.repo
     */
    registryRepository: string,
    /**
     * Detect version by version file.
     *
     * Default: true
     */
    versionFile: boolean
};

export type Octokit = ReturnType<typeof github.getOctokit>;
