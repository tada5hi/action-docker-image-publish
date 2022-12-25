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
     * Repository package path.
     * Will be checked for version in package.json
     *
     * Default: .
     */
    packagePath: string,

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
};

export type Octokit = ReturnType<typeof github.getOctokit>;
