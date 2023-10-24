/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { execSync } from 'child_process';
import md5 from 'md5';
import {
    buildDockerImage,
    buildDockerImageURL, checkDockerImage,
    pushDockerImage,
    removeDockerImage,
    tagDockerImage,
} from './docker';
import {
    checkGitHubCommitRangeForChanges,
    extendGitHubRepositoryEntity,
    findGitHubCommitByLatestPublication,
    parseGitHubRef,
    setupGitHubClient,
} from './github';
import {
    buildOptions, trimRefName,
} from './utils';

export async function execute() {
    const options = buildOptions();
    setupGitHubClient(options.token);

    const ref = parseGitHubRef(github.context.ref);
    if (!ref) {
        core.error('The GitHub ref could not be parsed.');
        return;
    }

    const imageId = md5(github.context.ref);
    const imageExists = checkDockerImage(imageId);

    if (
        !imageExists &&
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

    if (!imageExists) {
        buildDockerImage({
            fileName: options.dockerFileName,
            filePath: options.dockerFilePath,
            imageId,
            labels: {
                runId: `${github.context.runId}`,
                runNumber: `${github.context.runNumber}`,
            },
        });
    }

    const imageIdRemote = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`.toLowerCase();
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
            imageUrl = buildDockerImageURL(
                imageIdRemote,
                trimRefName(ref.value, options.gitTagPrefix),
            );

            core.info(`Create tag: ${imageUrl}`);

            tagDockerImage(imageId, imageUrl);

            pushDockerImage(imageUrl);

            removeDockerImage(imageUrl);
        }
    }

    // ----------------------------------------------------

    if (
        ref.type !== 'tag' ||
        !options.gitTag ||
        options.registryTags.length > 0
    ) {
        for (let i = 0; i < options.registryTags.length; i++) {
            imageUrl = buildDockerImageURL(imageIdRemote, options.registryTags[i]);

            core.info(`Create tag: ${imageUrl}`);

            tagDockerImage(imageId, imageUrl);

            pushDockerImage(imageUrl);

            removeDockerImage(imageUrl);
        }
    }

    // ----------------------------------------------------

    if (!options.cache) {
        removeDockerImage(imageId);
    }

    execSync(`docker logout ${options.registryHost}`);
}
