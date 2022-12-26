/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import minimatch from 'minimatch';
import { Options } from '../../type';
import { cleanDoubleSlashes, withoutLeadingSlash } from '../../utils';
import { useGitHubClient } from '../singleton';
import { GithubRepository } from '../repository';

type Context = {
    repository: GithubRepository,
    options: Options,
    base: string,
    head: string
};
export async function checkGitHubCommitRangeForChanges(
    ctx: Context,
) {
    if (ctx.base === ctx.head) {
        return false;
    }

    let { path } = ctx.options;
    if (path.length > 0) {
        path = withoutLeadingSlash(path);
    }

    if (
        path.length === 0 &&
        ctx.options.ignores.length === 0
    ) {
        return true;
    }

    const { data: comparison } = await useGitHubClient()
        .rest.repos.compareCommits({
            repo: ctx.repository.repo,
            owner: ctx.repository.owner,
            base: ctx.base,
            head: ctx.head,
        });

    if (comparison.files.length > 0) {
        core.notice(`Inspecting ${comparison.files.length} commit file(s) for changes.`);

        const { ignores } = ctx.options;
        for (let i = 0; i < ignores.length; i++) {
            if (
                path.length > 0 &&
                !ignores[i].startsWith(path)
            ) {
                ignores[i] = cleanDoubleSlashes(`${path}/${ignores[i]}`);
            }

            ignores[i] = withoutLeadingSlash(ignores[i]);
        }

        for (let i = 0; i < comparison.files.length; i++) {
            if (
                path.length > 0 &&
                !comparison.files[i].filename.startsWith(path)
            ) {
                continue;
            }

            if (ignores.length === 0) {
                return true;
            }

            let isIgnored = false;

            for (let j = 0; j < ignores.length; j++) {
                if (minimatch(comparison.files[j].filename, ignores[j])) {
                    isIgnored = true;
                    break;
                }
            }

            if (!isIgnored) {
                return true;
            }
        }
    }

    return false;
}
