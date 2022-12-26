/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import minimatch from 'minimatch';
import { VersionFile } from '../version-file';
import { Options } from '../type';
import { findGitHubCommitOfLatestRelease } from './commit-release';
import { cleanDoubleSlashes, withoutLeadingSlash } from '../utils';
import { useGitHubClient } from './singleton';
import { GithubRepositoryEntity } from './type';

type Context = {
    repository: GithubRepositoryEntity,
    options: Options,
    VersionFile: VersionFile,
    sha?: string
};
export async function hasGItHubRepositoryChanged(ctx: Context) {
    const commitSha = await findGitHubCommitOfLatestRelease(ctx);
    if (!commitSha) {
        return true;
    }

    const { data: comparison } = await useGitHubClient()
        .rest.repos.compareCommits({
            repo: ctx.repository.repo,
            owner: ctx.repository.owner,
            base: commitSha,
            head: ctx.sha,
        });

    if (comparison.files.length > 0) {
        const path = withoutLeadingSlash(ctx.options.path);
        const { ignores } = this.options;
        if (path.length !== 0) {
            for (let i = 0; i < ignores.length; i++) {
                ignores[i] = cleanDoubleSlashes(`${path}/${ignores[i]}`);
            }
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
