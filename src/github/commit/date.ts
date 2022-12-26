/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { withoutLeadingSlash } from '../../utils';
import { GithubRepository } from '../repository';
import { useGitHubClient } from '../singleton';

export async function findGitHubCommitByDate(
    repository: GithubRepository,
    date: string,
    path?: string,
) : Promise<string | undefined> {
    if (
        path &&
        path.length > 0
    ) {
        path = withoutLeadingSlash(path);
    }

    const { data: commits } = await useGitHubClient()
        .rest.repos.listCommits({
            repo: repository.repo,
            owner: repository.owner,
            until: date,
            per_page: 1,
            ...(path && path.length > 0 ? { path } : {}),
        });

    if (commits.length > 0) {
        return commits[0].sha;
    }

    return undefined;
}
