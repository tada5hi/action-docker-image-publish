/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import path from 'node:path';
import { executeDockerCommand } from './execute';

export type ImageBuildContext = {
    imageId: string,
    fileName: string,
    cwd: string,
    labels?: Record<string, string>
};

export async function buildDockerImage(context: ImageBuildContext) {
    core.notice(`Building image: ${context.imageId}`);

    let command = 'build .';

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

    const parts : string[] = [];
    for (let i = 0; i < options.length; i++) {
        const [key, value] = options[i];

        parts.push(`--${key} ${value}`);
    }

    if (parts.length > 0) {
        command += ` ${parts.join(' ')}`;
    }

    let cwd = context.cwd || process.cwd();
    if (!path.isAbsolute(cwd)) {
        cwd = path.join(process.cwd(), cwd);
    }

    await executeDockerCommand(command, {
        cwd,
    });

    core.notice('Built image');
}
