/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { GitCloneOptions, IGitClient } from './types.ts';

export class MemoryGitClient implements IGitClient {
    readonly clones : GitCloneOptions[] = [];

    async clone(options: GitCloneOptions) : Promise<void> {
        this.clones.push(options);
    }
}
