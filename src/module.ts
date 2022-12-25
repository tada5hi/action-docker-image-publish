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
import { Options } from './type';
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

export class Runner {
    protected options: Options;

    constructor() {
        this.options = buildOptions();
    }

    async execute() {
        const octokit = github.getOctokit(this.options.token);
        console.log(octokit);
        const hasChanged = await hasPackageChanged(octokit, this.options);
        if (!hasChanged) {
            core.info('Package path is not included.');
            return;
        }

        execSync(
            `echo "${this.options.registryPassword}" | docker login ${this.options.registryHost} -u ${this.options.registryUser} --password-stdin`,
        );

        const imageId = `${this.options.registryHost}/${this.options.registryProject}/${this.options.registryRepository}`;

        await buildImage({
            filePath: this.options.imageFile,
            imageId,
            labels: {
                runId: `${github.context.runId}`,
                runNumber: `${github.context.runNumber}`,
            },
        });

        let imageUrl : string;

        const packageVersion = await getPackageJsonVersion(path.join(process.cwd(), this.options.packagePath));
        if (packageVersion) {
            imageUrl = buildImageURL(imageId, packageVersion);

            await tagImage(imageId, imageUrl);

            await pushImage(imageUrl);

            removeImage(imageUrl);
        }

        if (this.options.imageTag) {
            imageUrl = buildImageURL(imageId, this.options.imageTag);

            tagImage(imageId, imageUrl);

            pushImage(imageUrl);

            removeImage(imageUrl);
        }

        await removeImage(imageId);
    }
}
