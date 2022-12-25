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
    buildImage,
    buildImageURL,
    pushImage,
    removeImage,
    tagImage,
} from './daemon';
import {
    buildOptions,
    findVersionForPackage,
    hasPackageChanged,
} from './utils';

export async function execute() {
    const options = buildOptions();
    const octokit = github.getOctokit(options.token);
    const hasChanged = await hasPackageChanged(octokit, options);
    if (!hasChanged) {
        core.info('Package has not changed since last build.');
        return;
    }

    execSync(
        `echo "${options.registryPassword}" | docker login ${options.registryHost} -u ${options.registryUser} --password-stdin`,
    );

    const imageId = `${options.registryHost}/${options.registryProject}/${options.registryRepository}`;

    await buildImage({
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

    const packageVersion = await findVersionForPackage(
        options.packagePath,
        process.cwd(),
    );
    if (packageVersion) {
        imageUrl = buildImageURL(imageId, packageVersion);

        await tagImage(imageId, imageUrl);

        await pushImage(imageUrl);

        removeImage(imageUrl);
    }

    // ----------------------------------------------------

    imageUrl = buildImageURL(imageId, options.imageTag);

    tagImage(imageId, imageUrl);

    pushImage(imageUrl);

    removeImage(imageUrl);

    // ----------------------------------------------------

    removeImage(imageId);

    execSync(`docker logout ${options.registryHost}`);
}
