/*
 * Copyright (c) 2023-2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { context } from '@actions/github';
import { execSync } from 'node:child_process';
import type { GithubRef } from '../types';

type CloneContext = {
    root: string,
    directory: string,
    ref: GithubRef,
    user: string,
    password: string
};

const characterMap : Record<string, string> = {
    '!': '%21',
    '#': '%23',
    $: '%24',
    '&': '%26',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
    '+': '%2B',
    ',': '%2C',
    '/': '%2F',
    ':': '%3A',
    ';': '%3B',
    '=': '%3D',
    '?': '%3F',
    '@': '%40',
    '[': '%5B',
    ']': '%5D',
};

function escapePassword(token: string) {
    let output = '';
    for (let i = 0; i < token.length; i++) {
        output += characterMap[token[i]] || token[i];
    }

    return output;
}
export function clone(ctx: CloneContext) {
    const parts : string[] = [
        'git',
        'clone',
    ];

    if (ctx.ref.type === 'branch') {
        parts.push(`--branch ${ctx.ref.value}`);
    }

    parts.push(`https://${ctx.user}:${escapePassword(ctx.password)}@github.com/${context.repo.owner}/${context.repo.repo}`);
    parts.push(ctx.directory);

    execSync(parts.join(' '), {
        cwd: ctx.root,
    });
}
