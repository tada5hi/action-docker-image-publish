/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { executeDockerCommand } from './execute';

export function pushImage(name: string) {
    core.notice('Pushing image.');

    executeDockerCommand(`push ${name}`);

    core.info('Pushed image.');
}
