/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import github from '@actions/github';
import { getApiBaseUrl } from '@actions/github/lib/internal/utils';
import { isObject } from 'smob';
import { PACKAGE_PATH_DEFAULT, REGISTRY_GITHUB } from '../contants';
import { Octokit, Options } from '../type';
import { withoutLeadingSlash } from './url';

export async function hasPackageChanged(client: Octokit, options: Options) {
    const packagePath = withoutLeadingSlash(options.packagePath);

    const url = new URL(
        `/repos/${github.context.repo.owner}/${github.context.repo.repo}/commits`,
        getApiBaseUrl(),
    );

    if (packagePath !== PACKAGE_PATH_DEFAULT) {
        url.searchParams.set('path', packagePath);
    }

    if (options.registryHost === REGISTRY_GITHUB) {
        const { data } = await client.rest.packages.getPackageForUser({
            package_type: 'container',
            package_name: options.registryRepository,
            username: github.context.repo.owner,
        });

        url.searchParams.set('since', data.created_at);
        url.searchParams.set('per_page', '1');
    }

    const { data: commits } = await client.request(url.href);
    if (Array.isArray(commits)) {
        if (commits.length === 0) {
            return false;
        }

        // check if commit is most recent...
        const commit = commits.shift();
        return isObject(commit) && commit.sha === github.context.sha;

        // todo: check if match ignore option
    }

    return false;
}
