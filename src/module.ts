/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import Dockerode, { AuthConfig } from 'dockerode';
import path from 'path';
import { Octokit, Options } from './type';
import {
    buildImage,
    buildImageURL,
    pushImage,
    removeImage,
    tagImage,
    useDocker,
} from './daemon';
import {
    buildOptions,
} from './utils';
import { hasPackageChanged } from './utils/package';
import { getPackageJsonVersion } from './utils/package-json';

export class Runner {
    protected client: Dockerode;

    protected octokit: Octokit;

    protected options: Options;

    constructor() {
        this.options = buildOptions();
        this.octokit = github.getOctokit(this.options.token);
        this.client = new Dockerode();
    }

    async execute() {
        const hasChanged = await hasPackageChanged(this.octokit, this.options);
        if (!hasChanged) {
            core.info('Package path is not included.');
            return;
        }

        const version = await getPackageJsonVersion(path.join(process.cwd(), this.options.packagePath));
        if (!version) {
            core.error('The package version could not be determined.');
            return;
        }

        const imageName = `${this.options.registryHost}/${this.options.registryProject}/${this.options.registryRepository}`;
        const imageNameVersion = buildImageURL(imageName, version);

        await buildImage({
            filePath: this.options.imageFile,
            tag: imageNameVersion,
            labels: {
                runId: `${github.context.runId}`,
                runNumber: `${github.context.runNumber}`,
            },
        });

        const authConfig : AuthConfig = {
            username: this.options.registryUser,
            password: this.options.registryPassword,
            serveraddress: this.options.registryHost,
        };

        const image = await useDocker().getImage(imageNameVersion);

        if (this.options.imageTag) {
            if (this.options.imageTagExtra) {
                await pushImage(image, authConfig);
            }

            const imageNameTag = buildImageURL(imageName, this.options.imageTag);

            await tagImage({
                sourceImage: image,
                destinationTag: this.options.imageTag,
                destinationImage: imageName,
            });

            await pushImage(imageNameTag, authConfig);
            await removeImage(imageNameTag);
        } else {
            await pushImage(image, authConfig);
        }

        await removeImage(image);
    }
}
