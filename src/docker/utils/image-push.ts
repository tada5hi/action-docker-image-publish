/*
 * Copyright (c) 2022-2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { executeDockerCommand } from './execute';

export async function pushDockerImage(name: string) {
    core.notice(`Pushing image: ${name}`);

    await executeDockerCommand(`push ${name}`);

    core.notice('Pushed image');
}
