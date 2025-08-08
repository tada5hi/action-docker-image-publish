/*
 * Copyright (c) 2022-2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { executeDockerCommand } from './execute';

export async function tagDockerImage(source: string, destination: string) {
    core.notice(`Tagging image ${source} with ${destination}`);

    await executeDockerCommand(
        `tag ${source} ${destination}`,
    );

    core.notice('Tagged image');
}
