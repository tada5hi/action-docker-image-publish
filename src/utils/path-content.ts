/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import github from '@actions/github';
import { getApiBaseUrl } from '@actions/github/lib/internal/utils';
import minimatch from 'minimatch';
import { isObject } from 'smob';
import { PACKAGE_PATH_DEFAULT, REGISTRY_GITHUB } from '../contants';
import { Octokit, Options } from '../type';
import { withoutLeadingSlash } from './url';

export async function hasPathContentChanged(client: Octokit, options: Options) {
    const path = withoutLeadingSlash(options.path);

    const url = new URL(
        `/repos/${github.context.repo.owner}/${github.context.repo.repo}/commits`,
        getApiBaseUrl(),
    );

    if (path !== PACKAGE_PATH_DEFAULT) {
        url.searchParams.set('path', path);
    }

    if (options.registryHost === REGISTRY_GITHUB) {
        try {
            const { data } = await client.rest.packages.getPackageForUser({
                package_type: 'container',
                package_name: options.registryRepository,
                username: github.context.repo.owner,
            });

            url.searchParams.set('since', data.created_at);
        } catch (e) {
            if (
                !isObject(e) ||
                e.status !== 404
            ) {
                if (e instanceof Error) {
                    throw e;
                }
            }
        }
    }

    // todo: check for most recent tag

    const { data: commits } = await client.request(url.href);
    if (Array.isArray(commits)) {
        if (commits.length === 0) {
            return false;
        }

        if (
            !isObject(commits[0]) ||
            commits[0].sha !== github.context.sha
        ) {
            // commit is not most recent...
            return false;
        }

        if (options.ignores.length === 0) {
            return true;
        }

        for (let i = 0; i < commits.length; i++) {
            const { data: commit } = await client.rest.repos.getCommit({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                ref: commits[i].sha,
            });

            for (let j = 0; j < commit.files.length; j++) {
                for (let k = 0; k < options.ignores.length; k++) {
                    if (!minimatch(commit.files[j].filename, options.ignores[k])) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    return false;
}
