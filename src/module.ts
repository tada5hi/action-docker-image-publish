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
    findGitHubCommitByLatestPublication,
    setupGitHubClient,
} from './github';
import {
    buildOptions,
} from './utils';
import { findVersionFile } from './version-file';

export async function execute() {
    const options = buildOptions();
    setupGitHubClient(options.token);

    const versionFile = await findVersionFile(options.path);
    if (versionFile) {
        core.notice(`Package version ${versionFile.version} detected.`);
    }

    if (
        options.path.length > 0 ||
        options.ignores.length > 0
    ) {
        const repository = await extendGitHubRepositoryEntity({
            repo: github.context.repo.repo,
            owner: github.context.repo.owner,
        });

        const commitSha = await findGitHubCommitByLatestPublication({
            repository,
            options,
            versionFile,
        });
        if (commitSha) {
            core.info('The package content has been released before.');

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

    const imageId = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`;

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

    if (versionFile) {
        imageUrl = buildDockerImageURL(imageId, versionFile.version);

        tagDockerImage(imageId, imageUrl);

        pushDockerImage(imageUrl);

        removeDockerImage(imageUrl);
    }

    // ----------------------------------------------------

    if (!versionFile || options.imageTag.length > 0) {
        options.imageTag = options.imageTag || 'latest';

        imageUrl = buildDockerImageURL(imageId, options.imageTag);

        tagDockerImage(imageId, imageUrl);

        pushDockerImage(imageUrl);

        removeDockerImage(imageUrl);
    }

    // ----------------------------------------------------

    if (options.imageTag !== 'latest') {
        removeDockerImage(imageId);
    }

    execSync(`docker logout ${options.registryHost}`);
}
