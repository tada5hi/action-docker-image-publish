/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { execSync } from 'child_process';
import {
    buildDockerImage,
    buildDockerImageURL,
    pushDockerImage,
    removeDockerImage,
    tagDockerImage,
} from './docker';
import {
    checkGitHubCommitRangeForChanges,
    extendGitHubRepositoryEntity,
    findGitHubCommitByLatestPublication, parseGitHubRef,
    setupGitHubClient,
} from './github';
import {
    buildOptions,
} from './utils';

export async function execute() {
    const options = buildOptions();
    setupGitHubClient(options.token);

    const ref = parseGitHubRef(github.context.ref);
    if (!ref) {
        core.error('The GitHub ref could not be parsed.');
        return;
    }

    if (
        ref.type === 'branch' &&
        (
            options.path.length > 0 ||
            options.ignores.length > 0
        )
    ) {
        const repository = await extendGitHubRepositoryEntity({
            repo: github.context.repo.repo,
            owner: github.context.repo.owner,
        });

        const commitSha = await findGitHubCommitByLatestPublication(
            repository,
            options,
        );
        if (commitSha) {
            core.notice('The package has been released before.');

            const hasChanged = await checkGitHubCommitRangeForChanges({
                repository,
                options,
                base: commitSha,
                head: github.context.sha,
            });

            if (!hasChanged) {
                core.notice('The package content has not changed since the last release.');
                return;
            }
        } else {
            core.notice('The package content has not been released before.');
        }
    }

    // todo: check if current commit is most recent.

    execSync(
        `echo "${options.registryPassword}" | docker login ${options.registryHost} -u ${options.registryUser} --password-stdin`,
    );

    const imageId = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`.toLowerCase();

    buildDockerImage({
        fileName: options.dockerFileName,
        filePath: options.dockerFilePath,
        imageId,
        labels: {
            runId: `${github.context.runId}`,
            runNumber: `${github.context.runNumber}`,
        },
    });

    let imageUrl : string;

    // ----------------------------------------------------

    // build docker image for git tag
    if (
        options.gitTag &&
        ref.type === 'tag'
    ) {
        if (
            options.gitTagPrefix.length === 0 ||
            ref.value.startsWith(options.gitTagPrefix)
        ) {
            imageUrl = buildDockerImageURL(imageId, ref.value);

            tagDockerImage(imageId, imageUrl);

            pushDockerImage(imageUrl);

            removeDockerImage(imageUrl);
        }
    }

    // ----------------------------------------------------

    if (
        ref.type !== 'tag' ||
        !options.gitTag ||
        options.registryTag.length > 0
    ) {
        options.registryTag = options.registryTag || 'latest';

        imageUrl = buildDockerImageURL(imageId, options.registryTag);

        tagDockerImage(imageId, imageUrl);

        pushDockerImage(imageUrl);

        removeDockerImage(imageUrl);
    }

    // ----------------------------------------------------

    if (options.registryTag !== 'latest') {
        removeDockerImage(imageId);
    }

    execSync(`docker logout ${options.registryHost}`);
}
