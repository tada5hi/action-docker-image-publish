/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { context } from '@actions/github';
import { execSync } from 'node:child_process';
import type { GithubRef } from '../type';

type CloneContext = {
    root: string,
    directory: string,
    ref: GithubRef,
    token: string
};
export function clone(ctx: CloneContext) {
    const parts : string[] = [
        'git',
        'clone',
    ];

    if (ctx.ref.type === 'branch') {
        parts.push(`--branch ${ctx.ref.value}`);
    }

    parts.push(`https://${ctx.token}@github.com/${context.repo.owner}/${context.repo.repo}`);
    parts.push(ctx.directory);

    execSync(parts.join(' '), {
        cwd: ctx.root,
    });
}
