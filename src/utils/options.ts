/*
 * Copyright (c) 2022-2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import type { Options } from '../types';
import { toBoolean } from './boolean';

export function buildOptions() : Options {
    const cleanup = toBoolean(core.getInput('cleanup')) ?? true;
    const dockerFileName = core.getInput('dockerFileName') || 'Dockerfile';
    const dockerFilePath = core.getInput('dockerFilePath') || '';

    const token = core.getInput('token', { required: true });

    const gitTag = toBoolean(core.getInput('gitTag')) ?? true;
    const gitTagPrefix = core.getInput('gitTagPrefix');
    const gitUser = core.getInput('gitUser', { required: true });
    const gitPassword = core.getInput('gitPassword', { required: true });

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

    const buildArgs = core.getInput('buildArgs')
        .split(/\r?\n/)
        .filter(Boolean);

    return {
        cleanup,

        dockerFileName,
        dockerFilePath,

        gitTag,
        gitTagPrefix,
        gitUser,
        gitPassword,

        registryHost,
        registryUser,
        registryPassword,
        registryRepository,
        registryTags,

        token,

        buildArgs,
    };
}
