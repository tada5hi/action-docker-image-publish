/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import type { Options } from '../type';
import { toBoolean } from './boolean';

export function buildOptions() : Options {
    const cleanup = toBoolean(core.getInput('cleanup')) ?? true;
    const dockerFileName = core.getInput('dockerFileName') || 'Dockerfile';
    const dockerFilePath = core.getInput('dockerFilePath') || '.';

    const gitTag = toBoolean(core.getInput('gitTag')) ?? true;
    const gitTagPrefix = core.getInput('gitTagPrefix');

    const registryHost = core.getInput('registryHost', { trimWhitespace: true });
    const registryUser = core.getInput('registryUser', { trimWhitespace: true });
    const registryPassword = core.getInput('registryPassword', { trimWhitespace: true });
    const registryRepository = core.getInput('registryRepository', { trimWhitespace: true });
    const registryTags = core.getInput('registryTag')
        .split('\n')
        .map((input) => input.trim())
        .filter((x) => x !== '');

    if (registryTags.length === 0) {
        registryTags.push('latest');
    }

    return {
        cleanup,

        dockerFileName,
        dockerFilePath,

        gitTag,
        gitTagPrefix,

        registryHost,
        registryUser,
        registryPassword,
        registryRepository,
        registryTags,
    };
}
