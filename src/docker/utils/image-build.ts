/*
 * Copyright (c) 2022-2025.
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
    labels?: Record<string, string>,
    buildArgs?: Record<string, string> | string[]
};

export async function buildDockerImage(context: ImageBuildContext) {
    core.notice(`Building image: ${context.imageId}`);

    let command = 'build .';

    const commandArgs : [string, string][] = [
        ['file', context.fileName],
        ['tag', context.imageId],
    ];

    if (context.labels) {
        const keys = Object.keys(context.labels);
        for (let i = 0; i < keys.length; i++) {
            commandArgs.push(['label', `"${keys[i]}=${context.labels[keys[i]]}"`]);
        }
    }

    if (context.buildArgs) {
        if (Array.isArray(context.buildArgs)) {
            for (let i = 0; i < context.buildArgs.length; i++) {
                commandArgs.push(['build-arg', `${context.buildArgs[i]}`]);
            }
        } else {
            const keys = Object.keys(context.buildArgs);
            for (let i = 0; i < keys.length; i++) {
                commandArgs.push(['build-arg', `${keys[i]}=${context.buildArgs[keys[i]]}`]);
            }
        }
    }

    const parts : string[] = [];
    for (let i = 0; i < commandArgs.length; i++) {
        const [key, value] = commandArgs[i];

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
