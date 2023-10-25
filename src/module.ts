/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { execSync } from 'node:child_process';
import md5 from 'md5';
import {
    buildDockerImage,
    buildDockerImageURL,
    checkDockerImage,
    pushDockerImage,
    removeDockerImage,
    tagDockerImage,
} from './docker';
import {
    buildOptions,
    parseGitHubRef,
    trimRefName,
} from './utils';

export async function execute() {
    core.info('Booting...');

    const options = buildOptions();

    const ref = parseGitHubRef(github.context.ref);
    if (!ref) {
        core.error('The GitHub ref could not be parsed.');
        return;
    }

    const imageId = md5(github.context.ref);
    const imageExists = await checkDockerImage(imageId);

    execSync(
        `echo "${options.registryPassword}" | docker login ${options.registryHost} -u ${options.registryUser} --password-stdin`,
    );

    if (!imageExists) {
        core.info('Image does not exist.');

        await buildDockerImage({
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
        core.info('Creating docker tags for git tags.');

        if (
            options.gitTagPrefix.length === 0 ||
            ref.value.startsWith(options.gitTagPrefix)
        ) {
            imageUrl = buildDockerImageURL(
                imageIdRemote,
                trimRefName(ref.value, options.gitTagPrefix),
            );

            await tagDockerImage(imageId, imageUrl);

            await pushDockerImage(imageUrl);

            await removeDockerImage(imageUrl);
        }

        core.info('Created docker tags for git tags.');
    }

    // ----------------------------------------------------

    if (
        ref.type !== 'tag' ||
        !options.gitTag ||
        options.registryTags.length > 0
    ) {
        core.info('Creating docker tags for git tags.');

        for (let i = 0; i < options.registryTags.length; i++) {
            imageUrl = buildDockerImageURL(imageIdRemote, options.registryTags[i]);

            await tagDockerImage(imageId, imageUrl);

            await pushDockerImage(imageUrl);

            await removeDockerImage(imageUrl);
        }

        core.info('Created docker tags for git tags.');
    }

    // ----------------------------------------------------

    if (!options.cache) {
        await removeDockerImage(imageId);
    }

    execSync(`docker logout ${options.registryHost}`);

    core.info('Finished.');
}
