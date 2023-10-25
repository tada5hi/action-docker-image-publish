/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { executeDockerCommand } from './execute';

export async function removeDockerImage(image: string) {
    core.info(`Removing image ${image}.`);
    await executeDockerCommand(`image rm --force ${image}`);
    core.info('Removed image.');
}
