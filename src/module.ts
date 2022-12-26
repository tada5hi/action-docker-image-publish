/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { execSync } from 'child_process';
import path from 'path';
import {
    buildImage,
    buildImageURL,
    pushImage,
    removeImage,
    tagImage,
} from './docker';
import { hasGItHubRepositoryChanged } from './github/repository-changed';
import { extendGitHubRepositoryEntity } from './github/repository';
import { setupGitHubClient } from './github/singleton';
import {
    buildOptions,
} from './utils';
import { findVersionFile } from './version-file';

export async function execute() {
    const options = buildOptions();
    setupGitHubClient(options.token);

    const metaFile = await findVersionFile(path.join(process.cwd(), options.path));

    const repository = await extendGitHubRepositoryEntity({
        repo: github.context.repo.repo,
        owner: github.context.repo.owner,
    });

    const hasChanged = await hasGItHubRepositoryChanged({
        repository,
        options,
        VersionFile: metaFile,
        sha: github.context.sha,
    });

    if (!hasChanged) {
        core.info('Path content has not changed since last build.');
        return;
    }

    execSync(
        `echo "${options.registryPassword}" | docker login ${options.registryHost} -u ${options.registryUser} --password-stdin`,
    );

    const imageId = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`;

    buildImage({
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

    if (metaFile) {
        imageUrl = buildImageURL(imageId, metaFile.version);

        tagImage(imageId, imageUrl);

        pushImage(imageUrl);

        removeImage(imageUrl);
    }

    // ----------------------------------------------------

    imageUrl = buildImageURL(imageId, options.imageTag);

    tagImage(imageId, imageUrl);

    pushImage(imageUrl);

    removeImage(imageUrl);

    // ----------------------------------------------------

    if (options.imageTag !== 'latest') {
        removeImage(imageId);
    }

    execSync(`docker logout ${options.registryHost}`);
}
