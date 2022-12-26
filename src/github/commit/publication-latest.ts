/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { REGISTRY_GITHUB } from '../../contants';
import { Options } from '../../type';
import { findGitHubPackageLatestPublicationDate } from '../package';
import { GithubRepository } from '../repository';
import { findGitHubCommitByDate } from './date';
import { findGitHubCommitForLatestTag } from './tag-latest';

export async function findGitHubCommitByLatestPublication(
    repository: GithubRepository,
    options: Options,
) : Promise<string | undefined> {
    if (options.registryHost === REGISTRY_GITHUB) {
        const date = await findGitHubPackageLatestPublicationDate(
            repository,
            options,
        );

        if (date) {
            return findGitHubCommitByDate(
                repository,
                date,
                options.path,
            );
        }

        return undefined;
    }

    return findGitHubCommitForLatestTag(repository, options.gitTagPrefix);
}
