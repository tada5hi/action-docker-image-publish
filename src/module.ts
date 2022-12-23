/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import Dockerode, { AuthConfig } from 'dockerode';
import * as fs from 'fs';
import path from 'path';
import { hasOwnProperty, isObject } from 'smob';
import { Options } from './type';
import {
    buildDockerImage,
    buildImageURL,
    buildOptions,
    pushImage,
    removeImage,
    tagImage,
    useDocker, withoutLeadingSlash,
} from './utils';

export class Runner {
    protected client: Dockerode;

    protected octokit: ReturnType<typeof github.getOctokit>;

    protected options: Options;

    constructor() {
        this.options = buildOptions();
        this.octokit = github.getOctokit(this.options.secret);
        this.client = new Dockerode();
    }

    async isPackageIncluded() : Promise<boolean> {
        if (this.options.packagePath === '.') {
            return true;
        }

        const packagePath = withoutLeadingSlash(this.options.packagePath);

        const commit = await this.octokit.rest.repos.getCommit({
            owner: this.options.registryProject,
            repo: this.options.registryRepository,
            ref: github.context.ref,
        });

        for (let i = 0; i < commit.data.files.length; i++) {
            if (commit.data.files[i].filename.startsWith(packagePath)) {
                return true;
            }
        }

        return false;
    }

    async getPackageVersion() : Promise<string | undefined> {
        const filePath = path.join(process.cwd(), this.options.packagePath, 'package.json');

        try {
            await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
        } catch (e) {
            return undefined;
        }

        const rawFile = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
        const file = JSON.parse(rawFile);

        if (
            isObject(file) &&
            hasOwnProperty(file, 'version') &&
            typeof file.version === 'string'
        ) {
            return file.version;
        }

        return undefined;
    }

    get authConfig() : AuthConfig {
        return {
            username: this.options.registryUser,
            password: this.options.registryPassword,
            serveraddress: this.options.registryHost,
        };
    }

    async execute() {
        const isIncluded = await this.isPackageIncluded();
        if (!isIncluded) {
            core.info('Package path is not included.');
            return;
        }

        const version = await this.getPackageVersion();
        if (!version) {
            core.error('The package version could not be determined.');
            return;
        }

        const imageName = `${this.options.registryHost}/${this.options.registryProject}/${this.options.registryRepository}`;
        const imageNameVersion = buildImageURL(imageName, version);

        await buildDockerImage({
            filePath: this.options.imageFile,
            tag: imageNameVersion,
            labels: {
                runId: `${github.context.runId}`,
                runNumber: `${github.context.runNumber}`,
            },
        });

        const image = await useDocker().getImage(imageNameVersion);

        if (this.options.imageTag) {
            if (this.options.imageTagExtra) {
                await pushImage(image, this.authConfig);
            }

            const imageNameTag = buildImageURL(imageName, this.options.imageTag);

            await tagImage({
                sourceImage: image,
                destinationTag: this.options.imageTag,
                destinationImage: imageName,
            });

            await pushImage(imageNameTag, this.authConfig);
            await removeImage(imageNameTag);
        } else {
            await pushImage(image, this.authConfig);
        }

        await removeImage(image);
    }
}
