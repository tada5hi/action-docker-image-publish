/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from 'smob';
import { Options } from '../../type';
import { GithubOwnerType } from '../constants';
import { GithubRepository } from '../repository';
import { useGitHubClient } from '../singleton';

export async function findGitHubPackageLatestPublicationDate(
    repository: GithubRepository,
    options: Options,
) {
    const client = useGitHubClient();

    let date : string | undefined;

    try {
        switch (repository.ownerType) {
            case GithubOwnerType.ORGANISATION: {
                const { data } = await client.rest.packages.getPackageForOrganization({
                    package_type: 'container',
                    package_name: options.registryRepository,
                    org: repository.owner,
                });

                date = data.updated_at;

                break;
            }
            default: {
                const { data } = await client.rest.packages.getPackageForUser({
                    package_type: 'container',
                    package_name: options.registryRepository,
                    username: repository.owner,
                });

                date = data.updated_at;
            }
        }
    } catch (e: any) {
        if (isObject(e) && e.status === 404) {
            return undefined;
        }

        throw e;
    }

    return date;
}
