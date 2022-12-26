/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import semver from 'semver';
import { GithubRepository } from '../repository';
import { useGitHubClient } from '../singleton';

export async function findGitHubCommitForLatestTag(
    repository: GithubRepository,
    tagPrefix?: string,
) : Promise<string | undefined> {
    const client = useGitHubClient();
    const { data: tags } = await client.rest.repos.listTags({
        owner: repository.owner,
        repo: repository.repo,
    });

    if (tags.length > 0) {
        let commitSha : string | undefined;
        for (let i = 0; i < tags.length; i++) {
            let { name } = tags[i];
            if (name.startsWith('v')) {
                name = name.substring(1);
            }

            if (semver.valid(name)) {
                commitSha = tags[i].commit.sha;
                break;
            }

            if (
                tagPrefix &&
                tagPrefix.length > 0
            ) {
                if (tags[i].name.startsWith(tagPrefix)) {
                    commitSha = tags[i].commit.sha;
                }
            } else {
                commitSha = tags[i].commit.sha;
                break;
            }
        }

        if (commitSha) {
            return commitSha;
        }
    }

    return undefined;
}
