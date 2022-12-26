/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { REGISTRY_GITHUB } from '../../contants';
import { Options } from '../../type';
import { VersionFile } from '../../version-file';
import { findGitHubPackageLatestPublicationDate } from '../package';
import { GithubRepository } from '../repository';
import { findGitHubCommitByDate } from './date';
import { findGitHubCommitForLatestTag } from './tag-latest';

type Context = {
    options: Options,

    repository: GithubRepository,

    versionFile?: VersionFile
};

export async function findGitHubCommitByLatestPublication(
    ctx: Context,
) : Promise<string | undefined> {
    if (ctx.options.registryHost === REGISTRY_GITHUB) {
        const date = await findGitHubPackageLatestPublicationDate(ctx);

        if (date) {
            return findGitHubCommitByDate(
                ctx.repository,
                date,
                ctx.options.path,
            );
        }

        return undefined;
    }

    return findGitHubCommitForLatestTag(ctx.repository, ctx.versionFile);
}
