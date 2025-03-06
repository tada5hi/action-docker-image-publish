/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type Options = {
    /**
     * Dockerfile name
     *
     * default: Dockerfile
     */
    dockerFileName: string,

    /**
     * Path to Dockerfile
     *
     * Default: ""
     */
    dockerFilePath: string,

    /**
     * Whether to create an image tag for a git tag.
     *
     * Default: true
     */
    gitTag: boolean,

    /**
     * Match for git tag with given prefix.
     *
     * Default: ''
     */
    gitTagPrefix: string,

    /**
     * Git user
     *
     * Default: github.actor
     */
    gitUser: string,

    /**
     * Git password
     *
     * Default: github.password
     */
    gitPassword: string,

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
     * Default: github.repository
     */
    registryRepository: string,

    /**
     * Registry image tag (e.g. latest)
     *
     * Default: ['latest']
     */
    registryTags: string[],

    /**
     * Delete the built image at the end
     *
     * Default: true
     */
    cleanup: boolean,

    /**
     * GitHub access token
     */
    token: string
};

export type GithubRef = {
    type: 'branch' | 'tag' | 'pull',

    value: string
};
