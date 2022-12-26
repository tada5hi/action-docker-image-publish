/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { GithubOwnerType } from '../constants';

export type GithubRepository = {
    owner: string,
    ownerType: `${GithubOwnerType}`,
    repo: string,
    description: string,
    branch: string,
};

export type GithubRepositoryMinimal = Pick<
GithubRepository,
'owner' |
'repo'
> & Partial<GithubRepository>;
