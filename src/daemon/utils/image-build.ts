/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { executeDockerCommand } from './execute';

export type ImageBuildContext = {
    imageId: string,
    fileName: string,
    filePath: string,
    labels?: Record<string, string>
};

export function buildImage(context: ImageBuildContext) {
    core.notice(`Building docker image: ${context.imageId}`);

    const options : [string, string][] = [
        ['file', context.fileName],
        ['tag', context.imageId],
    ];
    if (context.labels) {
        const keys = Object.keys(context.labels);
        for (let i = 0; i < keys.length; i++) {
            options.push(['label', `"${keys[i]}=${context.labels[keys[i]]}"`]);
        }
    }

    executeDockerCommand(`build ${context.filePath}`, options);

    core.notice('Built docker image');
}
