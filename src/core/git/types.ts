/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type GitCloneOptions = {
    /**
     * Repository url, without credentials.
     */
    url: string,

    /**
     * Target directory, relative to cwd.
     */
    directory: string,

    /**
     * Directory to run the clone in.
     */
    cwd: string,

    /**
     * Restrict the clone to a single branch.
     */
    branch?: string,

    user?: string,

    password?: string
};

export interface IGitClient {
    clone(options: GitCloneOptions) : Promise<void>;
}
