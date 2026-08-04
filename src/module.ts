/*
 * Copyright (c) 2022-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import md5 from 'md5';
import path from 'node:path';
import { buildDockerImageURL } from './core/index.ts';
import type {
    Options,
    PublishContext,
    PublishResult,
} from './types.ts';
import {
    cleanDoubleSlashes,
    parseGitHubRef,
    trimRefName,
} from './utils/index.ts';

const CLONE_DIRECTORY = '.output';

export async function publish(
    options: Options,
    context: PublishContext,
) : Promise<PublishResult> {
    const {
        docker, 
        git, 
        logger, 
    } = context;

    logger.info('Booting...');

    const ref = parseGitHubRef(options.ref);
    if (!ref) {
        throw new Error(`The git ref ${options.ref} could not be parsed.`);
    }

    logger.info('Cloning repository...');

    await git.clone({
        url: cleanDoubleSlashes(`${options.serverUrl}/${options.repository}`),
        directory: CLONE_DIRECTORY,
        cwd: options.root,
        branch: ref.type === 'branch' ? ref.value : undefined,
        user: options.gitUser,
        password: options.gitPassword,
    });

    const imageId = md5(options.ref);
    const imageExists = await docker.imageExists(imageId);

    await docker.login({
        host: options.registryHost,
        user: options.registryUser,
        password: options.registryPassword,
    });

    const result : PublishResult = {
        imageId,
        built: false,
        images: [],
    };

    try {
        if (!imageExists) {
            logger.info('Image does not exist.');

            let cwd = path.join(options.root, CLONE_DIRECTORY);
            if (options.dockerFilePath.length > 0) {
                cwd = path.join(cwd, options.dockerFilePath);
            }

            const labels : Record<string, string> = {};
            if (options.runId) {
                labels.runId = options.runId;
            }
            if (options.runNumber) {
                labels.runNumber = options.runNumber;
            }

            await docker.buildImage({
                image: imageId,
                fileName: options.dockerFileName,
                cwd,
                labels,
                buildArgs: options.buildArgs,
            });

            result.built = true;
        }

        const imageBase = cleanDoubleSlashes(
            `${options.registryHost}/${options.registryRepository}`,
        ).toLowerCase();

        const tags : string[] = [];

        // an image tag derived from the git tag
        if (
            options.gitTag &&
            ref.type === 'tag' &&
            (
                options.gitTagPrefix.length === 0 ||
                ref.value.startsWith(options.gitTagPrefix)
            )
        ) {
            tags.push(trimRefName(ref.value, options.gitTagPrefix));
        }

        // the explicitly requested image tags
        if (
            ref.type !== 'tag' ||
            !options.gitTag ||
            options.registryTags.length > 0
        ) {
            tags.push(...options.registryTags);
        }

        for (const tag of tags) {
            const image = buildDockerImageURL(imageBase, tag);

            logger.info(`Tagging image ${imageId} with ${image}`);
            await docker.tagImage(imageId, image);

            logger.info(`Pushing image ${image}`);
            await docker.pushImage(image);

            await docker.removeImage(image);

            result.images.push(image);
        }

        if (options.cleanup) {
            logger.info('Deleting built image...');
            await docker.removeImage(imageId);
        }
    } finally {
        await docker.logout(options.registryHost);
    }

    logger.info('Finished.');

    return result;
}
