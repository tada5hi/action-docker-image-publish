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
} from './daemon';
import {
    buildOptions,
    getPackageJsonVersion, hasPackageChanged,
} from './utils';

export async function execute() {
    const options = buildOptions();
    const octokit = github.getOctokit(options.token);
    const hasChanged = await hasPackageChanged(octokit, options);
    if (!hasChanged) {
        core.info('Package path is not included.');
        return;
    }

    execSync(
        `echo "${options.registryPassword}" | docker login ${options.registryHost} -u ${options.registryUser} --password-stdin`,
    );

    const imageId = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`;

    await buildImage({
        filePath: options.imageFile,
        imageId,
        labels: {
            runId: `${github.context.runId}`,
            runNumber: `${github.context.runNumber}`,
        },
    });

    let imageUrl : string;

    const packageVersion = await getPackageJsonVersion(path.join(process.cwd(), options.packagePath));
    if (packageVersion) {
        imageUrl = buildImageURL(imageId, packageVersion);

        await tagImage(imageId, imageUrl);

        await pushImage(imageUrl);

        removeImage(imageUrl);
    }

    if (options.imageTag) {
        imageUrl = buildImageURL(imageId, options.imageTag);

        tagImage(imageId, imageUrl);

        pushImage(imageUrl);

        removeImage(imageUrl);
    }

    await removeImage(imageId);
}
