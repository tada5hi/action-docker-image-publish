/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import github from '@actions/github';

export type GithubRef = {
    type: 'branch' | 'tag' | 'pull',

    value: string
};

export type GitHubClient = ReturnType<typeof github.getOctokit>;
