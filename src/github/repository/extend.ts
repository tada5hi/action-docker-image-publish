/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { GithubOwnerType } from '../constants';
import { useGitHubClient } from '../singleton';
import type { GithubRepository, GithubRepositoryMinimal } from './type';

export async function extendGitHubRepositoryEntity(
    entity: GithubRepositoryMinimal,
) : Promise<GithubRepository> {
    const { data } = await useGitHubClient()
        .rest.repos.get({
            repo: entity.repo,
            owner: entity.owner,
        });

    return {
        ...entity,
        ownerType: data.owner.type === 'User' ?
            GithubOwnerType.USER :
            GithubOwnerType.ORGANISATION,
        description: data.description,
        branch: data.default_branch,
    };
}
